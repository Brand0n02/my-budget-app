import { useState, useEffect } from 'react';
import { PlusIcon, ChartBarIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import { ConfettiAnimation } from '../ui';
import '../../styles/glass.css';

const BudgetPlanCard = ({ budgets = [], addTransaction }) => {
  const { updateBudget, deleteBudget } = useData();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebratingBudgetId, setCelebratingBudgetId] = useState(null);

  const handleLogExpense = (budget) => {
    setSelectedBudget(budget);
    setShowExpenseModal(true);
  };

  const handleExpenseSubmit = async (amount, description, transferFrom) => {
    if (!selectedBudget || !amount) return;
    
    try {
      const newSpent = Number(selectedBudget.spent || 0) + amount;
      
      await updateBudget(selectedBudget.id, { spent: newSpent });
      
      // If transferring from Total Balance, create a transaction to subtract from main balance
      if (transferFrom === 'Total Balance' && addTransaction) {
        const mainBalanceTransaction = {
          amount: -amount, // Negative to subtract from main balance
          description: `Budget expense for ${selectedBudget.category} (from Total Balance)`,
          category: 'Transfer',
          type: 'expense',
          date: new Date().toISOString(),
          budgetId: selectedBudget.id
        };
        await addTransaction(mainBalanceTransaction);
      }
      
      setShowExpenseModal(false);
      setSelectedBudget(null);
    } catch (error) {
      console.error('Error logging budget expense:', error);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!confirm('Are you sure you want to delete this budget category?')) return;
    
    try {
      await deleteBudget(budgetId);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleCompleteBudget = async (budget) => {
    try {
      // Mark as completed by setting spent to allocated amount
      await updateBudget(budget.id, { 
        spent: budget.allocated,
        completed: true 
      });
      
      // Trigger celebration
      setTimeout(() => {
        setShowConfetti(true);
        setCelebratingBudgetId(budget.id);
      }, 300);
    } catch (error) {
      console.error('Error completing budget:', error);
    }
  };

  const budgetColors = [
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Green', class: 'bg-green-500' },
    { name: 'Yellow', class: 'bg-yellow-500' },
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Orange', class: 'bg-orange-500' }
  ];

  const budgetCategories = [
    '🏠 Rent', '🛒 Groceries', '🚗 Transportation', '⚡ Utilities', 
    '🎮 Entertainment', '👕 Shopping', '🍽️ Dining', '💊 Healthcare',
    '📚 Education', '🏖️ Travel', '💳 Debt', '💰 Savings'
  ];

  // Listen for external triggers to open the add budget modal
  useEffect(() => {
    const handleExternalTrigger = () => {
      // The modal is now handled in the main App component
    };

    document.addEventListener('openBudgetModal', handleExternalTrigger);
    return () => document.removeEventListener('openBudgetModal', handleExternalTrigger);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProgress = (spent, allocated) => {
    return Math.min((spent / allocated) * 100, 100);
  };


  const getStatusText = (spent, allocated) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) return 'Over budget!';
    if (percentage >= 90) return 'Almost at limit';
    if (percentage >= 75) return 'Getting close';
    if (percentage >= 50) return 'Halfway there';
    return 'On track';
  };

  // Budgets are now managed in the main App component
  // This component just displays the budgets passed as props

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <div className="glass-card">
      {/* Elegant background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-xl"></div>
      
      {/* Subtle glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <div className="w-4 h-4 rounded-sm bg-white/90"></div>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-1">
                Budget Plan
              </h3>
              <p className="text-slate-400 text-sm">Manage your spending</p>
            </div>
          </div>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('openBudgetModal'))}
            className="p-3 rounded-lg bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600/50 transition-all duration-200 group/btn"
          >
            <PlusIcon className="w-6 h-6 text-slate-300 group-hover/btn:text-white transition-colors duration-200" />
          </button>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/50 p-8 hover:border-slate-600/60 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-base font-semibold">Total Allocated</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totalAllocated)}
            </p>
          </div>
          
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/50 p-8 hover:border-slate-600/60 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-slate-400 text-base font-semibold">Total Spent</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-sm text-slate-500 font-medium mt-4">
              {formatCurrency(totalAllocated - totalSpent)} remaining
            </p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-6">
          <div className="border-t border-slate-700/50 pt-8 mb-8">
            <h4 className="text-white text-xl font-semibold">Budget Categories</h4>
          </div>
          
          {budgets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <h4 className="text-white text-xl font-semibold mb-4">No budget categories yet</h4>
              <p className="text-slate-400 text-base mb-8">Create categories to track your spending!</p>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('openBudgetModal'))}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                Create Budget
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {budgets.map((budget) => {
                const progress = calculateProgress(budget.spent, budget.allocated);
                const statusText = getStatusText(budget.spent, budget.allocated);
                const percentage = (budget.spent / budget.allocated) * 100;

                return (
                  <div
                    key={budget.id}
                    className={`group/budget backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:bg-slate-800/60 ${
                      budget.completed 
                        ? 'bg-emerald-900/20 border-emerald-500/30 hover:border-emerald-400/50' 
                        : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-5 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                          <span className="text-2xl">{budget.category.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-semibold text-xl">
                              {budget.category.split(' ').slice(1).join(' ')}
                            </h4>
                            {budget.completed && (
                              <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-base font-medium">
                            {formatCurrency(budget.spent)} of {formatCurrency(budget.allocated)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleLogExpense(budget)}
                          className="group/expense px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 hover:from-blue-500/30 hover:to-emerald-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 text-sm rounded-xl transition-all duration-300 font-semibold hover:scale-105 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span>Track Expense</span>
                        </button>
                        
                        <button
                          onClick={() => handleCompleteBudget(budget)}
                          className="group/complete p-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-xl transition-all duration-300 hover:scale-105"
                          title="Mark as completed"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="group/delete p-2.5 bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 hover:scale-105"
                          title="Delete budget"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-slate-400 mb-3">
                        <span className={`font-semibold ${
                          percentage >= 100 
                            ? 'bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent' 
                            : percentage >= 90 
                            ? 'bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                        <span className="font-medium">
                          {budget.spent > budget.allocated 
                            ? `${formatCurrency(budget.spent - budget.allocated)} over budget!`
                            : `${formatCurrency(budget.allocated - budget.spent)} left`
                          }
                        </span>
                      </div>
                      <div className="relative w-full bg-slate-700/50 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-slate-600/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-full"></div>
                        
                        {/* Normal progress (up to 100%) */}
                        <div
                          className="relative h-4 rounded-full transition-all duration-700 ease-out shadow-lg bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-400 shadow-emerald-500/25"
                          style={{ 
                            width: `${Math.min(progress, 100)}%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                        </div>
                        
                        {/* Overflow progress (beyond 100%) */}
                        {percentage > 100 && (
                          <div
                            className="absolute top-0 left-0 h-4 rounded-full transition-all duration-700 ease-out shadow-lg bg-gradient-to-r from-red-500 via-rose-500 to-red-400 shadow-red-500/50"
                            style={{ 
                              width: `${Math.min(percentage, 150)}%`, // Cap at 150% for visual purposes
                              opacity: 0.9
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/40 to-transparent rounded-full"></div>
                            
                            {/* Animated pulse effect for overflow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-rose-400/30 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-sm">
                      <span className={`font-medium ${
                        percentage >= 100 
                          ? 'text-rose-400 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent' 
                          : percentage >= 90
                          ? 'text-orange-400 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'
                          : 'text-slate-400'
                      }`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-slate-900/50 w-full max-w-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Log Expense</h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
              >
                <svg className="w-5 h-5 text-slate-400 hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 text-sm mb-2 font-medium">
                Logging expense for: <span className="text-emerald-400 font-semibold">{selectedBudget?.category}</span>
              </p>
              <p className="text-slate-400 text-xs">
                Spent: <span className="text-slate-300 font-medium">{formatCurrency(Number(selectedBudget?.spent) || 0)}</span> / <span className="text-slate-300 font-medium">{formatCurrency(Number(selectedBudget?.allocated) || 0)}</span>
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const amount = parseFloat(e.target.amount.value);
              const description = e.target.description.value;
              const transferFrom = e.target.transferFrom.value;
              if (amount > 0) {
                handleExpenseSubmit(amount, description, transferFrom);
              }
            }}>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-slate-400 mb-3 block font-semibold">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    required
                    className="w-full bg-slate-800/50 border border-slate-600/30 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800/70 transition-all duration-300 font-medium text-lg"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-3 block font-semibold">Description (optional)</label>
                  <input
                    type="text"
                    name="description"
                    className="w-full bg-slate-800/50 border border-slate-600/30 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800/70 transition-all duration-300 font-medium"
                    placeholder="What was this expense for?"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-3 block font-semibold">Transfer from</label>
                  <select
                    name="transferFrom"
                    required
                    className="w-full bg-slate-800/50 border border-slate-600/30 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800/70 transition-all duration-300 font-medium"
                  >
                    <option value="Total Balance">💳 Total Balance</option>
                    <option value="Other">📝 Other</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-200 rounded-2xl transition-all duration-300 font-semibold border border-slate-600/30 hover:border-slate-500/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold border hover:scale-[1.02] bg-gradient-to-r from-blue-500/20 to-emerald-500/20 hover:from-blue-500/30 hover:to-emerald-500/30 border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      <ConfettiAnimation 
        isActive={showConfetti}
        type="budget"
        onComplete={() => {
          setShowConfetti(false);
          setCelebratingBudgetId(null);
        }}
      />
    </div>
  );
};

export default BudgetPlanCard; 
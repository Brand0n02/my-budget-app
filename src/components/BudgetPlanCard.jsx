import { useState, useEffect } from 'react';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const BudgetPlanCard = ({ budgets = [] }) => {
  const { updateBudget } = useData();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleLogExpense = (budget) => {
    setSelectedBudget(budget);
    setShowExpenseModal(true);
  };

  const handleExpenseSubmit = async (amount, description) => {
    if (!selectedBudget || !amount) return;
    
    try {
      const newSpent = Number(selectedBudget.spent || 0) + amount;
      
      await updateBudget(selectedBudget.id, { spent: newSpent });
      
      setShowExpenseModal(false);
      setSelectedBudget(null);
    } catch (error) {
      console.error('Error logging budget expense:', error);
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
    <div className="group relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/50 border border-slate-700/50 p-8 overflow-hidden hover:shadow-slate-900/70 transition-all duration-500 hover:scale-[1.01]">
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-blue-500/[0.03]"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Budget Plan</h3>
          </div>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('openBudgetModal'))}
            className="group/btn p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-110"
          >
            <PlusIcon className="w-5 h-5 text-emerald-400 group-hover/btn:text-emerald-300 transition-colors duration-300" />
          </button>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <ChartBarIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm font-semibold">Total Allocated</span>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {formatCurrency(totalAllocated)}
            </p>
          </div>
          
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm font-semibold">Total Spent</span>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              <span className="text-slate-400">{formatCurrency(totalAllocated - totalSpent)}</span> remaining
            </p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-4">
          <h4 className="text-slate-300 font-semibold mb-6 text-lg">Budget Categories</h4>
          
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center border border-emerald-500/30">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-slate-300 text-lg font-semibold mb-2">No budget categories yet</h4>
              <p className="text-slate-500 text-sm mb-6">Start planning your budget by creating categories!</p>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('openBudgetModal'))}
                className="group/create bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 px-6 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 mx-auto font-semibold hover:scale-105"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center group-hover/create:bg-emerald-400/30 transition-colors duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>Create Budget Plan</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const progress = calculateProgress(budget.spent, budget.allocated);
                const statusText = getStatusText(budget.spent, budget.allocated);
                const percentage = (budget.spent / budget.allocated) * 100;

                return (
                  <div
                    key={budget.id}
                    className="group/budget bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                          <span className="text-2xl">{budget.category.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg">
                            {budget.category.split(' ').slice(1).join(' ')}
                          </h4>
                          <p className="text-slate-400 text-sm font-medium">
                            {formatCurrency(budget.spent)} of {formatCurrency(budget.allocated)}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleLogExpense(budget)}
                        className="group/expense px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 hover:from-blue-500/30 hover:to-emerald-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 text-sm rounded-xl transition-all duration-300 font-semibold hover:scale-105 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Log Expense</span>
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span className={`font-semibold ${
                          percentage >= 90 
                            ? 'bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent' 
                            : percentage >= 75
                            ? 'bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'
                        }`}>
                          {progress.toFixed(1)}%
                        </span>
                        <span className="font-medium">{formatCurrency(budget.allocated - budget.spent)} left</span>
                      </div>
                      <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-slate-600/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-full"></div>
                        <div
                          className={`relative h-3 rounded-full transition-all duration-700 ease-out shadow-lg ${
                            percentage >= 90 
                              ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-400 shadow-rose-500/25' 
                              : percentage >= 75
                              ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 shadow-orange-500/25'
                              : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-400 shadow-emerald-500/25'
                          }`}
                          style={{ 
                            width: `${progress}%`,
                            transform: `scaleX(${progress / 100})`,
                            transformOrigin: 'left'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-xs">
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
              if (amount > 0) {
                handleExpenseSubmit(amount, description);
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
    </div>
  );
};

export default BudgetPlanCard; 
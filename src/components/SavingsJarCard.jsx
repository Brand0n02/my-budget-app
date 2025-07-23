import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const SavingsJarCard = ({ goals = [] }) => {
  const { deleteGoal, updateGoal } = useData();
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'add' or 'withdraw'
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const handleAddMoney = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    setSelectedGoal(goal);
    setModalAction('add');
    setShowAmountModal(true);
  };

  const handleWithdrawMoney = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    setSelectedGoal(goal);
    setModalAction('withdraw');
    setShowAmountModal(true);
  };

  const handleAmountSubmit = async (amount) => {
    if (!selectedGoal || !amount) return;
    
    try {
      const currentAmount = Number(selectedGoal.current) || 0;
      let newAmount;
      
      if (modalAction === 'add') {
        newAmount = currentAmount + amount;
      } else {
        newAmount = Math.max(0, currentAmount - amount);
      }
      
      await updateGoal(selectedGoal.id, { current: newAmount });
      
      setShowAmountModal(false);
      setSelectedGoal(null);
      setModalAction(null);
    } catch (error) {
      console.error('Error updating savings jar:', error);
    }
  };
  // Listen for external triggers to open the add goal modal
  useEffect(() => {
    const handleExternalTrigger = () => {
      // The modal is now handled in the main App component
    };

    document.addEventListener('openSavingsModal', handleExternalTrigger);
    return () => document.removeEventListener('openSavingsModal', handleExternalTrigger);
  }, []);

  const goalIcons = ['🫙', '🏠', '🚗', '✈️', '💍', '🎓', '💻', '🏖️', '🎮', '📱', '🛡️', '💰'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  // Goals are now managed in the main App component
  // This component just displays the goals passed as props

  return (
    <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-xl shadow-slate-900/20 p-10 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 hover:border-slate-600/50">
      {/* Elegant background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 rounded-xl"></div>
      
      {/* Subtle glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <div className="w-4 h-4 rounded-sm bg-white/90"></div>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-1">
                Savings Jars
              </h3>
              <p className="text-slate-400 text-sm">Track your progress</p>
            </div>
          </div>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('openSavingsModal'))}
            className="p-3 rounded-lg bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600/50 transition-all duration-200 group/btn"
          >
            <PlusIcon className="w-6 h-6 text-slate-300 group-hover/btn:text-white transition-colors duration-200" />
          </button>
        </div>

      {/* Goals List */}
      <div className="space-y-8">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-3xl">🫙</span>
            </div>
            <h4 className="text-white text-lg font-semibold mb-2">No Savings Jars yet</h4>
            <p className="text-slate-400 text-sm mb-6">Create your first goal to start saving!</p>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('openSavingsModal'))}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              Create Goal
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            // Ensure current is a number (Firebase might return null/undefined)
            const currentAmount = Number(goal.current) || 0;
            const targetAmount = Number(goal.target) || 1;
            
            const progress = calculateProgress(currentAmount, targetAmount);
            const daysLeft = goal.deadline ? getDaysLeft(goal.deadline) : null;
            const remaining = targetAmount - currentAmount;

            return (
              <div
                key={goal.id}
                className="group/goal bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/50 p-8 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/50"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-5 flex-1">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                      <span className="text-2xl">{goal.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-xl mb-2">{goal.name}</h4>
                      <p className="text-slate-400 text-base">
                        {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 opacity-0 group-hover/goal:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleAddMoney(goal.id)}
                      className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 transition-all duration-200"
                      title="Add Money"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleWithdrawMoney(goal.id)}
                      className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-500/50 text-orange-400 hover:text-orange-300 transition-all duration-200"
                      title="Withdraw Money"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 hover:text-rose-300 transition-all duration-200"
                      title="Delete Goal"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-slate-400 mb-3">
                    <span className="font-semibold text-amber-400">{progress.toFixed(1)}%</span>
                    <span>{formatCurrency(remaining)} remaining</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm">
                  <span className={remaining > 0 ? 'text-slate-400' : 'text-emerald-400 font-semibold'}>
                    {remaining > 0 ? `${formatCurrency(remaining)} to go` : 'Goal completed! 🎉'}
                  </span>
                  {daysLeft !== null && (
                    <span className={`${daysLeft < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>

      {/* Amount Input Modal */}
      {showAmountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-slate-900/50 w-full max-w-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {modalAction === 'add' ? 'Add Money' : 'Withdraw Money'}
              </h3>
              <button
                onClick={() => setShowAmountModal(false)}
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
              >
                <svg className="w-5 h-5 text-slate-400 hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 text-sm mb-2 font-medium">
                {modalAction === 'add' ? 'Adding money to' : 'Withdrawing money from'}: <span className="text-amber-400 font-semibold">{selectedGoal?.name}</span>
              </p>
              <p className="text-slate-400 text-xs">
                Current: <span className="text-slate-300 font-medium">{formatCurrency(Number(selectedGoal?.current) || 0)}</span> / <span className="text-slate-300 font-medium">{formatCurrency(Number(selectedGoal?.target) || 0)}</span>
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const amount = parseFloat(e.target.amount.value);
              if (amount > 0) {
                handleAmountSubmit(amount);
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
                    className="w-full bg-slate-800/50 border border-slate-600/30 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800/70 transition-all duration-300 font-medium text-lg"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAmountModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-200 rounded-2xl transition-all duration-300 font-semibold border border-slate-600/30 hover:border-slate-500/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold border hover:scale-[1.02] ${
                    modalAction === 'add'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300'
                      : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border-orange-500/30 hover:border-orange-500/50 text-orange-400 hover:text-orange-300'
                  }`}
                >
                  {modalAction === 'add' ? 'Add Money' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsJarCard; 
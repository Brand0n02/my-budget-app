import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

const SavingsGoals = ({ balance }) => {
  const { goals, loading, addGoal, deleteGoal } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    icon: '🎯'
  });

  const goalIcons = ['🎯', '🏠', '🚗', '✈️', '💍', '🎓', '💻', '🏖️', '🎮', '📱', '🛡️', '💰'];



  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    try {
      const goal = {
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        icon: newGoal.icon,
        color: 'bg-purple-500'
      };

      await addGoal(goal);
      setNewGoal({ name: '', target: '', icon: '🎯' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRemainingColor = (goal) => {
    const progress = calculateProgress(goal.current, goal.target);
    if (progress >= 75) return 'text-green-400';
    if (progress >= 50) return 'text-blue-400';
    if (progress >= 25) return 'text-orange-400';
    return 'text-purple-400';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-green-500/10 border border-gray-600/20 p-8 min-h-64">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-gray-400 text-base">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-green-500/10 border border-gray-600/20 p-8 min-h-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Savings Jars</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors"
        >
          <PlusIcon className="w-5 h-5 text-yellow-400" />
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-white/10">
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Emergency Fund"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Target Amount</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                  placeholder="5000"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {goalIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewGoal(prev => ({ ...prev, icon }))}
                    className={`p-2 rounded-lg text-lg transition-all ${
                      newGoal.icon === icon
                        ? 'bg-yellow-500/20 border border-yellow-500/50'
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-400 text-sm">No Savings Jars yet</p>
            <p className="text-gray-500 text-xs">Add a goal to start tracking your progress!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target);
            const remaining = goal.target - goal.current;
            
            return (
              <div
                key={goal.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-white/5 hover:border-yellow-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{goal.icon}</div>
                    <div>
                      <h4 className="text-white font-medium">{goal.name}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-all duration-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{formatCurrency(goal.current)} of {formatCurrency(goal.target)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Remaining Amount */}
                <div className="text-sm">
                  <span className={`${getRemainingColor(goal)}`}>
                    {formatCurrency(remaining)} to go
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsGoals; 
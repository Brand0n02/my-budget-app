import { useState } from 'react';
import { XMarkIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAchievements } from '../../contexts/AchievementsContext';

const AchievementsPanel = ({ isOpen, onClose }) => {
  const { achievements, stats, getCurrentYearAchievements, getAchievementProgress, ACHIEVEMENT_TYPES } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const currentYear = new Date().getFullYear();
  const currentYearAchievements = getCurrentYearAchievements();
  const progress = getAchievementProgress();

  const categories = {
    all: { name: 'All', icon: '🏆' },
    savings: { name: 'Savings', icon: '💰' },
    budget: { name: 'Budget', icon: '📊' },
    consistency: { name: 'Consistency', icon: '🔥' },
    special: { name: 'Special', icon: '🌟' }
  };

  const getCategoryAchievements = (category) => {
    if (category === 'all') return Object.values(ACHIEVEMENT_TYPES);
    
    const categoryMap = {
      savings: ['FIRST_GOAL', 'GOAL_STREAK_5', 'SAVINGS_1K', 'SAVINGS_5K', 'SAVINGS_10K', 'OVER_ACHIEVER'],
      budget: ['BUDGET_MASTER', 'PENNY_PINCHER'],
      consistency: ['CONSISTENT_SAVER', 'MONTHLY_SAVER', 'SPEED_SAVER'],
      special: ['NEW_YEAR_SAVER', 'FINANCIAL_PLANNER']
    };
    
    return categoryMap[category]?.map(id => ACHIEVEMENT_TYPES[id]) || [];
  };

  const isAchievementUnlocked = (achievementId) => {
    return currentYearAchievements.some(a => a.id === achievementId);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'uncommon': return 'from-green-500 to-green-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'legendary': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/30';
      case 'uncommon': return 'border-green-500/30';
      case 'rare': return 'border-blue-500/30';
      case 'legendary': return 'border-purple-500/30 shadow-purple-500/20';
      default: return 'border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] transition-all duration-300 ease-in-out pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-96 max-w-sm glass-card border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-[10000] translate-x-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Achievements {currentYear}
                </h3>
                <p className="text-slate-400 text-sm">
                  {progress.unlocked}/{progress.total} unlocked • {progress.points} points
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              <XMarkIcon className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {/* Stats Overview */}
          <div className="p-6 border-b border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-emerald-400">{stats.goalsCompleted}</div>
                <div className="text-xs text-slate-400">Goals Completed</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-amber-400">
                  ${(stats.totalSaved || 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Total Saved</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-orange-400">{stats.currentSavingStreak}</div>
                <div className="text-xs text-slate-400">Current Streak</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-purple-400">{progress.points}</div>
                <div className="text-xs text-slate-400">Achievement Points</div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 p-4 border-b border-white/20 overflow-x-auto">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === key
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Achievements List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {getCategoryAchievements(selectedCategory).map((achievement) => {
                const isUnlocked = isAchievementUnlocked(achievement.id);
                const unlockedData = currentYearAchievements.find(a => a.id === achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      isUnlocked
                        ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 ${getRarityBorder(achievement.rarity)} shadow-lg`
                        : 'bg-slate-800/30 border-slate-700/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        isUnlocked 
                          ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} shadow-lg` 
                          : 'bg-slate-700/50'
                      }`}>
                        {isUnlocked ? achievement.icon : '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-semibold ${
                            isUnlocked ? 'text-white' : 'text-slate-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: achievement.rarity === 'legendary' ? 4 : achievement.rarity === 'rare' ? 3 : achievement.rarity === 'uncommon' ? 2 : 1 }).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-3 h-3 ${
                                  isUnlocked 
                                    ? achievement.rarity === 'legendary' ? 'text-purple-400' :
                                      achievement.rarity === 'rare' ? 'text-blue-400' :
                                      achievement.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-400'
                                    : 'text-slate-600'
                                }`}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <p className={`text-sm mb-2 ${
                          isUnlocked ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-lg ${
                            isUnlocked 
                              ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                              : 'bg-slate-700/50 text-slate-500'
                          }`}>
                            +{achievement.points} points
                          </span>
                          {isUnlocked && unlockedData && (
                            <span className="text-xs text-slate-400">
                              {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">
                Progress: {progress.unlocked}/{progress.total} achievements
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                  style={{ width: `${(progress.unlocked / progress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel;
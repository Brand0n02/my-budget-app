import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAchievements } from '../../contexts/AchievementsContext';

const AchievementsCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { achievements, getCurrentYearAchievements, getAchievementProgress, ACHIEVEMENT_TYPES } = useAchievements();

  const currentYear = new Date().getFullYear();
  const currentYearAchievements = getCurrentYearAchievements();
  const progress = getAchievementProgress();

  // Get recent achievements (last 3)
  const recentAchievements = currentYearAchievements
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 3);

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

  const isAchievementUnlocked = (achievementId) => {
    return currentYearAchievements.some(a => a.id === achievementId);
  };

  const getNextAchievements = () => {
    return Object.values(ACHIEVEMENT_TYPES)
      .filter(achievement => !isAchievementUnlocked(achievement.id))
      .slice(0, 5);
  };

  if (!isExpanded) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
            onClick={() => setIsExpanded(true)}
            className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-400 hover:text-white"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm text-amber-400 font-medium">
              {Math.round((progress.unlocked / progress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
              style={{ width: `${(progress.unlocked / progress.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-4">Recent Unlocks</h4>
          {currentYearAchievements.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-slate-400 text-sm">No achievements yet</p>
              <p className="text-slate-500 text-xs">Start saving to unlock your first achievement!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all duration-300 bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 ${getRarityBorder(achievement.rarity)} shadow-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-r ${getRarityColor(achievement.rarity)} shadow-lg`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-white text-sm">{achievement.title}</h5>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: achievement.rarity === 'legendary' ? 4 : achievement.rarity === 'rare' ? 3 : achievement.rarity === 'uncommon' ? 2 : 1 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-3 h-3 ${
                                achievement.rarity === 'legendary' ? 'text-purple-400' :
                                achievement.rarity === 'rare' ? 'text-blue-400' :
                                achievement.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-400'
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs">{achievement.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                          +{achievement.points} points
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Expanded Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              All Achievements {currentYear}
            </h3>
            <p className="text-slate-400 text-sm">
              {progress.unlocked}/{progress.total} unlocked • {progress.points} points
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-400 hover:text-white"
        >
          <ChevronUpIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Overall Progress</span>
          <span className="text-sm text-amber-400 font-medium">
            {Math.round((progress.unlocked / progress.total) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${(progress.unlocked / progress.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Expanded Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Unlocked Achievements */}
        {currentYearAchievements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Unlocked ({currentYearAchievements.length})</h4>
            <div className="space-y-3">
              {currentYearAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border transition-all duration-300 bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 ${getRarityBorder(achievement.rarity)} shadow-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} shadow-lg`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-white text-sm">{achievement.title}</h5>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: achievement.rarity === 'legendary' ? 4 : achievement.rarity === 'rare' ? 3 : achievement.rarity === 'uncommon' ? 2 : 1 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-2 h-2 ${
                                achievement.rarity === 'legendary' ? 'text-purple-400' :
                                achievement.rarity === 'rare' ? 'text-blue-400' :
                                achievement.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-400'
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                          +{achievement.points} points
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next to Unlock */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Next to Unlock</h4>
          <div className="space-y-3">
            {getNextAchievements().map((achievement) => (
              <div
                key={achievement.id}
                className="p-3 rounded-lg border bg-slate-800/30 border-slate-700/50 opacity-60"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-slate-700/50">
                    🔒
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-slate-500 text-sm">{achievement.title}</h5>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: achievement.rarity === 'legendary' ? 4 : achievement.rarity === 'rare' ? 3 : achievement.rarity === 'uncommon' ? 2 : 1 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className="w-2 h-2 text-slate-600"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mb-2">{achievement.description}</p>
                    <span className="text-xs px-2 py-1 rounded-lg bg-slate-700/50 text-slate-500">
                      +{achievement.points} points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsCard;
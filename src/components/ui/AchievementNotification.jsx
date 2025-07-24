import { useState, useEffect } from 'react';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline';

const AchievementNotification = () => {
  const [achievement, setAchievement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      const newAchievement = event.detail;
      setAchievement(newAchievement);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setAchievement(null), 500);
      }, 5000);
    };

    document.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    return () => document.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
  }, []);

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
      case 'common': return 'border-gray-500/50';
      case 'uncommon': return 'border-green-500/50';
      case 'rare': return 'border-blue-500/50';
      case 'legendary': return 'border-purple-500/50 shadow-purple-500/30';
      default: return 'border-gray-500/50';
    }
  };

  if (!achievement || !isVisible) return null;

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`
        bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white px-8 py-6 rounded-2xl shadow-2xl border-2 ${getRarityBorder(achievement.rarity)}
        backdrop-blur-sm min-w-[400px] max-w-[500px] animate-bounce
      `}>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl animate-pulse">
              {achievement.icon}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center animate-spin">
              <TrophyIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold">Achievement Unlocked!</h3>
              <div className="flex items-center space-x-1">
                {Array.from({ 
                  length: achievement.rarity === 'legendary' ? 4 : 
                          achievement.rarity === 'rare' ? 3 : 
                          achievement.rarity === 'uncommon' ? 2 : 1 
                }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-4 h-4 text-amber-300 animate-pulse"
                    fill="currentColor"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-1">{achievement.title}</h4>
            <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-white/20 font-semibold">
                +{achievement.points} points
              </span>
              <span className="text-xs opacity-75 uppercase tracking-wider font-bold">
                {achievement.rarity}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white transition-colors duration-200 text-2xl font-bold p-2"
          >
            ×
          </button>
        </div>
        
        {/* Animated progress bar */}
        <div className="mt-4 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div 
            className="h-1 bg-white/60 rounded-full transition-all duration-[5000ms] ease-linear"
            style={{
              width: isVisible ? '0%' : '100%',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
        
        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping opacity-75"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
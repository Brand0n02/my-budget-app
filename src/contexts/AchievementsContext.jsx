import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const AchievementsContext = createContext();

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

// Achievement definitions
export const ACHIEVEMENT_TYPES = {
  // Savings achievements
  FIRST_GOAL: {
    id: 'first_goal',
    title: 'First Steps',
    description: 'Complete your first savings goal',
    icon: '🎯',
    rarity: 'common',
    points: 100
  },
  GOAL_STREAK_5: {
    id: 'goal_streak_5',
    title: 'Goal Getter',
    description: 'Complete 5 savings goals',
    icon: '🏆',
    rarity: 'uncommon',
    points: 250
  },
  SAVINGS_1K: {
    id: 'savings_1k',
    title: 'First Thousand',
    description: 'Save your first $1,000',
    icon: '💰',
    rarity: 'uncommon',
    points: 200
  },
  SAVINGS_5K: {
    id: 'savings_5k',
    title: 'Big Saver',
    description: 'Save $5,000 total',
    icon: '💎',
    rarity: 'rare',
    points: 500
  },
  SAVINGS_10K: {
    id: 'savings_10k',
    title: 'Five Figures',
    description: 'Save $10,000 total',
    icon: '👑',
    rarity: 'legendary',
    points: 1000
  },
  OVER_ACHIEVER: {
    id: 'over_achiever',
    title: 'Over Achiever',
    description: 'Exceed a savings goal by 50%',
    icon: '🌟',
    rarity: 'rare',
    points: 300
  },
  
  // Budget achievements
  BUDGET_MASTER: {
    id: 'budget_master',
    title: 'Budget Master',
    description: 'Stay under budget for 30 days',
    icon: '📊',
    rarity: 'uncommon',
    points: 200
  },
  PENNY_PINCHER: {
    id: 'penny_pincher',
    title: 'Penny Pincher',
    description: 'Complete a month spending less than 80% of budget',
    icon: '🪙',
    rarity: 'rare',
    points: 400
  },
  
  // Consistency achievements
  CONSISTENT_SAVER: {
    id: 'consistent_saver',
    title: 'Consistent Saver',
    description: 'Add to savings for 7 days in a row',
    icon: '🔥',
    rarity: 'uncommon',
    points: 150
  },
  MONTHLY_SAVER: {
    id: 'monthly_saver',
    title: 'Monthly Habit',
    description: 'Save money every month for 3 months',
    icon: '📅',
    rarity: 'rare',
    points: 350
  },
  
  // Speed achievements
  SPEED_SAVER: {
    id: 'speed_saver',
    title: 'Speed Saver',
    description: 'Complete a savings goal in under 30 days',
    icon: '⚡',
    rarity: 'uncommon',
    points: 200
  },
  
  // Special achievements
  NEW_YEAR_SAVER: {
    id: 'new_year_saver',
    title: 'New Year, New Savings',
    description: 'Start a savings goal in January',
    icon: '🎊',
    rarity: 'common',
    points: 100
  },
  FINANCIAL_PLANNER: {
    id: 'financial_planner',
    title: 'Financial Planner',
    description: 'Have 5 active savings goals at once',
    icon: '🗂️',
    rarity: 'rare',
    points: 300
  }
};

export const AchievementsProvider = ({ children }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalSaved: 0,
    goalsCompleted: 0,
    budgetsCompleted: 0,
    longestSavingStreak: 0,
    currentSavingStreak: 0,
    totalPoints: 0,
    lastSavingDate: null
  });

  // Save achievements to localStorage
  const saveAchievements = (newAchievements) => {
    if (!user) return;
    localStorage.setItem(`achievements_${user.uid}`, JSON.stringify(newAchievements));
    setAchievements(newAchievements);
  };

  const saveStats = (newStats) => {
    if (!user) return;
    localStorage.setItem(`stats_${user.uid}`, JSON.stringify(newStats));
    setStats(newStats);
  };

  // Check and unlock achievement
  const unlockAchievement = (achievementId) => {
    const achievement = ACHIEVEMENT_TYPES[achievementId];
    if (!achievement) return false;

    // Check if already unlocked
    if (achievements.find(a => a.id === achievementId)) {
      return false;
    }

    const newAchievement = {
      ...achievement,
      unlockedAt: new Date().toISOString(),
      year: new Date().getFullYear()
    };

    const newAchievements = [...achievements, newAchievement];
    const newStats = {
      ...stats,
      totalPoints: stats.totalPoints + achievement.points
    };

    saveAchievements(newAchievements);
    saveStats(newStats);

    // Trigger achievement notification
    const event = new CustomEvent('achievementUnlocked', {
      detail: newAchievement
    });
    document.dispatchEvent(event);

    return true;
  };

  // Track goal completion
  const trackGoalCompletion = (goal) => {
    const newStats = {
      ...stats,
      goalsCompleted: stats.goalsCompleted + 1,
      totalSaved: stats.totalSaved + (goal.current || 0)
    };
    saveStats(newStats);

    // Check achievements
    if (newStats.goalsCompleted === 1) {
      unlockAchievement('FIRST_GOAL');
    } else if (newStats.goalsCompleted === 5) {
      unlockAchievement('GOAL_STREAK_5');
    }

    if (newStats.totalSaved >= 1000 && stats.totalSaved < 1000) {
      unlockAchievement('SAVINGS_1K');
    } else if (newStats.totalSaved >= 5000 && stats.totalSaved < 5000) {
      unlockAchievement('SAVINGS_5K');
    } else if (newStats.totalSaved >= 10000 && stats.totalSaved < 10000) {
      unlockAchievement('SAVINGS_10K');
    }

    // Check if goal was completed quickly
    if (goal.startDate) {
      const startDate = new Date(goal.startDate);
      const completionDate = new Date();
      const daysDiff = (completionDate - startDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 30) {
        unlockAchievement('SPEED_SAVER');
      }
    }

    // Check over-achiever
    if (goal.current > goal.target * 1.5) {
      unlockAchievement('OVER_ACHIEVER');
    }
  };

  // Track savings activity
  const trackSavingsActivity = (amount) => {
    const today = new Date().toDateString();
    const lastSavingDate = stats.lastSavingDate ? new Date(stats.lastSavingDate).toDateString() : null;
    
    let newStreak = 1;
    if (lastSavingDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastSavingDate === yesterdayString) {
        newStreak = stats.currentSavingStreak + 1;
      } else if (lastSavingDate !== today) {
        newStreak = 1;
      } else {
        newStreak = stats.currentSavingStreak;
      }
    }

    const newStats = {
      ...stats,
      currentSavingStreak: newStreak,
      longestSavingStreak: Math.max(stats.longestSavingStreak, newStreak),
      lastSavingDate: new Date().toISOString(),
      totalSaved: stats.totalSaved + amount
    };
    
    saveStats(newStats);

    // Check streak achievements
    if (newStreak >= 7) {
      unlockAchievement('CONSISTENT_SAVER');
    }
  };

  // Load achievements from localStorage (in a real app, this would be from Firebase)
  useEffect(() => {
    if (!user) return;
    
    const savedAchievements = localStorage.getItem(`achievements_${user.uid}`);
    const savedStats = localStorage.getItem(`stats_${user.uid}`);
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Listen for achievement events from DataContext
    const handleSavingsActivity = (event) => {
      trackSavingsActivity(event.detail.amount);
    };

    const handleGoalCompleted = (event) => {
      trackGoalCompletion(event.detail);
    };

    const handleCheckAchievement = (event) => {
      unlockAchievement(event.detail.type);
    };

    document.addEventListener('savingsActivity', handleSavingsActivity);
    document.addEventListener('goalCompleted', handleGoalCompleted);
    document.addEventListener('checkAchievement', handleCheckAchievement);

    return () => {
      document.removeEventListener('savingsActivity', handleSavingsActivity);
      document.removeEventListener('goalCompleted', handleGoalCompleted);
      document.removeEventListener('checkAchievement', handleCheckAchievement);
    };
  }, [user]);

  // Get achievements for current year
  const getCurrentYearAchievements = () => {
    const currentYear = new Date().getFullYear();
    return achievements.filter(a => a.year === currentYear);
  };

  // Get achievement progress
  const getAchievementProgress = () => {
    const currentYear = new Date().getFullYear();
    const currentYearAchievements = getCurrentYearAchievements();
    const totalPossibleAchievements = Object.keys(ACHIEVEMENT_TYPES).length;
    
    return {
      unlocked: currentYearAchievements.length,
      total: totalPossibleAchievements,
      points: currentYearAchievements.reduce((sum, a) => sum + a.points, 0)
    };
  };

  const value = {
    achievements,
    stats,
    unlockAchievement,
    trackGoalCompletion,
    trackSavingsActivity,
    getCurrentYearAchievements,
    getAchievementProgress,
    ACHIEVEMENT_TYPES
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
};
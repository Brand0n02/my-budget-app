import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Transactions Collection
export const transactionsService = {
  // Add a new transaction
  async addTransaction(userId, transaction) {
    try {
      const transactionData = {
        ...transaction,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      return { id: docRef.id, ...transactionData };
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Get all transactions for a user
  async getTransactions(userId) {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
        // Temporarily commented out until index is created
        // orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactions = [];
      
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort in memory for now
      return transactions.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  // Delete a transaction
  async deleteTransaction(transactionId) {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  subscribeToTransactions(userId, callback) {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId)
      // Temporarily commented out until index is created
      // orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort in memory for now
      const sortedTransactions = transactions.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      callback(sortedTransactions);
    });
  }
};

// Savings Jars Collection
export const goalsService = {
  // Add a new goal
  async addGoal(userId, goal) {
    try {
      const goalData = {
        ...goal,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'goals'), goalData);
      return { id: docRef.id, ...goalData };
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  },

  // Get all goals for a user
  async getGoals(userId) {
    try {
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', userId)
        // Temporarily commented out until index is created
        // orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const goals = [];
      
      querySnapshot.forEach((doc) => {
        goals.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort in memory for now
      return goals.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  },

  // Update a goal
  async updateGoal(goalId, updates) {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(goalRef, updateData);
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  // Delete a goal
  async deleteGoal(goalId) {
    try {
      await deleteDoc(doc(db, 'goals', goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  subscribeToGoals(userId, callback) {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId)
      // Temporarily commented out until index is created
      // orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const goals = [];
      querySnapshot.forEach((doc) => {
        const goalData = {
          id: doc.id,
          ...doc.data()
        };
        goals.push(goalData);
      });
      
      // Sort in memory for now
      const sortedGoals = goals.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      callback(sortedGoals);
    });
  }
}; 

// Budgets Collection
export const budgetsService = {
  // Add a new budget
  async addBudget(userId, budget) {
    try {
      const budgetData = {
        ...budget,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'budgets'), budgetData);
      return { id: docRef.id, ...budgetData };
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  },

  // Get all budgets for a user
  async getBudgets(userId) {
    try {
      const q = query(
        collection(db, 'budgets'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const budgets = [];
      
      querySnapshot.forEach((doc) => {
        budgets.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return budgets.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  },

  // Update a budget
  async updateBudget(budgetId, updates) {
    try {
      const budgetRef = doc(db, 'budgets', budgetId);
      await updateDoc(budgetRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },

  // Delete a budget
  async deleteBudget(budgetId) {
    try {
      await deleteDoc(doc(db, 'budgets', budgetId));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  subscribeToBudgets(userId, callback) {
    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const budgets = [];
      querySnapshot.forEach((doc) => {
        budgets.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      const sortedBudgets = budgets.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      callback(sortedBudgets);
    });
  }
};

// Paychecks Collection
export const paychecksService = {
  // Add a new paycheck
  async addPaycheck(userId, paycheck) {
    try {
      const paycheckData = {
        ...paycheck,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'paychecks'), paycheckData);
      return { id: docRef.id, ...paycheckData };
    } catch (error) {
      console.error('Error adding paycheck:', error);
      throw error;
    }
  },

  // Get all paychecks for a user
  async getPaychecks(userId) {
    try {
      const q = query(
        collection(db, 'paychecks'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const paychecks = [];
      
      querySnapshot.forEach((doc) => {
        paychecks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return paychecks.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting paychecks:', error);
      throw error;
    }
  },

  // Update a paycheck
  async updatePaycheck(paycheckId, updates) {
    try {
      const paycheckRef = doc(db, 'paychecks', paycheckId);
      await updateDoc(paycheckRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating paycheck:', error);
      throw error;
    }
  },

  // Delete a paycheck
  async deletePaycheck(paycheckId) {
    try {
      await deleteDoc(doc(db, 'paychecks', paycheckId));
    } catch (error) {
      console.error('Error deleting paycheck:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  subscribeToPaychecks(userId, callback) {
    const q = query(
      collection(db, 'paychecks'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const paychecks = [];
      querySnapshot.forEach((doc) => {
        paychecks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      const sortedPaychecks = paychecks.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      callback(sortedPaychecks);
    });
  }
};

// Achievements Collection
export const achievementsService = {
  // Add a new achievement
  async addAchievement(userId, achievement) {
    try {
      const achievementData = {
        ...achievement,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'achievements'), achievementData);
      return { id: docRef.id, ...achievementData };
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  },

  // Get all achievements for a user
  async getAchievements(userId) {
    try {
      const q = query(
        collection(db, 'achievements'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const achievements = [];
      
      querySnapshot.forEach((doc) => {
        achievements.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return achievements.sort((a, b) => {
        if (a.unlockedAt && b.unlockedAt) {
          return new Date(b.unlockedAt) - new Date(a.unlockedAt);
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw error;
    }
  },

  // Get user stats
  async getStats(userId) {
    try {
      const q = query(
        collection(db, 'userStats'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      
      // Return default stats if none exist
      return {
        totalSaved: 0,
        goalsCompleted: 0,
        budgetsCompleted: 0,
        longestSavingStreak: 0,
        currentSavingStreak: 0,
        totalPoints: 0,
        lastSavingDate: null
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  },

  // Update user stats
  async updateStats(userId, stats) {
    try {
      const q = query(
        collection(db, 'userStats'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing stats
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...stats,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new stats document
        const statsData = {
          ...stats,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await addDoc(collection(db, 'userStats'), statsData);
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  // Clear all achievements and stats for a user (for restart functionality)
  async clearUserData(userId) {
    try {
      // Clear achievements
      const achievementsQuery = query(
        collection(db, 'achievements'),
        where('userId', '==', userId)
      );
      const achievementsSnapshot = await getDocs(achievementsQuery);
      const achievementDeletions = achievementsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      // Clear stats
      const statsQuery = query(
        collection(db, 'userStats'),
        where('userId', '==', userId)
      );
      const statsSnapshot = await getDocs(statsQuery);
      const statsDeletions = statsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      // Execute all deletions
      await Promise.all([...achievementDeletions, ...statsDeletions]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  },

  // Listen to real-time updates for achievements
  subscribeToAchievements(userId, callback) {
    const q = query(
      collection(db, 'achievements'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const achievements = [];
      querySnapshot.forEach((doc) => {
        achievements.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      const sortedAchievements = achievements.sort((a, b) => {
        if (a.unlockedAt && b.unlockedAt) {
          return new Date(b.unlockedAt) - new Date(a.unlockedAt);
        }
        return 0;
      });
      
      callback(sortedAchievements);
    });
  },

  // Listen to real-time updates for stats
  subscribeToStats(userId, callback) {
    const q = query(
      collection(db, 'userStats'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        callback({ id: doc.id, ...doc.data() });
      } else {
        // Return default stats if none exist
        callback({
          totalSaved: 0,
          goalsCompleted: 0,
          budgetsCompleted: 0,
          longestSavingStreak: 0,
          currentSavingStreak: 0,
          totalPoints: 0,
          lastSavingDate: null
        });
      }
    });
  }
}; 
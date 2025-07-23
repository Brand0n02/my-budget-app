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
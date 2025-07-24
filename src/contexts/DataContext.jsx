import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { transactionsService, goalsService, budgetsService, paychecksService } from '../services/firestore';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [paychecks, setPaychecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      setBudgets([]);
      setPaychecks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Track which subscriptions have loaded
    const loadedStates = {
      transactions: false,
      goals: false,
      budgets: false,
      paychecks: false
    };

    const checkAllLoaded = () => {
      if (Object.values(loadedStates).every(loaded => loaded)) {
        setLoading(false);
      }
    };

    const unsubscribeTransactions = transactionsService.subscribeToTransactions(
      user.uid,
      (transactions) => {
        setTransactions(transactions);
        loadedStates.transactions = true;
        checkAllLoaded();
      }
    );

    const unsubscribeGoals = goalsService.subscribeToGoals(
      user.uid,
      (goals) => {
        setGoals(goals);
        loadedStates.goals = true;
        checkAllLoaded();
      }
    );

    const unsubscribeBudgets = budgetsService.subscribeToBudgets(
      user.uid,
      (budgets) => {
        setBudgets(budgets);
        loadedStates.budgets = true;
        checkAllLoaded();
      }
    );

    const unsubscribePaychecks = paychecksService.subscribeToPaychecks(
      user.uid,
      (paychecks) => {
        setPaychecks(paychecks);
        loadedStates.paychecks = true;
        checkAllLoaded();
      }
    );

    return () => {
      unsubscribeTransactions();
      unsubscribeGoals();
      unsubscribeBudgets();
      unsubscribePaychecks();
    };
  }, [user]);

  // Add transaction
  const addTransaction = async (transaction) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await transactionsService.addTransaction(user.uid, transaction);
      
      // Dispatch custom event for achievement tracking
      if (transaction.category === 'Savings' && transaction.type === 'transfer' && transaction.amount > 0) {
        document.dispatchEvent(new CustomEvent('savingsActivity', { detail: { amount: transaction.amount } }));
      }
      
      // Check for New Year saver achievement
      const currentDate = new Date();
      if (currentDate.getMonth() === 0 && transaction.category === 'Savings') { // January
        document.dispatchEvent(new CustomEvent('checkAchievement', { detail: { type: 'NEW_YEAR_SAVER' } }));
      }
    } catch (error) {
      console.error('Error adding transaction to Firebase:', error);
      setError(error.message);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    try {
      await transactionsService.deleteTransaction(transactionId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Add goal
  const addGoal = async (goal) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await goalsService.addGoal(user.uid, { ...goal, createdAt: new Date().toISOString() });
      
      // Check for financial planner achievement (5 active goals)
      if (goals.length + 1 >= 5) {
        document.dispatchEvent(new CustomEvent('checkAchievement', { detail: { type: 'FINANCIAL_PLANNER' } }));
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update goal
  const updateGoal = async (goalId, updates) => {
    try {
      await goalsService.updateGoal(goalId, updates);
      
      // Check if goal was completed
      const goal = goals.find(g => g.id === goalId);
      if (goal && updates.current >= goal.target && goal.current < goal.target) {
        const completedGoal = { ...goal, ...updates, startDate: goal.createdAt };
        document.dispatchEvent(new CustomEvent('goalCompleted', { detail: completedGoal }));
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete goal
  const deleteGoal = async (goalId) => {
    try {
      await goalsService.deleteGoal(goalId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Add budget
  const addBudget = async (budget) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await budgetsService.addBudget(user.uid, budget);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update budget
  const updateBudget = async (budgetId, updates) => {
    try {
      await budgetsService.updateBudget(budgetId, updates);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete budget
  const deleteBudget = async (budgetId) => {
    try {
      await budgetsService.deleteBudget(budgetId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Add paycheck
  const addPaycheck = async (paycheck) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await paychecksService.addPaycheck(user.uid, paycheck);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update paycheck
  const updatePaycheck = async (paycheckId, updates) => {
    try {
      await paychecksService.updatePaycheck(paycheckId, updates);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete paycheck
  const deletePaycheck = async (paycheckId) => {
    try {
      await paychecksService.deletePaycheck(paycheckId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Calculate total balance (excluding savings transfers and internal transfers)
  const totalBalanceTransactions = transactions.filter(transaction => 
    transaction.category !== 'Savings' && 
    transaction.category !== 'Transfer' && 
    transaction.category !== 'Savings Transfer'
  );
  const totalBalance = totalBalanceTransactions
    .reduce((total, transaction) => {
      const amount = transaction.amount || 0;
      // If it's income, add to balance; if it's expense, subtract from balance
      const contribution = transaction.type === 'income' ? amount : -amount;
      return total + contribution;
    }, 0);

  // Calculate savings balance (only savings transfers)
  const savingsBalance = transactions
    .filter(transaction => transaction.category === 'Savings')
    .reduce((total, transaction) => {
      const amount = transaction.amount || 0;
      // For savings, positive amounts add to savings, negative amounts subtract from savings
      return total + amount;
    }, 0);

  // Calculate income (excluding savings and transfers)
  const income = transactions
    .filter(transaction => transaction.type === 'income' && transaction.category !== 'Savings' && transaction.category !== 'Transfer' && transaction.category !== 'Savings Transfer')
    .reduce((total, transaction) => total + (transaction.amount || 0), 0);

  // Calculate expenses (excluding savings and transfers)
  const expenses = transactions
    .filter(transaction => transaction.type === 'expense' && transaction.category !== 'Savings' && transaction.category !== 'Transfer' && transaction.category !== 'Savings Transfer')
    .reduce((total, transaction) => total + (transaction.amount || 0), 0);

  const value = {
    transactions,
    goals,
    budgets,
    paychecks,
    loading,
    error,
    totalBalance,
    savingsBalance,
    income,
    expenses,
    addTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addBudget,
    updateBudget,
    deleteBudget,
    addPaycheck,
    updatePaycheck,
    deletePaycheck
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 
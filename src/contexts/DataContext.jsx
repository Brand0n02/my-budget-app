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

  // Subscribe to real-time transaction updates
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

    const unsubscribeTransactions = transactionsService.subscribeToTransactions(
      user.uid,
      (transactions) => {
        setTransactions(transactions);
        setLoading(false);
      }
    );

    const unsubscribeGoals = goalsService.subscribeToGoals(
      user.uid,
      (goals) => {
        setGoals(goals);
        setLoading(false);
      }
    );

    const unsubscribeBudgets = budgetsService.subscribeToBudgets(
      user.uid,
      (budgets) => {
        setBudgets(budgets);
        setLoading(false);
      }
    );

    const unsubscribePaychecks = paychecksService.subscribeToPaychecks(
      user.uid,
      (paychecks) => {
        setPaychecks(paychecks);
        setLoading(false);
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
      await goalsService.addGoal(user.uid, goal);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update goal
  const updateGoal = async (goalId, updates) => {
    try {
      await goalsService.updateGoal(goalId, updates);
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

  // Calculate total balance
  const totalBalance = transactions.reduce((total, transaction) => {
    const amount = transaction.amount || 0;
    // If it's income, add to balance; if it's expense, subtract from balance
    return total + (transaction.type === 'income' ? amount : -amount);
  }, 0);

  // Calculate income
  const income = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + (transaction.amount || 0), 0);

  // Calculate expenses
  const expenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + (transaction.amount || 0), 0);

  const value = {
    transactions,
    goals,
    budgets,
    paychecks,
    loading,
    error,
    totalBalance,
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
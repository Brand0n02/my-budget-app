import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import './App.css'
import BalanceCard from './components/BalanceCard'
import AIInsightCard from './components/AIInsightCard'
import SavingsGoals from './components/SavingsGoals'
import TransactionHistory from './components/TransactionHistory'
import TransactionForm from './components/TransactionForm'
import QuickActions from './components/QuickActions'
import ReminderBanner from './components/ReminderBanner'
import LoginPage from './components/LoginPage'
import ShapeBlur from './components/ShapeBlur'
import Footer from './components/Footer'
import PaycheckCard from './components/PaycheckCard'
import SavingsJarCard from './components/SavingsJarCard'
import BudgetPlanCard from './components/BudgetPlanCard'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider, useData } from './contexts/DataContext'
import './index.css';

// Landing Page Component
const LandingPage = ({ onEnterDashboard }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handler for the scroll button
  const handleScrollToDashboard = () => {
    onEnterDashboard();
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="particle" style={{ left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '20%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ left: '70%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ left: '80%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ left: '50%', animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-8 lg:px-12">
        {/* Logo and App Name */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-glow floating">
            <span className="text-white text-4xl">💰</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gradient-animate mb-6 leading-tight">
            To be budgeted
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 animate-shimmer font-light">
            Smarter money. Better mood.
          </p>
        </div>

        {/* Tagline */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Transform your relationship with money through intelligent insights, 
            beautiful tracking, and mindful spending habits.
          </p>
        </div>

        {/* Enter Dashboard Button with ShapeBlur */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div style={{position: 'relative', height: '200px', width: '1000px', margin: '0 auto', overflow: 'hidden'}}>
            <ShapeBlur
              variation={0}
              pixelRatioProp={window.devicePixelRatio || 1}
              shapeSize={1.0}
              roundness={0.2}
              borderSize={0.02}
              circleSize={0.3}
              circleEdge={0.8}
            />
            <button
              onClick={handleScrollToDashboard}
              className="absolute inset-0 w-full h-full flex items-center justify-center text-white font-semibold text-lg z-10 hover:scale-105 transition-transform duration-300"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    transactions, 
    goals, 
    budgets,
    paychecks,
    loading, 
    totalBalance, 
    income, 
    expenses,
    addTransaction, 
    deleteTransaction,
    addGoal,
    updateGoal,
    addBudget,
    updateBudget,
    addPaycheck,
    updatePaycheck
  } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  
  // Modal states
  const [showPaycheckModal, setShowPaycheckModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  

  
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You haven't logged rent this month", type: 'reminder', read: false },
    { id: 2, message: "Great job! You're 15% under budget", type: 'success', read: false },
    { id: 3, message: "New feature: Smart categorization available", type: 'info', read: true }
  ]);

  const handleAddTransaction = async (transaction) => {
    try {
      await addTransaction(transaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Quick Actions handlers
  const handleAddPaycheck = () => {
    // Highlight the Paycheck Tracker card
    const paycheckCard = document.querySelector('[data-paycheck-card]');
    if (paycheckCard) {
      paycheckCard.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight effect
      paycheckCard.style.transition = 'all 0.3s ease';
      paycheckCard.style.transform = 'scale(1.02)';
      paycheckCard.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.3)';
      setTimeout(() => {
        paycheckCard.style.transform = 'scale(1)';
        paycheckCard.style.boxShadow = '';
      }, 2000);
    }
    
    // Trigger the PaycheckCard modal
    setTimeout(() => {
      const paycheckModalEvent = new CustomEvent('openPaycheckModal');
      document.dispatchEvent(paycheckModalEvent);
    }, 500);
  };

  const handleSavingsJar = () => {
    // Highlight the Savings Jar card
    const savingsCard = document.querySelector('[data-savings-jar-card]');
    if (savingsCard) {
      savingsCard.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight effect
      savingsCard.style.transition = 'all 0.3s ease';
      savingsCard.style.transform = 'scale(1.02)';
      savingsCard.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.3)';
      setTimeout(() => {
        savingsCard.style.transform = 'scale(1)';
        savingsCard.style.boxShadow = '';
      }, 2000);
    }
    
    // Trigger the add goal modal in the SavingsJarCard
    setTimeout(() => {
      const event = new CustomEvent('openSavingsModal');
      document.dispatchEvent(event);
    }, 500);
  };

  const handleBudgetPlan = () => {
    // Highlight the Budget Plan card
    const budgetCard = document.querySelector('[data-budget-plan-card]');
    if (budgetCard) {
      budgetCard.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight effect
      budgetCard.style.transition = 'all 0.3s ease';
      budgetCard.style.transform = 'scale(1.02)';
      budgetCard.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
      setTimeout(() => {
        budgetCard.style.transform = 'scale(1)';
        budgetCard.style.boxShadow = '';
      }, 2000);
    }
    
    // Trigger the budget plan modal (we'll create this later)
    setTimeout(() => {
      const budgetModalEvent = new CustomEvent('openBudgetModal');
      document.dispatchEvent(budgetModalEvent);
    }, 500);
  };

  const handleLogExpense = () => {
    // Highlight the Expense Log card
    const expenseCard = document.querySelector('[data-expense-log-card]');
    if (expenseCard) {
      expenseCard.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight effect
      expenseCard.style.transition = 'all 0.3s ease';
      expenseCard.style.transform = 'scale(1.02)';
      expenseCard.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.3)';
      setTimeout(() => {
        expenseCard.style.transform = 'scale(1)';
        expenseCard.style.boxShadow = '';
      }, 2000);
    }
    
    // Trigger the expense log modal (we'll create this later)
    setTimeout(() => {
      const expenseModalEvent = new CustomEvent('openExpenseModal');
      document.dispatchEvent(expenseModalEvent);
    }, 500);
  };

  // Modal event listeners
  useEffect(() => {
    const handleOpenPaycheckModal = () => {
      setShowPaycheckModal(true);
    };

    const handleOpenSavingsModal = () => {
      setShowSavingsModal(true);
    };

    const handleOpenBudgetModal = () => {
      setShowBudgetModal(true);
    };

    const handleAddToSavings = async (event) => {
      const { amount, description, type, targetId } = event.detail;
      
      try {
        
        if (targetId === 'default') {
          // Create a new default Savings Jar
          const newGoal = {
            name: 'Emergency Fund',
            target: 1000,
            current: type === 'income' ? amount : 0, // Only income starts with money, expenses would subtract from 0
            icon: '🫙',
            deadline: null
          };
          await addGoal(newGoal);
        } else {
          // Find the specific goal to update
          const goalToUpdate = goals.find(goal => goal.id === targetId);
          
          if (goalToUpdate) {
            // Update the goal in Firebase - income adds, expense subtracts
            const currentAmount = goalToUpdate.current || 0;
            const newCurrent = currentAmount + (type === 'income' ? amount : -amount);
            const finalAmount = Math.max(0, newCurrent); // Don't go below 0
            
            await updateGoal(goalToUpdate.id, { current: finalAmount });
          }
        }
      } catch (error) {
        console.error('Error updating Savings Jar:', error);
      }
    };

    const handleAddToBudget = async (event) => {
      const { amount, description, type, category, targetId } = event.detail;
      
      try {
        
        if (targetId === 'default') {
          // Create a new budget category
          const newBudget = {
            category: category,
            allocated: type === 'expense' ? amount * 4 : amount, // For expenses, set a reasonable budget
            spent: type === 'expense' ? amount : 0, // Only expenses add to spent
            color: 'bg-blue-500'
          };
          await addBudget(newBudget);
        } else {
          // Find the specific budget to update
          const budgetToUpdate = budgets.find(budget => budget.id === targetId);
          
          if (budgetToUpdate) {
            if (type === 'expense') {
              // For expenses, add to spent amount
              const newSpent = budgetToUpdate.spent + amount;
              await updateBudget(budgetToUpdate.id, { spent: newSpent });
            } else if (type === 'income') {
              // For income, increase allocated budget
              const newAllocated = budgetToUpdate.allocated + amount;
              await updateBudget(budgetToUpdate.id, { allocated: newAllocated });
            }
          }
        }
      } catch (error) {
        console.error('Error updating budget:', error);
      }
    };

    document.addEventListener('openPaycheckModal', handleOpenPaycheckModal);
    document.addEventListener('openSavingsModal', handleOpenSavingsModal);
    document.addEventListener('openBudgetModal', handleOpenBudgetModal);
    document.addEventListener('addToSavings', handleAddToSavings);
    document.addEventListener('addToBudget', handleAddToBudget);

    return () => {
      document.removeEventListener('openPaycheckModal', handleOpenPaycheckModal);
      document.removeEventListener('openSavingsModal', handleOpenSavingsModal);
      document.removeEventListener('openBudgetModal', handleOpenBudgetModal);
      document.removeEventListener('addToSavings', handleAddToSavings);
      document.removeEventListener('addToBudget', handleAddToBudget);
    };
  }, [goals, budgets, addGoal, updateGoal, addBudget, updateBudget]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading your data...</h2>
          <p className="text-gray-400">Syncing with the cloud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto mb-0">
        {/* Header - Blocky square layout */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-600/20 p-8 mb-32 shadow-2xl shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">💰</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">To be budgeted</h1>
                <p className="text-gray-400 text-base">Smart Financial Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('https://github.com', '_blank')}
                className="hidden sm:flex px-6 py-4 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200 text-base items-center border border-gray-700/30 hover:border-gray-600/50 shadow-lg"
                title="View Source Code"
              >
                📁 <span className="hidden md:inline ml-3">Source</span>
              </button>
              <div className="flex items-center bg-gray-800/40 rounded-2xl p-2 border border-gray-700/30 space-x-2 shadow-lg">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-4 text-gray-400 hover:text-white transition-all duration-200 relative rounded-xl hover:bg-gray-700/50"
                  title="Notifications"
                >
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-4 text-gray-400 hover:text-white transition-all duration-200 rounded-xl hover:bg-gray-700/50"
                  title="Settings"
                >
                  ⚙️
                </button>
                <button
                  onClick={() => setShowAccount(!showAccount)}
                  className="p-4 text-gray-400 hover:text-white transition-all duration-200 rounded-xl hover:bg-gray-700/50"
                  title="Account"
                >
                  👤
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-white mb-2">
            {getGreeting()}, {user?.displayName || user?.email?.split('@')[0] || 'User'} 👋
          </h2>
          <p className="text-gray-400 text-xl">
            Here's your financial overview for today
          </p>
        </div>

        {/* Reminder Banner */}
        <div className="mb-48">
          <ReminderBanner />
        </div>

        {/* Balance Card */}
        <div className="mb-48">
          <BalanceCard
            balance={totalBalance}
            percentageChange={12.5}
            timeframe="vs last month"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-48">
          <QuickActions
            onAddPaycheck={handleAddPaycheck}
            onSavingsJar={handleSavingsJar}
            onBudgetPlan={handleBudgetPlan}
            onLogExpense={handleLogExpense}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Paycheck Tracker */}
            <div data-paycheck-card>
              <PaycheckCard transactions={transactions} paychecks={paychecks} />
            </div>
            
            {/* Savings Jar */}
            <div data-savings-jar-card>
              <SavingsJarCard goals={goals} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Budget Plan Summary */}
            <div data-budget-plan-card>
              <BudgetPlanCard budgets={budgets} />
            </div>

            {/* Expense Log */}
            <div data-expense-log-card>
              <TransactionHistory
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>

        {/* Transaction Form (Floating) */}
        <div data-transaction-form>
          <TransactionForm 
            onAddTransaction={handleAddTransaction} 
          />
        </div>

        {/* Notifications Panel */}
        <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          showNotifications ? 'pointer-events-auto' : 'pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              showNotifications ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowNotifications(false)}
          />

          {/* Panel */}
          <div className={`absolute top-0 right-0 h-full w-1/4 max-w-sm bg-gray-900/95 backdrop-blur-lg border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            showNotifications ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🔔</div>
                      <p className="text-gray-400">No notifications</p>
                      <p className="text-gray-500 text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                          notification.read
                            ? 'bg-gray-800/30 border-gray-700/50'
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm leading-relaxed">{notification.message}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-gray-400 text-xs">
                                {notification.type === 'reminder' && '🔔 Reminder'}
                                {notification.type === 'success' && '✅ Success'}
                                {notification.type === 'info' && 'ℹ️ Info'}
                              </span>
                              <span className="text-gray-500 text-xs ml-2">• Just now</span>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                  }}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 text-sm transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-gray-400 text-sm">Toggle dark theme</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-700 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-gray-400 text-sm">Enable push notifications</p>
                  </div>
                  <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Auto-sync</p>
                    <p className="text-gray-400 text-sm">Sync data automatically</p>
                  </div>
                  <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Modal */}
        {showAccount && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Account</h3>
                <button
                  onClick={() => setShowAccount(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">👤</span>
                  </div>
                  <h4 className="text-white font-medium">{user?.displayName || 'User'}</h4>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors">
                    Edit Profile
                  </button>
                  <button className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors">
                    Change Password
                  </button>
                  <button className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors">
                    Export Data
                  </button>
                  <button
                    onClick={logout}
                    className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {/* Paycheck Modal */}
        {showPaycheckModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaycheckModal(false)} />
            <div className="relative bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-600/20 p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Add Paycheck</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const paycheck = {
                  amount: parseFloat(formData.get('amount')),
                  description: formData.get('description') || 'Paycheck',
                  category: '💰 Salary',
                  type: 'income',
                  date: formData.get('date') || new Date().toISOString(),
                  notes: formData.get('notes') || ''
                };
                
                try {
                  // Add the transaction
                  await handleAddTransaction(paycheck);
                  setShowPaycheckModal(false);
                  
                  // Show success message
                  console.log('Paycheck added successfully!');
                } catch (error) {
                  console.error('Error adding paycheck:', error);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      required
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                      placeholder="2500.00"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Description (optional)</label>
                    <input
                      type="text"
                      name="description"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                      placeholder="Biweekly paycheck"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Pay Date</label>
                    <input
                      type="date"
                      name="date"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Notes (optional)</label>
                    <textarea
                      name="notes"
                      rows="2"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                      placeholder="Bonus, overtime, etc."
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPaycheckModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 rounded-lg transition-colors"
                  >
                    Add Paycheck
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Savings Modal */}
        {showSavingsModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSavingsModal(false)} />
            <div className="relative bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-600/20 p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Create Savings Jar</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const goal = {
                  name: formData.get('name'),
                  target: parseFloat(formData.get('target')),
                  current: parseFloat(formData.get('current')) || 0,
                  icon: formData.get('icon') || '🫙',
                  deadline: formData.get('deadline') || null
                };
                
                try {
                  // Add the goal to Firebase
                  await addGoal(goal);
                  setShowSavingsModal(false);
                  
                  // Show success message
                  console.log('Savings Jar added successfully!');
                } catch (error) {
                  console.error('Error adding Savings Jar:', error);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Goal Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      placeholder="Emergency Fund"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Target Amount</label>
                    <input
                      type="number"
                      name="target"
                      step="0.01"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      placeholder="5000.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Current Amount (optional)</label>
                    <input
                      type="number"
                      name="current"
                      step="0.01"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Deadline (optional)</label>
                    <input
                      type="date"
                      name="deadline"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['🫙', '🏠', '🚗', '✈️', '💍', '🎓', '💻', '🏖️', '🎮', '📱', '🛡️', '💰'].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            const iconInput = document.querySelector('input[name="icon"]');
                            if (iconInput) iconInput.value = icon;
                          }}
                          className="p-2 rounded-lg text-xl transition-colors bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSavingsModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 hover:text-purple-300 rounded-lg transition-colors"
                  >
                    Create Jar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Budget Modal */}
        {showBudgetModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBudgetModal(false)} />
            <div className="relative bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-600/20 p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Add Budget Category</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const budget = {
                  category: formData.get('category'),
                  allocated: parseFloat(formData.get('allocated')),
                  spent: 0, // Start with 0 spent
                  color: formData.get('color') || 'bg-blue-500'
                };
                
                try {
                  // Add the budget to Firebase
                  await addBudget(budget);
                  setShowBudgetModal(false);
                  
                  // Show success message
                  console.log('Budget category added successfully!');
                } catch (error) {
                  console.error('Error adding budget:', error);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Category</label>
                    <select
                      name="category"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      {['🏠 Rent', '🛒 Groceries', '🚗 Transportation', '⚡ Utilities', '🎮 Entertainment', '👕 Shopping', '🍽️ Dining', '💊 Healthcare', '📚 Education', '🏖️ Travel', '💳 Debt', '💰 Savings'].map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Monthly Budget</label>
                    <input
                      type="number"
                      name="allocated"
                      step="0.01"
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="500.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Color</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Blue', class: 'bg-blue-500' },
                        { name: 'Green', class: 'bg-green-500' },
                        { name: 'Yellow', class: 'bg-yellow-500' },
                        { name: 'Red', class: 'bg-red-500' },
                        { name: 'Purple', class: 'bg-purple-500' },
                        { name: 'Orange', class: 'bg-orange-500' }
                      ].map((color) => (
                        <button
                          key={color.class}
                          type="button"
                          onClick={() => {
                            const colorInput = document.querySelector('input[name="color"]');
                            if (colorInput) colorInput.value = color.class;
                          }}
                          className="p-3 rounded-lg transition-colors bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50"
                        >
                          <div className={`w-6 h-6 rounded-full ${color.class} mx-auto`}></div>
                          <span className="text-xs text-gray-400 mt-1 block">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 rounded-lg transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

// Main App with Landing + Dashboard
const MainApp = () => {
  const { user } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterDashboard = () => {
    setShowDashboard(true);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="relative w-full">
      {/* Landing Page */}
      {!showDashboard && (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
      
      {/* Dashboard */}
      <div id="dashboard" className={`w-full transition-all duration-1000 ${showDashboard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <Dashboard />
      </div>
    </div>
  );
};

// Login Wrapper Component
const LoginWrapper = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginWrapper />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App

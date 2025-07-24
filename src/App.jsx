import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline'
import './App.css'
import { 
  BalanceCard, 
  AIInsightCard, 
  SavingsGoals, 
  TransactionHistory, 
  PaycheckCard, 
  SavingsJarCard, 
  BudgetPlanCard,
  AchievementsCard 
} from './components/cards'

import { 
  QuickActions, 
  ReminderBanner, 
  LoginPage, 
  ShapeBlur, 
  Footer, 
  Calculator,
  Calendar,
  AchievementsPanel 
} from './components/ui'

import { 
  PaycheckModalContent, 
  ExpenseModalContent, 
  BudgetModalContent, 
  SavingsModalContent 
} from './components/modals'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider, useData } from './contexts/DataContext'
import { AchievementsProvider, useAchievements } from './contexts/AchievementsContext'
import './index.css';
import './styles/glass.css';

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
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Additional blur elements for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        
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
          <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-glow floating">
            <span className="text-white text-5xl">💰</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
            Smart Financial Dashboard
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 animate-shimmer font-light">
            Take control of your finances
          </p>
        </div>

        {/* Tagline */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Transform your relationship with money through intelligent insights, 
            beautiful tracking, and mindful spending habits. Experience the future of personal finance.
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
              className="absolute inset-0 w-full h-full flex items-center justify-center text-white font-bold text-xl z-10 hover:scale-105 transition-transform duration-300"
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
    savingsBalance,
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
  const { getCurrentYearAchievements, getAchievementProgress } = useAchievements();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  
  // Modal states
  const [showPaycheckModal, setShowPaycheckModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  
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

  // Quick Actions handlers - simplified to avoid memory leaks
  const handleAddPaycheck = () => {
    setShowPaycheckModal(true);
  };

  const handleSavingsJar = () => {
    setShowSavingsModal(true);
  };

  const handleBudgetPlan = () => {
    setShowBudgetModal(true);
  };

  const handleLogExpense = () => {
    setShowExpenseModal(true);
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

    const handleOpenExpenseModal = () => {
      setShowExpenseModal(true);
    };

    const handleAddToSavings = async (event) => {
      const { amount, description, type, targetId, transferFrom } = event.detail;
      
      try {
        if (targetId === 'default') {
          // Create a new default Savings Jar
          const newGoal = {
            name: 'Emergency Fund',
            target: 1000,
            current: type === 'expense' ? amount : 0, // 'expense' means adding to savings
            icon: '🫙',
            deadline: null
          };
          await addGoal(newGoal);
          
          // Create transaction for initial deposit
          if (type === 'expense' && amount > 0) {
            const transaction = {
              amount: -amount, // Negative because it's money leaving your main balance
              description: `Initial deposit to ${newGoal.name} (from ${transferFrom || 'Total Balance'})`,
              category: 'Savings',
              type: 'transfer',
              date: new Date().toISOString(),
              goalId: 'default',
              transferFrom: transferFrom || 'Total Balance'
            };
            
            // Create the savings transaction
            await addTransaction(transaction);
            
            // If transferring from Total Balance, create a separate transaction to subtract from main balance
            if (transferFrom === 'Total Balance') {
              const mainBalanceTransaction = {
                amount: amount, // Positive amount but type expense will subtract from balance
                description: `Initial deposit to ${newGoal.name} (from Total Balance)`,
                category: 'Savings Transfer',
                type: 'expense',
                date: new Date().toISOString()
              };
              await addTransaction(mainBalanceTransaction);
            }
          }
        } else {
          // Find the specific goal to update
          const goalToUpdate = goals.find(goal => goal.id === targetId);
          
          if (goalToUpdate) {
            const currentAmount = goalToUpdate.current || 0;
            const newCurrent = currentAmount + (type === 'expense' ? amount : -amount); // 'expense' means adding to savings, 'income' means withdrawing from savings
            const finalAmount = Math.max(0, newCurrent);
            
            await updateGoal(goalToUpdate.id, { current: finalAmount });
            
            // Create transaction for the transfer
            const transaction = {
              amount: type === 'expense' ? -amount : amount, // Negative for transfers to savings, positive for withdrawals from savings
              description: `${type === 'expense' ? 'Transfer to' : 'Withdrawal from'} ${goalToUpdate.name} ${transferFrom ? `(from ${transferFrom})` : ''}`,
              category: 'Savings',
              type: 'transfer', // Use 'transfer' type to distinguish from regular income/expense
              date: new Date().toISOString(),
              goalId: goalToUpdate.id,
              transferFrom: transferFrom || 'Total Balance'
            };
            
            // Create the savings transaction
            await addTransaction(transaction);
            
            // If transferring from Total Balance, create a separate transaction to subtract from main balance
            if (transferFrom === 'Total Balance' && type === 'expense') {
              const mainBalanceTransaction = {
                amount: amount, // Positive amount but type expense will subtract from balance
                description: `Transfer to ${goalToUpdate.name} (from Total Balance)`,
                category: 'Savings Transfer',
                type: 'expense',
                date: new Date().toISOString()
              };
              await addTransaction(mainBalanceTransaction);
            }
            
            // If withdrawing from savings, add money back to main balance
            if (type === 'income') {
              const mainBalanceTransaction = {
                amount: amount, // Positive to add to main balance
                description: `Withdrawal from ${goalToUpdate.name} (to Total Balance)`,
                category: 'Savings Transfer',
                type: 'income',
                date: new Date().toISOString()
              };
              await addTransaction(mainBalanceTransaction);
            }
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
    document.addEventListener('openExpenseModal', handleOpenExpenseModal);
    document.addEventListener('addToSavings', handleAddToSavings);
    document.addEventListener('addToBudget', handleAddToBudget);

    return () => {
      document.removeEventListener('openPaycheckModal', handleOpenPaycheckModal);
      document.removeEventListener('openSavingsModal', handleOpenSavingsModal);
      document.removeEventListener('openBudgetModal', handleOpenBudgetModal);
      document.removeEventListener('openExpenseModal', handleOpenExpenseModal);
      document.removeEventListener('addToSavings', handleAddToSavings);
      document.removeEventListener('addToBudget', handleAddToBudget);
    };
  }, [goals, budgets, addGoal, updateGoal, addBudget, updateBudget]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white text-3xl">💰</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Loading your data...
          </h2>
          <p className="text-gray-300 text-lg">Syncing with the cloud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mb-0">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-32 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-3xl">💰</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Smart Financial Dashboard
                </h1>
                <p className="text-gray-300 text-lg">Take control of your finances</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('https://github.com', '_blank')}
                className="hidden sm:flex px-6 py-4 bg-white/10 border border-white/20 text-gray-300 rounded-2xl hover:bg-white/20 transition-all duration-300 text-base items-center shadow-lg"
                title="View Source Code"
              >
                📁 <span className="hidden md:inline ml-3">Source</span>
              </button>
              <div className="flex items-center bg-white/10 border border-white/20 rounded-3xl p-2 space-x-2 shadow-lg">

                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-4 text-gray-300 hover:text-white transition-all duration-300 relative rounded-2xl hover:bg-white/10"
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
                  onClick={() => setShowAchievements(!showAchievements)}
                  className="p-4 text-gray-300 hover:text-white transition-all duration-300 relative rounded-2xl hover:bg-white/10"
                  title="Achievements"
                >
                  🏆
                  {getCurrentYearAchievements().length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                      {getCurrentYearAchievements().length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-4 text-gray-300 hover:text-white transition-all duration-300 rounded-2xl hover:bg-white/10"
                  title="Settings"
                >
                  ⚙️
                </button>
                <button
                  onClick={() => setShowAccount(!showAccount)}
                  className="p-4 text-gray-300 hover:text-white transition-all duration-300 rounded-2xl hover:bg-white/10"
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
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            {getGreeting()}, {user?.displayName || user?.email?.split('@')[0] || 'User'} 👋
          </h2>
          <p className="text-gray-300 text-2xl">
            Here's your financial overview for today
          </p>
        </div>

        {/* Reminder Banner */}
        <div className="mb-48">
          <ReminderBanner />
        </div>

        {/* Calendar */}
        <div className="mb-48">
          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/20">
            <Calendar />
          </div>
        </div>

        {/* Balance Card */}
        <div className="mb-48">
          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/20">
            <BalanceCard
              balance={totalBalance}
              savingsBalance={savingsBalance}
              percentageChange={0}
              timeframe="vs last month"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-48">
          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/20">
            <QuickActions
              onAddPaycheck={handleAddPaycheck}
              onSavingsJar={handleSavingsJar}
              onBudgetPlan={handleBudgetPlan}
              onLogExpense={handleLogExpense}
            />
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
          {/* Achievements Card */}
          <div data-achievements-card>
            <div className="glass-card rounded-3xl p-8 h-full flex flex-col shadow-2xl border border-white/20">
              <AchievementsCard />
            </div>
          </div>
          {/* Paycheck Tracker */}
          <div data-paycheck-card>
            <div className="glass-card rounded-3xl p-8 h-full flex flex-col shadow-2xl border border-white/20">
              <PaycheckCard transactions={transactions} paychecks={paychecks} />
            </div>
          </div>
          {/* Savings Jar */}
          <div data-savings-jar-card>
            <div className="glass-card rounded-3xl p-8 h-full flex flex-col shadow-2xl border border-white/20">
              <SavingsJarCard goals={goals} />
            </div>
          </div>
          {/* Budget Plan Summary */}
          <div data-budget-plan-card>
            <div className="glass-card rounded-3xl p-8 h-full flex flex-col shadow-2xl border border-white/20">
              <BudgetPlanCard budgets={budgets} addTransaction={addTransaction} />
            </div>
          </div>
          {/* Expense Log */}
          <div data-expense-log-card>
            <div className="glass-card rounded-3xl p-8 h-full flex flex-col shadow-2xl border border-white/20">
              <TransactionHistory
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed inset-0 z-[9999] transition-all duration-300 ease-in-out pointer-events-auto">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100"
              onClick={() => setShowNotifications(false)}
            />

            {/* Panel */}
            <div className="absolute top-0 right-0 h-full w-80 max-w-sm glass-card border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-[10000] translate-x-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/20">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔔</div>
                        <p className="text-gray-300 text-lg font-medium">No notifications</p>
                        <p className="text-gray-400 text-sm">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                            notification.read
                              ? 'bg-white/10 border-white/20'
                              : 'bg-blue-500/10 border-blue-500/30 shadow-lg'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white text-base leading-relaxed font-medium">{notification.message}</p>
                              <div className="flex items-center mt-3">
                                <span className="text-gray-300 text-sm font-medium">
                                  {notification.type === 'reminder' && '🔔 Reminder'}
                                  {notification.type === 'success' && '✅ Success'}
                                  {notification.type === 'info' && 'ℹ️ Info'}
                                </span>
                                <span className="text-gray-400 text-sm ml-3">• Just now</span>
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full ml-3 flex-shrink-0 shadow-lg"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/20">
                  <button
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                    }}
                    className="w-full p-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl text-white font-medium transition-all duration-300"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Panel */}
        <AchievementsPanel
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card rounded-3xl w-full max-w-md p-8 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-300" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/10 border border-white/20 rounded-2xl">
                  <div>
                    <p className="text-white font-semibold text-lg">Dark Mode</p>
                    <p className="text-gray-300 text-sm">Toggle dark theme</p>
                  </div>
                  <div className="w-14 h-7 bg-white/20 rounded-full relative border border-white/20">
                    <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform shadow-lg"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/10 border border-white/20 rounded-2xl">
                  <div>
                    <p className="text-white font-semibold text-lg">Notifications</p>
                    <p className="text-gray-300 text-sm">Enable push notifications</p>
                  </div>
                  <div className="w-14 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative border border-white/20">
                    <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform shadow-lg"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/10 border border-white/20 rounded-2xl">
                  <div>
                    <p className="text-white font-semibold text-lg">Auto-sync</p>
                    <p className="text-gray-300 text-sm">Sync data automatically</p>
                  </div>
                  <div className="w-14 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative border border-white/20">
                    <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Modal */}
        {showAccount && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card rounded-3xl w-full max-w-md p-8 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Account</h3>
                <button
                  onClick={() => setShowAccount(false)}
                  className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-300" />
                </button>
              </div>
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-white text-3xl">👤</span>
                  </div>
                  <h4 className="text-white font-semibold text-xl">{user?.displayName || 'User'}</h4>
                  <p className="text-gray-300 text-lg">{user?.email}</p>
                </div>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl text-white font-medium transition-all duration-300">
                    Edit Profile
                  </button>
                  <button className="w-full p-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl text-white font-medium transition-all duration-300">
                    Change Password
                  </button>
                  <button className="w-full p-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl text-white font-medium transition-all duration-300">
                    Export Data
                  </button>
                  <button
                    onClick={logout}
                    className="w-full p-4 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 rounded-2xl text-red-300 font-medium transition-all duration-300"
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
          <div data-paycheck-modal className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaycheckModal(false)} />
            <div className="relative glass-modal rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-6">Add Paycheck</h3>
              <PaycheckModalContent onAddTransaction={handleAddTransaction} onClose={() => setShowPaycheckModal(false)} />
            </div>
          </div>
        )}

        {/* Savings Modal */}
        {showSavingsModal && (
          <div data-savings-modal className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSavingsModal(false)} />
            <div className="relative glass-modal rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-6">Create Savings Jar</h3>
              <SavingsModalContent onAddGoal={addGoal} onClose={() => setShowSavingsModal(false)} />
            </div>
          </div>
        )}

        {/* Budget Modal */}
        {showBudgetModal && (
          <div data-budget-modal className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBudgetModal(false)} />
            <div className="relative glass-modal rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-6">Add Budget Category</h3>
              <BudgetModalContent onAddBudget={addBudget} onClose={() => setShowBudgetModal(false)} />
            </div>
          </div>
        )}

        {/* Expense Modal */}
        {showExpenseModal && (
          <div data-expense-modal className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExpenseModal(false)} />
            <div className="relative glass-modal rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-6">Log Expense</h3>
              <ExpenseModalContent onAddTransaction={handleAddTransaction} onClose={() => setShowExpenseModal(false)} />
            </div>
          </div>
        )}

        {/* AI Insights Card */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <AIInsightCard transactions={transactions} balance={totalBalance} />
          </div>
        </div>

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
        <AchievementsProvider>
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
        </AchievementsProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

import { useState } from 'react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const ReminderBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentReminder, setCurrentReminder] = useState(0);

  const reminders = [
    {
      message: "You haven't logged rent this month",
      emoji: "🏠",
      action: "Log now",
      type: "reminder"
    },
    {
      message: "Set a goal for August?",
      emoji: "🎯",
      action: "Create goal",
      type: "suggestion"
    },
    {
      message: "Great job! You're 15% under budget",
      emoji: "👏",
      action: "View details",
      type: "success"
    },
    {
      message: "Don't forget to track your coffee runs",
      emoji: "☕",
      action: "Quick add",
      type: "reminder"
    }
  ];

  const handleNextReminder = () => {
    const reminder = reminders[currentReminder];
    
    // Handle different actions based on reminder type
    switch (reminder.action) {
      case "Log now":
        // Open expense modal for rent
        const event = new CustomEvent('openExpenseModal');
        document.dispatchEvent(event);
        break;
      case "Create goal":
        // Open savings modal
        const savingsEvent = new CustomEvent('openSavingsModal');
        document.dispatchEvent(savingsEvent);
        break;
      case "View details":
        // Scroll to budget plan card
        const budgetCard = document.querySelector('[data-budget-plan-card]');
        if (budgetCard) {
          budgetCard.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case "Quick add":
        // Open expense modal for quick expense
        const quickEvent = new CustomEvent('openExpenseModal');
        document.dispatchEvent(quickEvent);
        break;
      default:
        // Just cycle to next reminder
        break;
    }
    
    setCurrentReminder((prev) => (prev + 1) % reminders.length);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const reminder = reminders[currentReminder];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400';
      case 'reminder':
        return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400';
      case 'suggestion':
        return 'from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-400';
      default:
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400';
    }
  };

  return (
    <div className={`glass-card rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden`}>
      {/* Background gradient based on type */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getTypeStyles(reminder.type)} opacity-10`}></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl opacity-40"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
              <BellIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{reminder.emoji}</span>
              <div>
                <p className="text-white text-lg font-medium">
                  {reminder.message}
                </p>
                <p className="text-gray-300 text-sm">
                  Smart reminder from your dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleNextReminder}
              className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              {reminder.action}
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              <XMarkIcon className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderBanner; 
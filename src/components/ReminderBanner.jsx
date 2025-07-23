import { useState } from 'react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const ReminderBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentReminder, setCurrentReminder] = useState(0);

  const reminders = [
    {
      message: "You haven't logged rent this month",
      emoji: "🏠",
      action: "Log now"
    },
    {
      message: "Set a goal for August?",
      emoji: "🎯",
      action: "Create goal"
    },
    {
      message: "Great job! You're 15% under budget",
      emoji: "👏",
      action: "View details"
    },
    {
      message: "Don't forget to track your coffee runs",
      emoji: "☕",
      action: "Quick add"
    }
  ];

  const handleNextReminder = () => {
    const reminder = reminders[currentReminder];
    
    // Handle different actions based on reminder type
    switch (reminder.action) {
      case "Log now":
        // Open transaction form for rent
        const event = new CustomEvent('openTransactionForm', { 
          detail: { type: 'expense', category: '🏠 Housing' } 
        });
        document.dispatchEvent(event);
        break;
      case "Create goal":
        // Scroll to savings goals
        const goalsSection = document.querySelector('[data-savings-goals]');
        if (goalsSection) {
          goalsSection.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case "Quick add":
        // Open transaction form for quick expense
        const quickEvent = new CustomEvent('openTransactionForm', { 
          detail: { type: 'expense' } 
        });
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

  return (
    <div className="bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-purple-500/20 backdrop-blur-lg rounded-xl shadow-2xl shadow-purple-500/20 border border-purple-500/30 p-6 min-h-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
            <BellIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl">{reminder.emoji}</span>
            <span className="text-white text-base font-medium">
              {reminder.message}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNextReminder}
            className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
          >
            {reminder.action}
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderBanner; 
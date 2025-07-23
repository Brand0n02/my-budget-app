import { useState } from 'react';
import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const AIInsightCard = ({ transactions, balance }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate insights based on transactions
  const calculateInsights = () => {
    if (transactions.length === 0) {
      return {
        message: "Investment opportunity",
        type: "info",
        icon: "💡",
        tip: "Based on your savings pattern, you could invest $500 monthly in a diversified portfolio.",
        action: "Explore options →"
      };
    }

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncome - totalExpenses;

    // Category analysis
    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    // Generate insights
    if (netFlow > 0) {
      return {
        message: "Investment opportunity",
        type: "positive",
        icon: "💡",
        tip: "Based on your savings pattern, you could invest $500 monthly in a diversified portfolio.",
        action: "Explore options →"
      };
    } else if (netFlow < -500) {
      return {
        message: "Spending alert",
        type: "warning",
        icon: "⚠️",
        tip: "Consider reducing expenses in " + (topCategory?.[0] || "general spending") + " to improve your financial health.",
        action: "View details →"
      };
    } else {
      return {
        message: "Savings opportunity",
        type: "neutral",
        icon: "💰",
        tip: "Small adjustments can help you start saving. Track your daily coffee habit!",
        action: "Set goals →"
      };
    }
  };

  const insights = calculateInsights();

  const getInsightStyles = () => {
    switch (insights.type) {
      case 'positive':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          text: 'text-green-400',
          icon: 'text-green-400'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          text: 'text-orange-400',
          icon: 'text-orange-400'
        };
      case 'neutral':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          icon: 'text-blue-400'
        };
      default:
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          icon: 'text-purple-400'
        };
    }
  };

  const styles = getInsightStyles();

  return (
    <div className="group relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/50 border border-slate-700/50 p-8 overflow-hidden hover:shadow-slate-900/70 transition-all duration-500 hover:scale-[1.01]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">AI Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
          </div>
          <div className="w-5 h-5 text-purple-400">🧠</div>
        </div>
      </div>

      {/* Main Insight */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="text-3xl">{insights.icon}</div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-3 text-lg">{insights.message}</h4>
          <p className="text-gray-400 text-base leading-relaxed">
            {insights.tip}
          </p>
          <button className="text-purple-400 text-base font-medium mt-3 hover:text-purple-300 transition-colors">
            {insights.action}
          </button>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-gray-700/30">
        <button
          onClick={() => {
            const event = new CustomEvent('openTransactionForm', { 
              detail: { type: 'income', category: '💰 Salary' } 
            });
            document.dispatchEvent(event);
          }}
          className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>💵</span>
          <span>Quick Add Paycheck</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 mt-4">
        ... AI analyzing your financial patterns...
      </div>
    </div>
  );
};

export default AIInsightCard; 
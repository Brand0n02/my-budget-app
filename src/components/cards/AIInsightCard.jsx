import '../../styles/glass.css';
import { useState, useEffect } from 'react';
import { SparklesIcon, LightBulbIcon, ChatBubbleLeftRightIcon, CheckIcon, XMarkIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import { EnhancedBudgetParser } from '../../utils/enhancedParser';
import { VoiceInputHandler } from '../../utils/voiceInput';
import { BudgetLearningEngine } from '../../utils/budgetLearning';

const AIInsightCard = ({ transactions = [], balance = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState('insights'); // 'insights' or 'assistant'
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const { addTransaction, addPaycheck } = useData();
  
  // Initialize enhanced tools
  const [parser] = useState(() => new EnhancedBudgetParser());
  const [voiceHandler] = useState(() => new VoiceInputHandler());
  const [learningEngine] = useState(() => new BudgetLearningEngine());

  // Calculate insights based on transactions
  const calculateInsights = () => {
    if (!transactions || transactions.length === 0) {
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

  // Generate smart suggestions on input change
  useEffect(() => {
    if (input.trim()) {
      const parsed = parser.parse(input);
      const smartSuggestions = learningEngine.generateSmartSuggestions(input, parsed.paycheck);
      setSuggestions([...parsed.suggestions, ...smartSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [input, parser, learningEngine]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      const parsed = parser.parse(input);
      setParsedData(parsed);
      setIsProcessing(false);
    }, 800);
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if (isListening) {
      voiceHandler.stopListening();
      setIsListening(false);
      return;
    }

    const success = voiceHandler.startListening(
      (result) => {
        if (result.isFinal) {
          setInput(result.transcript);
          setIsListening(false);
        }
      },
      (error) => {
        console.error('Voice input error:', error);
        setIsListening(false);
        alert('Voice input failed. Please try again or check microphone permissions.');
      }
    );

    if (success) {
      setIsListening(true);
    } else {
      alert('Voice input not supported in this browser');
    }
  };

  const handleApplyPlan = async () => {
    if (!parsedData) return;

    try {
      // Add paycheck if specified
      if (parsedData.paycheck > 0) {
        await addPaycheck({
          amount: parsedData.paycheck,
          description: 'AI Assistant Paycheck',
          date: new Date().toISOString()
        });
      }

      // Add transactions for each allocation using enhanced parser
      for (const [category, amount] of Object.entries(parsedData.allocations)) {
        const categoryInfo = parser.getCategoryInfo(category);

        await addTransaction({
          amount: category === 'savings' || category === 'investment' ? amount : -amount,
          description: `AI Assistant - ${categoryInfo.label}`,
          category: categoryInfo.budgetCategory,
          type: category === 'savings' || category === 'investment' ? 'transfer' : 'expense',
          date: new Date().toISOString()
        });
      }

      // Learn from successful application
      learningEngine.learnFromAllocation(input, parsedData, true);

      // Reset form
      setInput('');
      setParsedData(null);
      setMode('insights');
      
    } catch (error) {
      console.error('Error applying budget plan:', error);
      alert('Failed to apply budget plan. Please try again.');
    }
  };

  const handleReset = () => {
    setInput('');
    setParsedData(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      rent: '🏠',
      car: '🚗',
      credit_cards: '💳',
      savings: '💰',
      groceries: '🛒',
      utilities: '⚡',
      default: '📝'
    };
    return icons[category] || icons.default;
  };

  const getCategoryLabel = (category) => {
    const categoryInfo = parser.getCategoryInfo(category);
    return categoryInfo.label;
  };

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

  if (mode === 'assistant') {
    return (
      <div className="glass-card group relative p-8 overflow-hidden hover:shadow-slate-900/70 transition-all duration-500 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">AI Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMode('insights')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Back to Insights"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="I got $6000 for my paycheck. Allocate $1500 to rent, $600 for car payment, $400 for credit cards, and the rest to savings."
              className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none text-sm"
              rows={3}
              disabled={isProcessing}
            />
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Parse Budget'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isProcessing}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                <MicrophoneIcon className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
              
              {(input || parsedData) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && !parsedData && (
          <div className="mb-4">
            <h5 className="text-xs font-medium text-gray-400 mb-2">💡 Suggestions:</h5>
            <div className="space-y-1">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Section */}
        {parsedData && (
          <div className="space-y-4">
            <div className="border-t border-gray-700/50 pt-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-green-400" />
                <span>Budget Plan Preview</span>
              </h4>

              {/* Paycheck Summary */}
              {parsedData.paycheck > 0 && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💵</span>
                      <div>
                        <h5 className="text-sm font-medium text-white">Paycheck</h5>
                        <p className="text-xs text-gray-400">Total income</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-400">
                      {formatCurrency(parsedData.paycheck)}
                    </span>
                  </div>
                </div>
              )}

              {/* Allocations */}
              <div className="space-y-2 mb-4">
                {Object.entries(parsedData.allocations).map(([category, amount]) => (
                  <div key={category} className="p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getCategoryIcon(category)}</span>
                        <span className="text-sm font-medium text-white">{getCategoryLabel(category)}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyPlan}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg text-sm"
              >
                Apply Budget Plan
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-4">
          ... Describe your budget in natural language...
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card group relative p-8 overflow-hidden hover:shadow-slate-900/70 transition-all duration-500 hover:scale-[1.01]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">AI Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode('assistant')}
            className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors text-gray-400 hover:text-purple-400"
            title="Open AI Assistant"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </button>
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

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700/30 space-y-3">
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
        
        <button
          onClick={() => setMode('assistant')}
          className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 hover:text-purple-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>Ask AI Assistant</span>
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
import { useState } from 'react';
import { XMarkIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';

const AIAssistant = ({ isOpen, onClose, onApplyPlan }) => {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock parser function - replace with actual NLP later
  const mockParser = (text) => {
    // Simple regex-based parsing for demo
    const paycheckMatch = text.match(/(?:paycheck|got|received).*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    const allocations = {};
    
    // Common allocation patterns
    const patterns = [
      { key: 'rent', regex: /rent.*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i },
      { key: 'car', regex: /(?:car|auto).*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i },
      { key: 'credit_cards', regex: /(?:credit|card).*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i },
      { key: 'savings', regex: /(?:savings|save).*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i },
      { key: 'groceries', regex: /(?:groceries|food).*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i },
      { key: 'utilities', regex: /(?:utilities|bills).*?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i },
    ];

    patterns.forEach(({ key, regex }) => {
      const match = text.match(regex);
      if (match) {
        allocations[key] = parseFloat(match[1].replace(/,/g, ''));
      }
    });

    // Handle "rest to savings" logic
    if (text.match(/rest.*(?:savings|save)/i) && paycheckMatch) {
      const totalPaycheck = parseFloat(paycheckMatch[1].replace(/,/g, ''));
      const allocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
      if (allocated < totalPaycheck) {
        allocations.savings = totalPaycheck - allocated;
      }
    }

    return {
      paycheck: paycheckMatch ? parseFloat(paycheckMatch[1].replace(/,/g, '')) : 0,
      allocations
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const parsed = mockParser(input);
      setParsedData(parsed);
      setIsProcessing(false);
    }, 1000);
  };

  const handleApplyPlan = () => {
    if (parsedData && onApplyPlan) {
      onApplyPlan(parsedData);
      setInput('');
      setParsedData(null);
      onClose();
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
    const labels = {
      rent: 'Rent',
      car: 'Car Payment',
      credit_cards: 'Credit Cards',
      savings: 'Savings',
      groceries: 'Groceries',
      utilities: 'Utilities'
    };
    return labels[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-modal rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Budget Assistant
              </h2>
              <p className="text-gray-400 text-sm">
                Describe your budget allocation in natural language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* Input Section */}
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Budget Instructions
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="I got $6000 for my paycheck. Allocate $1500 to rent, $600 for car payment, $400 for credit cards, and the rest to savings."
                  className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  rows={4}
                  disabled={isProcessing}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Parse Budget'
                  )}
                </button>
                
                {(input || parsedData) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {parsedData && (
            <div className="space-y-6">
              <div className="border-t border-gray-700/50 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-400" />
                  <span>Budget Plan Preview</span>
                </h3>

                {/* Paycheck Summary */}
                {parsedData.paycheck > 0 && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          💵
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Total Paycheck</h4>
                          <p className="text-sm text-gray-400">Income to allocate</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-green-400">
                        {formatCurrency(parsedData.paycheck)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Allocations */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-300 text-sm uppercase tracking-wide">
                    Allocations
                  </h4>
                  {Object.entries(parsedData.allocations).map(([category, amount]) => (
                    <div key={category} className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">
                            {getCategoryIcon(category)}
                          </div>
                          <div>
                            <h5 className="font-medium text-white">{getCategoryLabel(category)}</h5>
                            <p className="text-sm text-gray-400">Budget allocation</p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-white">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Check */}
                {parsedData.paycheck > 0 && (
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Total Allocated:</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(Object.values(parsedData.allocations).reduce((sum, val) => sum + val, 0))}
                      </span>
                    </div>
                    {parsedData.paycheck !== Object.values(parsedData.allocations).reduce((sum, val) => sum + val, 0) && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-500/20">
                        <span className="text-gray-300">Remaining:</span>
                        <span className={`font-semibold ${
                          parsedData.paycheck - Object.values(parsedData.allocations).reduce((sum, val) => sum + val, 0) >= 0 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {formatCurrency(parsedData.paycheck - Object.values(parsedData.allocations).reduce((sum, val) => sum + val, 0))}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Apply Button */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <button
                    onClick={handleApplyPlan}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
                  >
                    Apply Budget Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
import React, { useState, useEffect } from 'react';
import { PlusIcon, CalculatorIcon, XMarkIcon } from '@heroicons/react/24/outline';
import '../../styles/glass.css';

const TransactionForm = ({ onAddTransaction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '🍔 Food',
    type: 'expense'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Listen for external triggers to open form with preset type
  useEffect(() => {
    const handleExternalTrigger = (event) => {
      const { type, category } = event.detail;
      setIsOpen(true);
      setFormData(prev => ({ 
        ...prev, 
        type,
        category: category || prev.category 
      }));
    };

    document.addEventListener('openTransactionForm', handleExternalTrigger);
    return () => document.removeEventListener('openTransactionForm', handleExternalTrigger);
  }, []);
  
  const [errors, setErrors] = useState({});
  const [calculatorValue, setCalculatorValue] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

  const categories = {
    expense: ['🍔 Food', '🚗 Transport', '🏠 Housing', '🛒 Shopping', '💊 Health', '🎮 Entertainment', '📚 Education', '💡 Utilities'],
    income: ['💰 Salary', '💼 Freelance', '📈 Investment', '🎁 Gift', '🏦 Refund', '💸 Other']
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transaction = {
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      type: formData.type,
      date: new Date().toISOString()
    };

    onAddTransaction(transaction);

    setFormData({ amount: '', description: '', category: '🍔 Food', type: 'expense' });
    setErrors({});
    setIsOpen(false);
    setCalculatorValue('');
  };

  const calculateResult = (expression) => {
    try {
      // Replace × with * and ÷ with /
      const sanitizedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      // Use Function constructor instead of eval for safer evaluation
      const result = new Function('return ' + sanitizedExpression)();
      return isFinite(result) ? result : 'Error';
    } catch (error) {
      return 'Error';
    }
  };

  const handleCalculatorInput = (value) => {
    if (value === '=') {
      try {
        const result = calculateResult(calculatorValue);
        if (result !== 'Error') {
          setFormData(prev => ({ ...prev, amount: result.toString() }));
          setCalculatorValue('');
          setShowCalculator(false);
        } else {
          setCalculatorValue('Error');
        }
      } catch (error) {
        setCalculatorValue('Error');
      }
    } else if (value === 'C') {
      setCalculatorValue('');
    } else if (value === '⌫') {
      setCalculatorValue(prev => prev.slice(0, -1));
    } else {
      setCalculatorValue(prev => prev + value);
    }
  };

  const calculatorButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', '⌫']
  ];

  return (
    <>
      {/* Compact Inline Form */}
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Add Transaction</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <PlusIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Type Toggle */}
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                formData.type === 'expense'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                formData.type === 'income'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💰 Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Amount *</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, amount: e.target.value }));
                  if (errors.amount) {
                    setErrors(prev => ({ ...prev, amount: '' }));
                  }
                }}
                placeholder="0.00"
                className={`flex-1 bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.amount 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-white/10 focus:border-purple-500/50'
                }`}
                step="0.01"
                min="0"
              />
              <button
                type="button"
                onClick={() => setShowCalculator(!showCalculator)}
                className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <CalculatorIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {errors.amount && (
              <p className="text-red-400 text-sm">{errors.amount}</p>
            )}
          </div>

          {/* Calculator */}
          {showCalculator && (
            <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
              <div className="bg-gray-900/50 rounded-lg p-3 text-right text-white font-mono">
                {calculatorValue || '0'}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {calculatorButtons.flat().map((btn, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCalculatorInput(btn)}
                    className="py-3 px-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white font-medium transition-colors"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, description: e.target.value }));
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: '' }));
                }
              }}
              placeholder="What was this for?"
              className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.description 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-white/10 focus:border-purple-500/50'
              }`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Add Transaction
          </button>
        </form>
      </div>

      {/* Modal Overlay for Advanced Features */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Advanced Transaction</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-300 mb-2">Advanced Features</p>
              <p className="text-gray-500 text-sm">Coming soon: Recurring transactions, split payments, and more!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionForm; 
import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import Calculator from '../ui/Calculator';

const ExpenseModalContent = ({ onAddTransaction, onClose }) => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      // Validate inputs
      const amountStr = formData.get('amount')?.trim();
      const description = formData.get('description')?.trim();
      const category = formData.get('category')?.trim();
      const dateStr = formData.get('date')?.trim();
      
      // Validate amount
      const amount = parseFloat(amountStr);
      if (!amountStr || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense amount greater than 0');
        return;
      }
      
      if (amount > 1000000) {
        alert('Expense amount cannot exceed $1,000,000');
        return;
      }
      
      // Validate description
      if (!description || description.length < 2) {
        alert('Please enter a description (at least 2 characters)');
        return;
      }
      
      if (description.length > 100) {
        alert('Description cannot exceed 100 characters');
        return;
      }
      
      // Validate category
      if (!category) {
        alert('Please select a category');
        return;
      }
      
      // Validate date
      const date = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(date.getTime())) {
        alert('Please enter a valid date');
        return;
      }
      
      const expense = {
        amount,
        description,
        category,
        type: 'expense',
        date: date.toISOString(),
        notes: formData.get('notes')?.trim() || ''
      };
      
      try {
        // Add the transaction
        await onAddTransaction(expense);
        onClose();
      } catch (error) {
        console.error('Error logging expense:', error);
        alert('Failed to log expense. Please try again.');
      }
    }}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Amount</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              className="flex-1 bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
              placeholder="25.00"
            />
            <button
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <CalculatorIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {showCalculator && (
            <Calculator 
              onCalculate={(result) => {
                const amountInput = document.querySelector('input[name="amount"]');
                if (amountInput) amountInput.value = result.toString();
                setShowCalculator(false);
              }}
              onClose={() => setShowCalculator(false)}
            />
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Description</label>
          <input
            type="text"
            name="description"
            required
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
            placeholder="What was this expense for?"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Category</label>
          <select
            name="category"
            required
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
          >
            <option value="">Select a category</option>
            <option value="🏠 Rent">🏠 Rent</option>
            <option value="🛒 Groceries">🛒 Groceries</option>
            <option value="🚗 Transportation">🚗 Transportation</option>
            <option value="⚡ Utilities">⚡ Utilities</option>
            <option value="🎮 Entertainment">🎮 Entertainment</option>
            <option value="👕 Shopping">👕 Shopping</option>
            <option value="🍽️ Dining">🍽️ Dining</option>
            <option value="💊 Healthcare">💊 Healthcare</option>
            <option value="📚 Education">📚 Education</option>
            <option value="🏖️ Travel">🏖️ Travel</option>
            <option value="💳 Debt">💳 Debt</option>
            <option value="💰 Savings">💰 Savings</option>
            <option value="🍔 Food">🍔 Food</option>
            <option value="💡 Other">💡 Other</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Notes (optional)</label>
          <textarea
            name="notes"
            rows="2"
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
            placeholder="Additional details..."
          />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-colors"
        >
          Track Expense
        </button>
      </div>
    </form>
  );
};

export default ExpenseModalContent; 
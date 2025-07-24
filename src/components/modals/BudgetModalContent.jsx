import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import Calculator from '../ui/Calculator';

const BudgetModalContent = ({ onAddBudget, onClose }) => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      // Validate inputs
      const category = formData.get('category')?.trim();
      const allocatedStr = formData.get('allocated')?.trim();
      
      if (!category) {
        alert('Please select a category');
        return;
      }
      
      const allocated = parseFloat(allocatedStr);
      if (!allocatedStr || isNaN(allocated) || allocated <= 0) {
        alert('Please enter a valid budget amount greater than 0');
        return;
      }
      
      if (allocated > 1000000) {
        alert('Budget amount cannot exceed $1,000,000');
        return;
      }
      
      const budget = {
        category,
        allocated,
        spent: 0, // Start with 0 spent
        color: formData.get('color') || 'bg-blue-500'
      };
      
      try {
        // Add the budget to Firebase
        await onAddBudget(budget);
        onClose();
      } catch (error) {
        console.error('Error adding budget:', error);
        alert('Failed to add budget category. Please try again.');
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
          <div className="flex gap-2">
            <input
              type="number"
              name="allocated"
              step="0.01"
              className="flex-1 bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="500.00"
              required
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
                const allocatedInput = document.querySelector('input[name="allocated"]');
                if (allocatedInput) allocatedInput.value = result.toString();
                setShowCalculator(false);
              }}
              onClose={() => setShowCalculator(false)}
            />
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Color</label>
          <input
            type="hidden"
            name="color"
            defaultValue="bg-blue-500"
          />
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
                onClick={(e) => {
                  const form = e.target.closest('form');
                  const colorInput = form?.querySelector('input[name="color"]');
                  if (colorInput) colorInput.value = color.class;
                  // Update visual selection
                  form?.querySelectorAll('[data-color-button]').forEach(btn => {
                    btn.classList.remove('bg-blue-500/30', 'border-blue-500/50');
                    btn.classList.add('bg-gray-800/50', 'border-gray-600/30');
                  });
                  e.target.classList.remove('bg-gray-800/50', 'border-gray-600/30');
                  e.target.classList.add('bg-blue-500/30', 'border-blue-500/50');
                }}
                data-color-button
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
          onClick={onClose}
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
  );
};

export default BudgetModalContent; 
import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import Calculator from '../ui/Calculator';

const SavingsModalContent = ({ onAddGoal, onClose }) => {
  const [showTargetCalculator, setShowTargetCalculator] = useState(false);
  const [showCurrentCalculator, setShowCurrentCalculator] = useState(false);

  return (
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
        await onAddGoal(goal);
        onClose();
        
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
          <div className="flex gap-2">
            <input
              type="number"
              name="target"
              step="0.01"
              className="flex-1 bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="5000.00"
              required
            />
            <button
              type="button"
              onClick={() => setShowTargetCalculator(!showTargetCalculator)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <CalculatorIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {showTargetCalculator && (
            <Calculator 
              onCalculate={(result) => {
                const targetInput = document.querySelector('input[name="target"]');
                if (targetInput) targetInput.value = result.toString();
                setShowTargetCalculator(false);
              }}
              onClose={() => setShowTargetCalculator(false)}
            />
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Current Amount (optional)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="current"
              step="0.01"
              className="flex-1 bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="0.00"
            />
            <button
              type="button"
              onClick={() => setShowCurrentCalculator(!showCurrentCalculator)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <CalculatorIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {showCurrentCalculator && (
            <Calculator 
              onCalculate={(result) => {
                const currentInput = document.querySelector('input[name="current"]');
                if (currentInput) currentInput.value = result.toString();
                setShowCurrentCalculator(false);
              }}
              onClose={() => setShowCurrentCalculator(false)}
            />
          )}
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
          onClick={onClose}
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
  );
};

export default SavingsModalContent; 
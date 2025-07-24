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
      
      // Validate inputs
      const name = formData.get('name')?.trim();
      const targetStr = formData.get('target')?.trim();
      const currentStr = formData.get('current')?.trim();
      const startDateStr = formData.get('startDate')?.trim();
      const deadlineStr = formData.get('deadline')?.trim();
      
      // Validate goal name
      if (!name || name.length < 2) {
        alert('Please enter a goal name (at least 2 characters)');
        return;
      }
      
      if (name.length > 50) {
        alert('Goal name cannot exceed 50 characters');
        return;
      }
      
      // Validate target amount
      const target = parseFloat(targetStr);
      if (!targetStr || isNaN(target) || target <= 0) {
        alert('Please enter a valid target amount greater than 0');
        return;
      }
      
      if (target > 10000000) {
        alert('Target amount cannot exceed $10,000,000');
        return;
      }
      
      // Validate current amount (optional)
      let current = 0;
      if (currentStr) {
        current = parseFloat(currentStr);
        if (isNaN(current) || current < 0) {
          alert('Current amount must be a valid number (0 or greater)');
          return;
        }
        
        if (current > target) {
          alert('Current amount cannot exceed target amount');
          return;
        }
      }
      
      // Validate start date
      if (!startDateStr) {
        alert('Please select a start date');
        return;
      }
      
      const startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        alert('Please enter a valid start date');
        return;
      }
      
      // Validate deadline (optional)
      let deadline = null;
      if (deadlineStr) {
        deadline = new Date(deadlineStr);
        if (isNaN(deadline.getTime())) {
          alert('Please enter a valid deadline date');
          return;
        }
        
        if (deadline <= startDate) {
          alert('Deadline must be after start date');
          return;
        }
      }
      
      const goal = {
        name,
        target,
        current,
        icon: formData.get('icon') || '🫙',
        startDate: startDate.toISOString().split('T')[0],
        deadline: deadline ? deadline.toISOString().split('T')[0] : null
      };
      
      try {
        // Add the goal to Firebase
        await onAddGoal(goal);
        onClose();
      } catch (error) {
        console.error('Error adding Savings Jar:', error);
        alert('Failed to create savings jar. Please try again.');
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
          <label className="text-sm text-gray-400 mb-2 block">Start Date</label>
          <input
            type="date"
            name="startDate"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Target Date (optional)</label>
          <input
            type="date"
            name="deadline"
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Icon</label>
          <input
            type="hidden"
            name="icon"
            defaultValue="🫙"
          />
          <div className="grid grid-cols-6 gap-2">
            {['🫙', '🏠', '🚗', '✈️', '💍', '🎓', '💻', '🏖️', '🎮', '📱', '🛡️', '💰'].map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  const iconInput = document.querySelector('input[name="icon"]');
                  if (iconInput) iconInput.value = icon;
                  // Update visual selection
                  document.querySelectorAll('[data-emoji-button]').forEach(btn => {
                    btn.classList.remove('bg-purple-500/30', 'border-purple-500/50');
                    btn.classList.add('bg-gray-800/50', 'border-gray-600/30');
                  });
                  event.target.classList.remove('bg-gray-800/50', 'border-gray-600/30');
                  event.target.classList.add('bg-purple-500/30', 'border-purple-500/50');
                }}
                data-emoji-button
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
import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import Calculator from '../ui/Calculator';

const PaycheckModalContent = ({ onAddTransaction, onClose }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [amount, setAmount] = useState('');

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const paycheck = {
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description') || 'Paycheck',
        category: '💰 Salary',
        type: 'income',
        date: formData.get('date') || new Date().toISOString(),
        notes: formData.get('notes') || ''
      };
      
      try {
        // Add the transaction
        await onAddTransaction(paycheck);
        onClose();
        
        // Show success message
        console.log('Paycheck added successfully!');
      } catch (error) {
        console.error('Error adding paycheck:', error);
      }
    }}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Amount</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
              className="flex-1 bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="2500.00"
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
                setAmount(result.toString());
                setShowCalculator(false);
              }}
              onClose={() => setShowCalculator(false)}
            />
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Description (optional)</label>
          <input
            type="text"
            name="description"
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
            placeholder="Biweekly paycheck"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Pay Date</label>
          <input
            type="date"
            name="date"
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Notes (optional)</label>
          <textarea
            name="notes"
            rows="2"
            className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
            placeholder="Bonus, overtime, etc."
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
          className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 rounded-lg transition-colors"
        >
          Add Paycheck
        </button>
      </div>
    </form>
  );
};

export default PaycheckModalContent; 
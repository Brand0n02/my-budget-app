import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

const Calculator = ({ onCalculate, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

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

  const handleInput = (value) => {
    if (value === '=') {
      try {
        const result = calculateResult(equation);
        if (result !== 'Error') {
          setDisplay(result.toString());
          setEquation(result.toString());
          onCalculate(result);
        } else {
          setDisplay('Error');
        }
      } catch (error) {
        setDisplay('Error');
      }
    } else if (value === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (value === '⌫') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      setEquation(prev => prev.length > 1 ? prev.slice(0, -1) : '');
    } else {
      const newDisplay = display === '0' ? value : display + value;
      const newEquation = equation + value;
      setDisplay(newDisplay);
      setEquation(newEquation);
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
    <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Calculator</h4>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-700/50 transition-colors"
        >
          <CalculatorIcon className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-3 text-right text-white font-mono text-lg">
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {calculatorButtons.flat().map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleInput(btn)}
            className="py-3 px-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white font-medium transition-colors"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator; 
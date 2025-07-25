import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import AIAssistant from './AIAssistant';

// Example integration component showing how to add AI Assistant to your app
const AIAssistantIntegration = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Mock function - replace with your actual budget allocation logic
  const handleApplyAllocations = (parsedData) => {
    console.log('Applying budget allocations:', parsedData);
    
    // Example implementation:
    // 1. If paycheck amount is provided, add paycheck entry
    if (parsedData.paycheck > 0) {
      // addPaycheck({
      //   amount: parsedData.paycheck,
      //   description: 'AI Assistant Paycheck',
      //   date: new Date().toISOString()
      // });
    }

    // 2. For each allocation, update corresponding budget or create transactions
    Object.entries(parsedData.allocations).forEach(([category, amount]) => {
      switch (category) {
        case 'rent':
          // updateBudget('housing', amount) or addTransaction(...)
          break;
        case 'car':
          // updateBudget('transportation', amount) or addTransaction(...)
          break;
        case 'credit_cards':
          // updateBudget('debt', amount) or addTransaction(...)
          break;
        case 'savings':
          // addToSavingsGoal(amount) or createSavingsTransaction(...)
          break;
        case 'groceries':
          // updateBudget('food', amount) or addTransaction(...)
          break;
        case 'utilities':
          // updateBudget('utilities', amount) or addTransaction(...)
          break;
        default:
          // Handle unknown categories
          console.log(`Unknown category: ${category} with amount: ${amount}`);
      }
    });

    // Show success message
    alert('Budget plan applied successfully!');
  };

  return (
    <>
      {/* AI Assistant Button - Add this to your main header navigation */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="p-4 text-gray-300 hover:text-white transition-all duration-300 relative rounded-2xl hover:bg-white/10 group"
        title="AI Budget Assistant"
      >
        <SparklesIcon className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse group-hover:scale-110 transition-transform" />
      </button>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onApplyPlan={handleApplyAllocations}
      />
    </>
  );
};

export default AIAssistantIntegration;
import { useState, useEffect } from 'react';
import { PlusIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import '../../styles/glass.css';

const PaycheckCard = ({ transactions = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Listen for external triggers to open the add paycheck modal
  useEffect(() => {
    const handleExternalTrigger = () => {
      console.log('PaycheckCard: Opening modal');
      // The modal is now handled in the main App component
    };

    document.addEventListener('openPaycheckModal', handleExternalTrigger);
    return () => document.removeEventListener('openPaycheckModal', handleExternalTrigger);
  }, []);

  // Filter income transactions (paychecks)
  const paycheckTransactions = transactions.filter(t => 
    t.type === 'income' && t.category === '💰 Salary'
  );

  // Calculate total monthly income
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = paycheckTransactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate average paycheck
  const averagePaycheck = paycheckTransactions.length > 0 
    ? paycheckTransactions.reduce((sum, t) => sum + t.amount, 0) / paycheckTransactions.length
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-card w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Paycheck Tracker</h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
        >
          <PlusIcon className="w-5 h-5 text-green-400" />
        </button>
      </div>

      {/* Income Summary */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">This Month</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(monthlyIncome)}
          </p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Average</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(averagePaycheck)}
          </p>
        </div>
      </div>

      {/* Recent Paychecks */}
      <div className="space-y-3">
        <h4 className="text-white font-medium mb-4">Recent Paychecks</h4>
        
        {paycheckTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💵</div>
            <p className="text-gray-400 text-sm">No paychecks logged yet</p>
            <p className="text-gray-500 text-xs">Add your first paycheck to get started!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>💵</span>
              <span>Add First Paycheck</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {paycheckTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm">💵</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {transaction.description || 'Paycheck'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <span className="text-green-400 font-semibold">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default PaycheckCard; 
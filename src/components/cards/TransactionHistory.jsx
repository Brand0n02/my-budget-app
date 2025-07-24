import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const TransactionHistory = ({ transactions, onDeleteTransaction }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'expense', label: 'Expenses', icon: '💸' },
    { key: 'income', label: 'Income', icon: '💰' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      '🍔 Food': 'bg-orange-500/20 text-orange-400',
      '🚗 Transport': 'bg-blue-500/20 text-blue-400',
      '🏠 Housing': 'bg-purple-500/20 text-purple-400',
      '🛒 Shopping': 'bg-pink-500/20 text-pink-400',
      '💊 Health': 'bg-red-500/20 text-red-400',
      '🎮 Entertainment': 'bg-indigo-500/20 text-indigo-400',
      '📚 Education': 'bg-green-500/20 text-green-400',
      '💡 Utilities': 'bg-yellow-500/20 text-yellow-400',
      '💰 Salary': 'bg-green-500/20 text-green-400',
      '💼 Freelance': 'bg-blue-500/20 text-blue-400',
      '📈 Investment': 'bg-emerald-500/20 text-emerald-400',
      '🎁 Gift': 'bg-pink-500/20 text-pink-400',
      '🏦 Refund': 'bg-cyan-500/20 text-cyan-400',
      '💸 Other': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-600/20 p-8 min-h-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
        </div>
        <span className="text-sm text-gray-400">{filteredTransactions.length} items</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-800/50 rounded-lg p-1 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              selectedFilter === filter.key
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="mr-1">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3 max-h-80 overflow-y-auto transaction-scroll">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-400 text-sm">No transactions yet</p>
            <p className="text-gray-500 text-xs">Add your first transaction to get started!</p>
            {/* Quick Add Button for empty state */}
            <button
              onClick={() => {
                const event = new CustomEvent('openTransactionForm', { 
                  detail: { type: 'expense' } 
                });
                document.dispatchEvent(event);
              }}
              className="mt-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>🛒</span>
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-white/5 hover:border-blue-500/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getCategoryColor(transaction.category)}`}>
                  {transaction.category.split(' ')[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{transaction.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                    <span className="text-gray-500 text-xs">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`font-semibold text-sm ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                </span>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-all duration-200"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory; 
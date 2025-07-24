const QuickActions = ({ onAddPaycheck, onSavingsJar, onBudgetPlan, onLogExpense }) => {
  const actions = [
    {
      id: 'paycheck',
      label: 'Add Paycheck',
      emoji: '💵',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-400 hover:to-green-500',
      onClick: onAddPaycheck
    },
    {
      id: 'savings',
      label: 'Savings Jar',
      emoji: '🏦',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-400 hover:to-purple-500',
      onClick: onSavingsJar
    },
    {
      id: 'budget',
      label: 'Budget Plan',
      emoji: '📊',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-400 hover:to-blue-500',
      onClick: onBudgetPlan
    },
    {
      id: 'expense',
      label: 'Log Expense',
      emoji: '🛒',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-400 hover:to-red-500',
      onClick: onLogExpense
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-600/20 p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        <span className="text-sm text-gray-400">Command Center</span>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-12">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-6 rounded-xl bg-gradient-to-br ${action.color} ${action.hoverColor} transition-all duration-300 hover:scale-105 hover:shadow-lg group h-32`}
          >
            <div className="flex flex-col items-center justify-center space-y-3 h-full">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-2xl">{action.emoji}</span>
              </div>
              <span className="text-white text-base font-medium text-center">
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 
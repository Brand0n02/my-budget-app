import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '../../styles/glass.css';

const BalanceCard = ({ 
  balance = 25847.92, 
  percentageChange = 12.5, 
  timeframe = "vs last month" 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage}%`;
  };

  return (
    <div className="glass-card">
      {/* Elegant background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 rounded-xl"></div>
      
      {/* Subtle glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <div className="w-4 h-4 rounded-sm bg-white/90"></div>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-1">
                Total Balance
              </h3>
              <p className="text-slate-400 text-sm">Current portfolio value</p>
            </div>
          </div>
          <button
            onClick={toggleVisibility}
            className="p-3 rounded-lg bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600/50 transition-all duration-200 group/btn"
          >
            {isVisible ? (
              <EyeIcon className="w-6 h-6 text-slate-300 group-hover/btn:text-white transition-colors duration-200" />
            ) : (
              <EyeSlashIcon className="w-6 h-6 text-slate-300 group-hover/btn:text-white transition-colors duration-200" />
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-slate-800/30 via-slate-800/10 to-transparent rounded-lg p-8 border-l-4 border-violet-500">
            {isVisible ? (
              <h2 className="text-6xl font-bold text-white tracking-tight leading-none mb-4">
                {formatBalance(balance)}
              </h2>
            ) : (
              <h2 className="text-6xl font-bold text-slate-500 tracking-tight leading-none mb-4">
                ••••••••
              </h2>
            )}
            <p className="text-slate-400 text-sm font-medium">USD • United States Dollar</p>
          </div>
        </div>

        {/* Performance Indicator */}
        {percentageChange !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className={`flex items-center space-x-3 px-5 py-3 rounded-lg ${
                percentageChange >= 0
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : 'bg-rose-500/10 border border-rose-500/20'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  percentageChange >= 0 ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></div>
                <span className={`text-base font-semibold ${
                  percentageChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isVisible ? `${percentageChange >= 0 ? '+' : ''}${percentageChange}%` : '•••%'}
                </span>
              </div>
              <span className="text-slate-400 text-base">{timeframe}</span>
            </div>
            
            {/* Mini chart */}
            <div className="flex items-end space-x-2 h-8">
              {[...Array(6)].map((_, i) => {
                const height = 20 + Math.sin(i * 0.8) * 15 + (percentageChange >= 0 ? i * 8 : (6-i) * 8);
                return (
                  <div
                    key={i}
                    className={`w-2 rounded-sm transition-all duration-700 ${
                      percentageChange >= 0 
                        ? 'bg-gradient-to-t from-emerald-500/60 to-emerald-400' 
                        : 'bg-gradient-to-t from-rose-500/60 to-rose-400'
                    }`}
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
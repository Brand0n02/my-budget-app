import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

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
    <div className="group relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/50 border border-slate-700/50 p-8 overflow-hidden hover:shadow-slate-900/70 transition-all duration-500 hover:scale-[1.02]">
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.05] via-transparent to-cyan-500/[0.05]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            <h3 className="text-slate-400 text-sm font-semibold tracking-wider uppercase">
              Total Balance
            </h3>
          </div>
          <button
            onClick={toggleVisibility}
            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-violet-500/50 group/btn"
          >
            {isVisible ? (
              <EyeIcon className="w-5 h-5 text-slate-400 group-hover/btn:text-violet-400 transition-colors duration-300" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-slate-400 group-hover/btn:text-violet-400 transition-colors duration-300" />
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="mb-8">
          {isVisible ? (
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight leading-none">
              {formatBalance(balance)}
            </h2>
          ) : (
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-500 to-slate-400 bg-clip-text text-transparent tracking-tight leading-none">
              ••••••
            </h2>
          )}
          <p className="text-slate-500 text-sm mt-3 font-medium tracking-wide">USD • United States Dollar</p>
        </div>

        {/* Percentage Indicator */}
        {percentageChange !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
                percentageChange >= 0
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15'
              }`}>
                <svg className={`w-4 h-4 ${percentageChange >= 0 ? 'rotate-0' : 'rotate-180'} transition-transform duration-300`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-bold">
                  {isVisible ? `${Math.abs(percentageChange)}%` : '•••%'}
                </span>
              </div>
              <span className="text-slate-500 text-sm font-medium">
                {timeframe}
              </span>
            </div>
            
            {/* Mini trend indicator */}
            <div className="flex items-end space-x-1 h-8">
              {[...Array(6)].map((_, i) => {
                const height = 20 + Math.sin(i * 0.8) * 15 + (percentageChange >= 0 ? i * 5 : (6-i) * 5);
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-700 ${
                      percentageChange >= 0 
                        ? 'bg-gradient-to-t from-emerald-500/60 to-emerald-400/80' 
                        : 'bg-gradient-to-t from-rose-500/60 to-rose-400/80'
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
import { useEffect, useState } from 'react';

const SuccessToast = ({ message, isVisible, onClose, type = 'success' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose?.(), 300); // Allow fade out animation
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !show) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400';
      case 'achievement':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-400';
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'achievement':
        return '🌟';
      case 'warning':
        return '⚠️';
      default:
        return '✓';
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] transform transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`
        ${getToastStyles()} text-white px-6 py-4 rounded-2xl shadow-2xl border-2 
        backdrop-blur-sm min-w-[300px] max-w-[400px]
        hover:scale-105 transition-transform duration-200
      `}>
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-bounce">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">
              {type === 'success' && 'Success!'}
              {type === 'achievement' && 'Achievement Unlocked!'}
              {type === 'warning' && 'Over Budget!'}
            </div>
            <div className="text-sm opacity-90">
              {message}
            </div>
          </div>
          <button
            onClick={() => {
              setShow(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="text-white/70 hover:text-white transition-colors duration-200 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Progress bar showing time remaining */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div 
            className="h-1 bg-white/60 rounded-full transition-all duration-[3000ms] ease-linear"
            style={{
              width: show ? '0%' : '100%',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;
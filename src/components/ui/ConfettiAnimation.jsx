import { useEffect, useState } from 'react';

const ConfettiAnimation = ({ isActive, onComplete, type = 'savings' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Create confetti particles
    const newParticles = [];
    const particleCount = type === 'savings' ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: getRandomColor(type),
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2
        },
        shape: getRandomShape(type)
      });
    }
    
    setParticles(newParticles);

    // Auto-complete after animation duration
    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isActive, type, onComplete]);

  const getRandomColor = (animationType) => {
    const savingsColors = [
      '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', // Emerald/Green
      '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', // Amber/Yellow
      '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'  // Purple
    ];
    
    const budgetColors = [
      '#EF4444', '#F87171', '#FCA5A5', '#FECACA', // Red
      '#F97316', '#FB923C', '#FDBA74', '#FED7AA', // Orange
      '#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC'  // Cyan
    ];
    
    const colors = animationType === 'savings' ? savingsColors : budgetColors;
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomShape = (animationType) => {
    const savingsShapes = ['circle', 'star', 'diamond', 'heart'];
    const budgetShapes = ['circle', 'square', 'triangle'];
    
    const shapes = animationType === 'savings' ? savingsShapes : budgetShapes;
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const renderShape = (particle) => {
    const baseClasses = `absolute transition-all duration-1000 ease-out`;
    const style = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      transform: `rotate(${particle.rotation}deg)`,
      animation: `confetti-fall 4s ease-out forwards, confetti-spin 2s linear infinite`
    };

    switch (particle.shape) {
      case 'star':
        return (
          <div
            key={particle.id}
            className={`${baseClasses} star-shape`}
            style={style}
          >
            ⭐
          </div>
        );
      case 'heart':
        return (
          <div
            key={particle.id}
            className={`${baseClasses} heart-shape text-xs`}
            style={style}
          >
            💖
          </div>
        );
      case 'diamond':
        return (
          <div
            key={particle.id}
            className={`${baseClasses} transform rotate-45`}
            style={style}
          />
        );
      case 'triangle':
        return (
          <div
            key={particle.id}
            className={`${baseClasses}`}
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${particle.size/2}px solid transparent`,
              borderRight: `${particle.size/2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`
            }}
          />
        );
      case 'square':
        return (
          <div
            key={particle.id}
            className={baseClasses}
            style={style}
          />
        );
      default: // circle
        return (
          <div
            key={particle.id}
            className={`${baseClasses} rounded-full`}
            style={style}
          />
        );
    }
  };

  if (!isActive || particles.length === 0) return null;

  return (
    <>
      {/* Confetti Animation Styles */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes confetti-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .star-shape {
          font-size: ${particles[0]?.size || 12}px;
          line-height: 1;
          background: none !important;
        }
        
        .heart-shape {
          font-size: ${particles[0]?.size || 12}px;
          line-height: 1;
          background: none !important;
        }
      `}</style>
      
      {/* Confetti Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map(renderShape)}
      </div>
      
      {/* Achievement Banner */}
      {type === 'savings' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-emerald-300">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-xl font-bold">Goal Achieved!</div>
              <div className="text-sm opacity-90">Congratulations! 🌟</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Budget Completion Banner */}
      {type === 'budget' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-pulse">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-blue-300">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-xl font-bold">Budget Complete!</div>
              <div className="text-sm opacity-90">Well managed! 📊</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfettiAnimation;
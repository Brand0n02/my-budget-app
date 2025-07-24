import { useState, useRef, useEffect } from 'react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

const ResizableCard = ({ 
  children, 
  defaultHeight = 320,
  minHeight = 200,
  maxHeight = 600,
  onSizeChange,
  className = '',
  dataAttribute = ''
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const cardRef = useRef(null);
  const resizeButtonRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(height);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - startY;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
    setHeight(newHeight);
    
    if (onSizeChange) {
      onSizeChange(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, startY, startHeight, height]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative group transition-all duration-300 ${className} ${
        isExpanded ? 'col-span-2 row-span-2' : ''
      }`}
      data-attribute={dataAttribute}
    >
      {/* Resize Button - Always Visible */}
      <div className="absolute bottom-2 left-2 z-20">
        <button
          ref={resizeButtonRef}
          onMouseDown={handleMouseDown}
          className="w-8 h-8 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-600/30 flex items-center justify-center cursor-ns-resize hover:bg-gray-700/90 transition-all duration-200 shadow-lg"
          title="Drag to resize"
        >
          <div className="w-4 h-4 flex flex-col items-center justify-center">
            <div className="w-3 h-1 bg-gray-400 rounded-sm mb-0.5"></div>
            <div className="w-3 h-1 bg-gray-400 rounded-sm mb-0.5"></div>
            <div className="w-3 h-1 bg-gray-400 rounded-sm"></div>
          </div>
        </button>
      </div>

      {/* Expand/Collapse Button */}
      <div className="absolute bottom-2 left-12 z-20">
        <button
          onClick={toggleExpanded}
          className="w-8 h-8 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-600/30 flex items-center justify-center hover:bg-gray-700/90 transition-all duration-200 shadow-lg"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ArrowsPointingInIcon className="w-4 h-4 text-gray-300" />
          ) : (
            <ArrowsPointingOutIcon className="w-4 h-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* Card Content */}
      <div 
        className={`w-full transition-all duration-300 ${
          isExpanded ? 'h-full' : ''
        }`}
        style={{ 
          height: isExpanded ? '100%' : `${height}px`,
          minHeight: isExpanded ? 'auto' : `${minHeight}px`
        }}
      >
        {children}
      </div>


    </div>
  );
};

export default ResizableCard; 
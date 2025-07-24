import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dueDates, setDueDates] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const hasDueDate = (date) => {
    const dateStr = formatDate(date);
    return dueDates.some(due => due.date === dateStr);
  };

  const getDueDatesForDate = (date) => {
    const dateStr = formatDate(date);
    return dueDates.filter(due => due.date === dateStr);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  const addDueDate = (type, description, amount) => {
    if (!selectedDate) return;

    const newDueDate = {
      id: Date.now(),
      date: formatDate(selectedDate),
      type,
      description,
      amount: parseFloat(amount) || 0,
      createdAt: new Date().toISOString()
    };

    setDueDates([...dueDates, newDueDate]);
    setShowAddModal(false);
    setSelectedDate(null);
  };

  const deleteDueDate = (id) => {
    setDueDates(dueDates.filter(due => due.id !== id));
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dueDatesForDay = getDueDatesForDate(date);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-12 border border-gray-600/30 rounded-lg p-1 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
            isToday(date) ? 'bg-blue-500/20 border-blue-500/50' : ''
          } ${
            isSelected(date) ? 'bg-purple-500/20 border-purple-500/50' : ''
          } ${
            hasDueDate(date) ? 'bg-orange-500/20 border-orange-500/50' : ''
          }`}
        >
          <div className="text-xs text-gray-300 mb-1">{day}</div>
          {dueDatesForDay.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {dueDatesForDay.slice(0, 2).map((due) => (
                <div
                  key={due.id}
                  className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                  title={`${due.type}: ${due.description}`}
                ></div>
              ))}
              {dueDatesForDay.length > 2 && (
                <div className="w-1.5 h-1.5 bg-orange-400/50 rounded-full"></div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'rent': return '🏠';
      case 'car': return '🚗';
      case 'savings': return '💰';
      case 'bill': return '📄';
      case 'other': return '📌';
      default: return '📅';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Calendar
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-300" />
            </button>
            <span className="text-white font-semibold min-w-[120px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-300" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-300" />
          )}
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {/* Calendar Grid */}
        <div className="mb-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>

        {/* Due Dates List */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold mb-3">Upcoming Due Dates</h4>
          {dueDates
            .filter(due => new Date(due.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map(due => (
              <div
                key={due.id}
                className="flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(due.type)}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{due.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(due.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-medium">
                    ${due.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteDueDate(due.id)}
                    className="p-1 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                  >
                    <span className="text-red-400 text-xs">×</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Due Dates Preview (when collapsed) */}
      {!isExpanded && (
        <div className="space-y-2">
          <h4 className="text-white font-semibold text-sm">Quick Due Dates</h4>
          {dueDates
            .filter(due => new Date(due.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3)
            .map(due => (
              <div
                key={due.id}
                className="flex items-center justify-between p-2 bg-white/10 border border-white/20 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getTypeIcon(due.type)}</span>
                  <span className="text-white text-xs font-medium">{due.description}</span>
                </div>
                <span className="text-white text-xs">
                  {new Date(due.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            ))}
          {dueDates.filter(due => new Date(due.date) >= new Date()).length === 0 && (
            <p className="text-gray-400 text-xs text-center py-2">No upcoming due dates</p>
          )}
        </div>
      )}

      {/* Add Due Date Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-md p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Add Due Date
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 text-xl">×</span>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addDueDate(
                formData.get('type'),
                formData.get('description'),
                formData.get('amount')
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <select
                    name="type"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  >
                    <option value="rent">🏠 Rent</option>
                    <option value="car">🚗 Car Payment</option>
                    <option value="savings">💰 Savings Goal</option>
                    <option value="bill">📄 Bill</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description</label>
                  <input
                    type="text"
                    name="description"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    placeholder="Rent payment, Car loan, etc."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Amount (optional)</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div className="text-sm text-gray-400">
                  Date: {selectedDate?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 hover:text-purple-300 rounded-xl transition-all duration-300"
                >
                  Add Due Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 
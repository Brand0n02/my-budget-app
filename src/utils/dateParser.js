// Free date parsing - no external APIs needed
export class SmartDateParser {
  constructor() {
    this.today = new Date();
  }

  // Parse natural language dates
  parseDate(dateString) {
    const text = dateString.toLowerCase().trim();
    
    // Handle "today", "tomorrow", etc.
    if (text.includes('today')) {
      return new Date();
    }
    
    if (text.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    // Handle "next [day]"
    const nextDayMatch = text.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
    if (nextDayMatch) {
      return this.getNextWeekday(nextDayMatch[1]);
    }

    // Handle "this friday", "next friday"
    const thisDayMatch = text.match(/(this|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
    if (thisDayMatch) {
      const [, modifier, day] = thisDayMatch;
      return modifier === 'this' ? this.getThisWeekday(day) : this.getNextWeekday(day);
    }

    // Handle "in X days"
    const inDaysMatch = text.match(/in\s+(\d+)\s+days?/);
    if (inDaysMatch) {
      const days = parseInt(inDaysMatch[1]);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      return futureDate;
    }

    // Handle "X days from now"
    const daysFromMatch = text.match(/(\d+)\s+days?\s+from\s+now/);
    if (daysFromMatch) {
      const days = parseInt(daysFromMatch[1]);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      return futureDate;
    }

    // Handle month names with days
    const monthDayMatch = text.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/);
    if (monthDayMatch) {
      const [, monthName, day] = monthDayMatch;
      const month = this.getMonthNumber(monthName);
      const year = new Date().getFullYear();
      const date = new Date(year, month, parseInt(day));
      
      // If date is in the past, assume next year
      if (date < new Date()) {
        date.setFullYear(year + 1);
      }
      
      return date;
    }

    // Handle "first of month", "15th", etc.
    const dayOfMonthMatch = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(?:of\s*(?:this|next)?\s*month)?/);
    if (dayOfMonthMatch) {
      const day = parseInt(dayOfMonthMatch[1]);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      let targetDate = new Date(currentYear, currentMonth, day);
      
      // If date has passed this month, move to next month
      if (targetDate < new Date()) {
        targetDate = new Date(currentYear, currentMonth + 1, day);
      }
      
      return targetDate;
    }

    // Handle "end of month"
    if (text.includes('end of month')) {
      const lastDay = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
      return lastDay;
    }

    // Handle "beginning of month"
    if (text.includes('beginning of month') || text.includes('start of month')) {
      const firstDay = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);
      return firstDay;
    }

    // Fallback to current date
    return new Date();
  }

  // Parse recurring schedules
  parseRecurring(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('weekly') || lowerText.includes('every week')) {
      return { type: 'weekly', interval: 1 };
    }
    
    if (lowerText.includes('bi-weekly') || lowerText.includes('every two weeks')) {
      return { type: 'weekly', interval: 2 };
    }
    
    if (lowerText.includes('monthly') || lowerText.includes('every month')) {
      return { type: 'monthly', interval: 1 };
    }
    
    if (lowerText.includes('quarterly') || lowerText.includes('every quarter')) {
      return { type: 'monthly', interval: 3 };
    }
    
    if (lowerText.includes('yearly') || lowerText.includes('annually')) {
      return { type: 'yearly', interval: 1 };
    }

    // Handle "every X days/weeks/months"
    const everyMatch = lowerText.match(/every\s+(\d+)\s+(day|week|month)s?/);
    if (everyMatch) {
      const [, interval, unit] = everyMatch;
      return {
        type: unit === 'day' ? 'daily' : unit === 'week' ? 'weekly' : 'monthly',
        interval: parseInt(interval)
      };
    }
    
    return null; // No recurring pattern found
  }

  // Get next occurrence of a weekday
  getNextWeekday(dayName) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(dayName.toLowerCase());
    const currentDay = this.today.getDay();
    
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Next week
    }
    
    const nextDate = new Date(this.today);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
  }

  // Get this week's occurrence of a weekday
  getThisWeekday(dayName) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(dayName.toLowerCase());
    const currentDay = this.today.getDay();
    
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd < 0) {
      daysToAdd += 7; // Next week since this week's day has passed
    }
    
    const targetDate = new Date(this.today);
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return targetDate;
  }

  // Convert month name to number
  getMonthNumber(monthName) {
    const months = {
      january: 0, february: 1, march: 2, april: 3,
      may: 4, june: 5, july: 6, august: 7,
      september: 8, october: 9, november: 10, december: 11
    };
    return months[monthName.toLowerCase()];
  }

  // Calculate next occurrence for recurring items
  getNextOccurrence(startDate, recurringPattern) {
    if (!recurringPattern) return null;
    
    const { type, interval } = recurringPattern;
    const nextDate = new Date(startDate);
    
    switch (type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (interval * 7));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + interval);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + interval);
        break;
    }
    
    return nextDate;
  }

  // Format date for display
  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Check if date is in the future
  isFuture(date) {
    return date > new Date();
  }

  // Get friendly relative date string
  getRelativeDate(date) {
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return this.formatDate(date);
  }
}

export default SmartDateParser;
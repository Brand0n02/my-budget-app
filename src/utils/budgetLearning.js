// Free learning system - no external APIs
export class BudgetLearningEngine {
  constructor() {
    this.userPatterns = this.loadUserPatterns();
  }

  // Load user patterns from localStorage
  loadUserPatterns() {
    try {
      const stored = localStorage.getItem('budgetPatterns');
      return stored ? JSON.parse(stored) : {
        commonAllocations: {},
        averageAmounts: {},
        preferredCategories: [],
        inputPatterns: [],
        successfulParses: [],
        lastUpdated: null
      };
    } catch (error) {
      console.warn('Failed to load user patterns:', error);
      return {
        commonAllocations: {},
        averageAmounts: {},
        preferredCategories: [],
        inputPatterns: [],
        successfulParses: [],
        lastUpdated: null
      };
    }
  }

  // Save user patterns to localStorage
  saveUserPatterns() {
    try {
      this.userPatterns.lastUpdated = new Date().toISOString();
      localStorage.setItem('budgetPatterns', JSON.stringify(this.userPatterns));
    } catch (error) {
      console.warn('Failed to save user patterns:', error);
    }
  }

  // Learn from user's successful budget allocations
  learnFromAllocation(inputText, parsedData, userApproved = true) {
    if (!userApproved) return;

    // Track input patterns
    this.userPatterns.inputPatterns.push({
      text: inputText,
      timestamp: new Date().toISOString(),
      paycheck: parsedData.paycheck,
      categories: Object.keys(parsedData.allocations)
    });

    // Update common allocations
    Object.entries(parsedData.allocations).forEach(([category, amount]) => {
      if (!this.userPatterns.commonAllocations[category]) {
        this.userPatterns.commonAllocations[category] = [];
      }
      
      this.userPatterns.commonAllocations[category].push({
        amount,
        percentage: parsedData.paycheck > 0 ? (amount / parsedData.paycheck) * 100 : 0,
        timestamp: new Date().toISOString()
      });

      // Keep only last 20 entries per category
      if (this.userPatterns.commonAllocations[category].length > 20) {
        this.userPatterns.commonAllocations[category] = 
          this.userPatterns.commonAllocations[category].slice(-20);
      }
    });

    // Update preferred categories
    const categories = Object.keys(parsedData.allocations);
    categories.forEach(category => {
      const existing = this.userPatterns.preferredCategories.find(c => c.name === category);
      if (existing) {
        existing.count++;
        existing.lastUsed = new Date().toISOString();
      } else {
        this.userPatterns.preferredCategories.push({
          name: category,
          count: 1,
          lastUsed: new Date().toISOString()
        });
      }
    });

    // Sort by usage frequency
    this.userPatterns.preferredCategories.sort((a, b) => b.count - a.count);

    // Calculate average amounts
    this.calculateAverageAmounts();
    
    this.saveUserPatterns();
  }

  // Calculate average amounts for each category
  calculateAverageAmounts() {
    Object.entries(this.userPatterns.commonAllocations).forEach(([category, allocations]) => {
      const amounts = allocations.map(a => a.amount);
      const percentages = allocations.map(a => a.percentage);
      
      this.userPatterns.averageAmounts[category] = {
        avgAmount: amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length,
        medianAmount: this.calculateMedian(amounts),
        avgPercentage: percentages.reduce((sum, pct) => sum + pct, 0) / percentages.length,
        frequency: allocations.length
      };
    });
  }

  // Calculate median value
  calculateMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  // Generate smart suggestions based on learning
  generateSmartSuggestions(currentInput = '', paycheckAmount = 0) {
    const suggestions = [];

    // Suggest based on common patterns
    if (paycheckAmount > 0) {
      const topCategories = this.userPatterns.preferredCategories.slice(0, 5);
      
      topCategories.forEach(categoryInfo => {
        const category = categoryInfo.name;
        const avgData = this.userPatterns.averageAmounts[category];
        
        if (avgData) {
          const suggestedAmount = Math.round(paycheckAmount * (avgData.avgPercentage / 100));
          suggestions.push(`${category}: $${suggestedAmount} (${Math.round(avgData.avgPercentage)}%)`);
        }
      });
    }

    // Suggest missing common categories
    const inputLower = currentInput.toLowerCase();
    const mentionedCategories = this.userPatterns.preferredCategories.filter(cat =>
      inputLower.includes(cat.name.toLowerCase())
    );
    
    if (mentionedCategories.length < 3) {
      const unmentioned = this.userPatterns.preferredCategories
        .filter(cat => !inputLower.includes(cat.name.toLowerCase()))
        .slice(0, 2);
        
      unmentioned.forEach(cat => {
        suggestions.push(`Don't forget ${cat.name} (you usually include this)`);
      });
    }

    return suggestions;
  }

  // Get user's typical budget breakdown
  getTypicalBreakdown(paycheckAmount) {
    const breakdown = {};
    
    Object.entries(this.userPatterns.averageAmounts).forEach(([category, data]) => {
      if (data.frequency >= 3) { // Only suggest if used at least 3 times
        breakdown[category] = {
          amount: Math.round(paycheckAmount * (data.avgPercentage / 100)),
          percentage: Math.round(data.avgPercentage),
          confidence: Math.min(data.frequency * 10, 100)
        };
      }
    });

    return breakdown;
  }

  // Detect input language patterns
  detectUserPreferences(inputText) {
    const preferences = {
      usesDollarSigns: inputText.includes('$'),
      usesPercentages: inputText.includes('%'),
      prefersFullWords: inputText.includes('dollars') || inputText.includes('percent'),
      commonPhrases: []
    };

    // Detect common phrases
    const phrases = [
      'put the rest',
      'allocate to',
      'save the remaining',
      'everything else to'
    ];

    phrases.forEach(phrase => {
      if (inputText.toLowerCase().includes(phrase)) {
        preferences.commonPhrases.push(phrase);
      }
    });

    return preferences;
  }

  // Get learning statistics
  getStats() {
    const totalAllocations = Object.values(this.userPatterns.commonAllocations)
      .reduce((sum, allocations) => sum + allocations.length, 0);

    return {
      totalBudgetsSaved: this.userPatterns.inputPatterns.length,
      totalAllocations,
      categoriesUsed: Object.keys(this.userPatterns.commonAllocations).length,
      mostUsedCategory: this.userPatterns.preferredCategories[0]?.name || 'None',
      learningStarted: this.userPatterns.inputPatterns[0]?.timestamp || null,
      lastActivity: this.userPatterns.lastUpdated
    };
  }

  // Reset learning data
  resetLearning() {
    this.userPatterns = {
      commonAllocations: {},
      averageAmounts: {},
      preferredCategories: [],
      inputPatterns: [],
      successfulParses: [],
      lastUpdated: null
    };
    
    localStorage.removeItem('budgetPatterns');
  }
}

export default BudgetLearningEngine;
// Enhanced free NLP parser - no API costs
export class EnhancedBudgetParser {
  constructor() {
    this.categories = {
      // Housing
      housing: {
        keywords: ['rent', 'mortgage', 'housing', 'apartment', 'house payment'],
        icon: '🏠',
        label: 'Housing',
        budgetCategory: 'Housing'
      },
      utilities: {
        keywords: ['utilities', 'electric', 'gas', 'water', 'internet', 'phone', 'cable'],
        icon: '⚡',
        label: 'Utilities', 
        budgetCategory: 'Utilities'
      },
      
      // Transportation
      car: {
        keywords: ['car', 'auto', 'vehicle', 'car payment', 'auto loan'],
        icon: '🚗',
        label: 'Car Payment',
        budgetCategory: 'Transportation'
      },
      gas: {
        keywords: ['gas', 'fuel', 'gasoline', 'petrol'],
        icon: '⛽',
        label: 'Gas',
        budgetCategory: 'Transportation'  
      },
      insurance: {
        keywords: ['insurance', 'car insurance', 'auto insurance'],
        icon: '🛡️',
        label: 'Insurance',
        budgetCategory: 'Insurance'
      },
      
      // Food
      groceries: {
        keywords: ['groceries', 'food', 'grocery', 'supermarket', 'shopping'],
        icon: '🛒',
        label: 'Groceries',
        budgetCategory: 'Food'
      },
      dining: {
        keywords: ['dining', 'restaurant', 'eating out', 'takeout', 'food delivery'],
        icon: '🍽️',
        label: 'Dining Out',
        budgetCategory: 'Food'
      },
      
      // Debt
      credit_cards: {
        keywords: ['credit', 'card', 'credit card', 'cc', 'visa', 'mastercard'],
        icon: '💳',
        label: 'Credit Cards',
        budgetCategory: 'Debt'
      },
      student_loans: {
        keywords: ['student', 'loan', 'education', 'college'],
        icon: '🎓',
        label: 'Student Loans',
        budgetCategory: 'Debt'
      },
      
      // Entertainment & Lifestyle
      entertainment: {
        keywords: ['entertainment', 'movies', 'netflix', 'streaming', 'games', 'fun'],
        icon: '🎬',
        label: 'Entertainment',
        budgetCategory: 'Entertainment'
      },
      shopping: {
        keywords: ['shopping', 'clothes', 'amazon', 'retail', 'purchases'],
        icon: '🛍️',
        label: 'Shopping',
        budgetCategory: 'Shopping'
      },
      
      // Health
      healthcare: {
        keywords: ['health', 'medical', 'doctor', 'pharmacy', 'medicine'],
        icon: '🏥',
        label: 'Healthcare',
        budgetCategory: 'Healthcare'
      },
      gym: {
        keywords: ['gym', 'fitness', 'workout', 'exercise', 'health club'],
        icon: '💪',
        label: 'Fitness',
        budgetCategory: 'Health'
      },
      
      // Savings
      savings: {
        keywords: ['savings', 'save', 'emergency', 'rainy day', 'nest egg'],
        icon: '💰',
        label: 'Savings',
        budgetCategory: 'Savings'
      },
      investment: {
        keywords: ['invest', 'investment', 'stocks', 'retirement', '401k', 'ira'],
        icon: '📈',
        label: 'Investment',
        budgetCategory: 'Investment'
      }
    };
  }

  // Extract paycheck amount with multiple patterns
  extractPaycheck(text) {
    const patterns = [
      /(?:paycheck|salary|income|got|received|earned|paid)\s*(?:is|was|of)?\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:paycheck|salary|income)/i,
      /(?:made|earning|bring home)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    }
    return 0;
  }

  // Extract allocations with smart category matching
  extractAllocations(text) {
    const allocations = {};
    const totalPaycheck = this.extractPaycheck(text);

    // Look for explicit dollar amounts
    Object.entries(this.categories).forEach(([key, category]) => {
      for (const keyword of category.keywords) {
        // Pattern: "keyword $amount" or "$amount for keyword"  
        const patterns = [
          new RegExp(`${keyword}[^\\d]*\\$?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)`, 'i'),
          new RegExp(`\\$?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)[^\\d]*(?:for|to|toward)?[^\\d]*${keyword}`, 'i'),
          new RegExp(`allocate[^\\d]*\\$?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)[^\\d]*(?:for|to|toward)?[^\\d]*${keyword}`, 'i')
        ];

        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && !allocations[key]) {
            allocations[key] = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }
      }
    });

    // Handle percentages
    Object.entries(this.categories).forEach(([key, category]) => {
      for (const keyword of category.keywords) {
        const percentPattern = new RegExp(`${keyword}[^\\d]*(\\d+)%`, 'i');
        const match = text.match(percentPattern);
        if (match && !allocations[key] && totalPaycheck > 0) {
          const percentage = parseFloat(match[1]);
          allocations[key] = (totalPaycheck * percentage) / 100;
        }
      }
    });

    // Handle "rest to" or "remaining to" logic
    const restPatterns = [
      /(?:rest|remaining|remainder|leftover|everything else)\s*(?:to|for|toward)\s*(\w+)/i,
      /put\s*(?:the\s*)?(?:rest|remaining|remainder)\s*(?:to|in|toward)\s*(\w+)/i
    ];

    for (const pattern of restPatterns) {
      const match = text.match(pattern);
      if (match && totalPaycheck > 0) {
        const targetWord = match[1].toLowerCase();
        
        // Find matching category
        const matchingCategory = Object.entries(this.categories).find(([key, category]) =>
          category.keywords.some(keyword => 
            keyword.toLowerCase().includes(targetWord) || 
            targetWord.includes(keyword.toLowerCase())
          )
        );

        if (matchingCategory) {
          const [categoryKey] = matchingCategory;
          const allocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
          if (allocated < totalPaycheck) {
            allocations[categoryKey] = totalPaycheck - allocated;
          }
        }
      }
    }

    return allocations;
  }

  // Main parsing function
  parse(text) {
    const paycheck = this.extractPaycheck(text);
    const allocations = this.extractAllocations(text);

    return {
      paycheck,
      allocations,
      confidence: this.calculateConfidence(text, paycheck, allocations),
      suggestions: this.generateSuggestions(text, allocations)
    };
  }

  // Calculate parsing confidence
  calculateConfidence(text, paycheck, allocations) {
    let confidence = 0;
    
    if (paycheck > 0) confidence += 30;
    if (Object.keys(allocations).length > 0) confidence += 40;
    if (Object.keys(allocations).length >= 3) confidence += 20;
    if (text.includes('$')) confidence += 10;
    
    return Math.min(confidence, 100);
  }

  // Generate helpful suggestions
  generateSuggestions(text, allocations) {
    const suggestions = [];
    
    if (Object.keys(allocations).length === 0) {
      suggestions.push("Try: 'I got $5000. $1200 to rent, $600 to car, rest to savings'");
    }
    
    if (!allocations.savings && !allocations.investment) {
      suggestions.push("Consider adding savings to your budget allocation");
    }
    
    return suggestions;
  }

  // Get category info by key
  getCategoryInfo(key) {
    return this.categories[key] || {
      icon: '📝',
      label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      budgetCategory: 'Other'
    };
  }
}

export default EnhancedBudgetParser;
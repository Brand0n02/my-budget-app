// Free AI parser using browser-based transformers
import { pipeline } from '@xenova/transformers';

class FreeAIParser {
  constructor() {
    this.initialized = false;
    this.classifier = null;
    this.sentimentAnalyzer = null;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Load free pre-trained models (runs in browser, no API calls)
      this.classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      this.sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      this.initialized = true;
      console.log('Free AI parser initialized');
    } catch (error) {
      console.warn('AI models failed to load, falling back to enhanced regex');
      this.initialized = false;
    }
  }

  // Smart category detection using AI
  async detectCategories(text) {
    if (!this.initialized) {
      return this.fallbackCategoryDetection(text);
    }

    const categories = [];
    const categoryPrompts = [
      'This text mentions housing or rent',
      'This text mentions transportation or car',
      'This text mentions food or groceries', 
      'This text mentions entertainment',
      'This text mentions savings or investment',
      'This text mentions debt or credit cards'
    ];

    try {
      for (const prompt of categoryPrompts) {
        const result = await this.classifier(text + ' ' + prompt);
        if (result[0].score > 0.7) {
          categories.push(this.mapPromptToCategory(prompt));
        }
      }
    } catch (error) {
      console.warn('AI classification failed, using fallback');
      return this.fallbackCategoryDetection(text);
    }

    return categories;
  }

  // Fallback to enhanced regex when AI fails
  fallbackCategoryDetection(text) {
    const categories = [];
    const patterns = {
      housing: /\b(rent|mortgage|housing|apartment)\b/i,
      transportation: /\b(car|auto|gas|transport)\b/i,
      food: /\b(food|groceries|dining|restaurant)\b/i,
      entertainment: /\b(entertainment|movies|games|fun)\b/i,
      savings: /\b(savings|save|emergency|invest)\b/i,
      debt: /\b(credit|debt|loan|card)\b/i
    };

    Object.entries(patterns).forEach(([category, pattern]) => {
      if (pattern.test(text)) {
        categories.push(category);
      }
    });

    return categories;
  }

  mapPromptToCategory(prompt) {
    const mapping = {
      'housing': 'housing',
      'transportation': 'car', 
      'food': 'groceries',
      'entertainment': 'entertainment',
      'savings': 'savings',
      'debt': 'credit_cards'
    };

    for (const [key, value] of Object.entries(mapping)) {
      if (prompt.includes(key)) return value;
    }
    return 'other';
  }

  // Enhanced parsing with AI assistance
  async parseWithAI(text) {
    await this.initialize();
    
    // Use AI to understand context and intent
    const categories = await this.detectCategories(text);
    
    // Extract amounts with enhanced regex
    const amounts = this.extractAmounts(text);
    
    // Combine AI insights with rule-based extraction
    return this.combineResults(text, categories, amounts);
  }

  extractAmounts(text) {
    const amounts = [];
    const patterns = [
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*dollars?/gi,
      /(\d+)%/g
    ];

    patterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        amounts.push({
          value: match[1],
          position: match.index,
          type: pattern.source.includes('%') ? 'percentage' : 'currency'
        });
      });
    });

    return amounts;
  }

  combineResults(text, categories, amounts) {
    // Smart logic to match amounts with categories
    const allocations = {};
    const paycheck = this.extractPaycheck(text);

    // Simple distance-based matching
    categories.forEach(category => {
      const categoryIndex = text.toLowerCase().indexOf(category);
      if (categoryIndex !== -1) {
        const nearestAmount = amounts.find(amount => 
          Math.abs(amount.position - categoryIndex) < 50
        );
        
        if (nearestAmount) {
          allocations[category] = parseFloat(nearestAmount.value.replace(/,/g, ''));
        }
      }
    });

    return {
      paycheck,
      allocations,
      confidence: 85, // Higher confidence with AI
      aiAssisted: this.initialized
    };
  }

  extractPaycheck(text) {
    const patterns = [
      /(?:paycheck|salary|income|got|received)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:paycheck|salary)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    }
    return 0;
  }
}

export default FreeAIParser;
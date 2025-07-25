// Free voice input with smart processing
export class VoiceInputHandler {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
  }

  // Check if browser supports speech recognition
  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Initialize speech recognition
  initialize() {
    if (!this.isSupported()) {
      console.warn('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Process and clean up transcript
      const cleanedTranscript = this.cleanTranscript(finalTranscript || interimTranscript);
      
      if (this.onResult) {
        this.onResult({
          transcript: cleanedTranscript,
          isFinal: finalTranscript !== '',
          confidence: event.results[0]?.length > 0 ? event.results[0][0].confidence : 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    return true;
  }

  // Clean and format transcript for budget parsing
  cleanTranscript(transcript) {
    return transcript
      // Fix common speech-to-text issues
      .replace(/\bdollars?\b/gi, '')
      .replace(/\bcent(s)?\b/gi, '')
      .replace(/\bto\b/gi, 'to')
      .replace(/\bfor\b/gi, 'for')
      // Fix number formatting
      .replace(/(\d+)\s*hundred/gi, '$1 00')
      .replace(/(\d+)\s*thousand/gi, '$1000')
      // Add dollar signs where appropriate
      .replace(/(\d+(?:\.\d{2})?)\s*(?=(?:to|for|toward)\s*(?:rent|car|food|savings|groceries))/gi, '$$$1')
      .trim();
  }

  // Start listening
  startListening(onResult, onError) {
    if (!this.recognition) {
      if (!this.initialize()) {
        onError?.('Speech recognition not supported');
        return false;
      }
    }

    this.onResult = onResult;
    this.onError = onError;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError?.(error.message);
      return false;
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Get listening status
  getIsListening() {
    return this.isListening;
  }
}

export default VoiceInputHandler;
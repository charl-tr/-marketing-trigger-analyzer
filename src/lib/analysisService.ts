export interface AnalysisRequest {
  text: string;
  options?: {
    language?: string;
    analysis_mode?: string;
    max_triggers?: number;
  };
}

export interface TriggerAnalysis {
  type: string;
  intensity: number;
  span: { start: number; end: number };
  excerpt: string;
}

export interface AnalysisStats {
  global_score: number;
  distribution: Array<{ trigger: string; percent: number }>;
  missing: string[];
}

export interface AnalysisResult {
  highlighted_text: string;
  stats: AnalysisStats;
  raw_triggers: TriggerAnalysis[];
}

export class AnalysisService {
  private static readonly API_ENDPOINT = '/api/analyze';
  private static readonly MAX_TEXT_LENGTH = 5000;

  static async analyzeText(text: string, options: AnalysisRequest['options'] = {}): Promise<AnalysisResult> {
    // Input validation
    this.validateInput(text);

    const requestBody: AnalysisRequest = {
      text: text.trim(),
      options: {
        language: 'en',
        analysis_mode: 'triggers',
        max_triggers: 15,
        ...options
      }
    };

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.message);
      }

      return result;

    } catch (error) {
      console.error('Analysis service error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Analysis service unavailable. Please try again later.'
      );
    }
  }

  private static validateInput(text: string): void {
    if (!text || typeof text !== 'string') {
      throw new Error('Please provide valid text to analyze.');
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      throw new Error('Please enter some text to analyze.');
    }

    if (trimmedText.length > this.MAX_TEXT_LENGTH) {
      throw new Error(`Text must be under ${this.MAX_TEXT_LENGTH} characters.`);
    }
  }

  static getTriggerColor(triggerType: string): string {
    const colorMap: Record<string, string> = {
      'Urgency': '#FF6B6B',
      'Scarcity': '#4ECDC4',
      'Social Proof': '#45B7D1',
      'Authority': '#96CEB4',
      'Reciprocity': '#FFEAA7',
      'Commitment & Consistency': '#DDA0DD',
      'Liking': '#98D8C8',
      'Loss Aversion': '#F7DC6F',
      'Anchoring': '#BB8FCE',
      'Framing': '#85C1E9',
      'Bandwagon': '#F8C471',
      'Fear': '#F1948A',
      'Greed': '#82E0AA',
      'Curiosity Gap': '#F9E79F',
      'Exclusivity': '#D5DBDB',
      'Storytelling': '#AED6F1',
      'Contrast': '#A9DFBF',
      'Call to Action': '#FADBD8'
    };

    return colorMap[triggerType] || '#95A5A6';
  }

  static formatTriggerName(triggerType: string): string {
    return triggerType.replace(/([A-Z])/g, ' $1').trim();
  }
}

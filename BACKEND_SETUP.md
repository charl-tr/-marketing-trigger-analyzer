# Prism Backend Setup

## Overview
Prism now includes a complete backend system for analyzing marketing text using OpenAI's GPT-4o-mini model. The system identifies psychological persuasion triggers and provides detailed analysis results.

## Features
- **Text Analysis**: Analyzes marketing copy for psychological triggers
- **OpenAI Integration**: Uses GPT-4o-mini for intelligent analysis
- **Structured Output**: Returns JSON with highlighted text, statistics, and detailed results
- **Error Handling**: Robust error handling with user-friendly messages
- **Input Validation**: Validates text length and format before processing

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the project root:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. API Endpoints

#### POST `/api/analyze`
Analyzes marketing text for persuasion triggers.

**Request Body:**
```json
{
  "text": "Your marketing copy here...",
  "options": {
    "language": "en",
    "analysis_mode": "triggers",
    "max_triggers": 15
  }
}
```

**Response:**
```json
{
  "highlighted_text": "<span class='trigger-urgency'>Limited time offer!</span>",
  "stats": {
    "global_score": 74,
    "distribution": [
      { "trigger": "Urgency", "percent": 35 },
      { "trigger": "Scarcity", "percent": 20 }
    ],
    "missing": ["Authority", "Mystery"]
  },
  "raw_triggers": [
    {
      "type": "Urgency",
      "intensity": 0.8,
      "span": { "start": 50, "end": 90 },
      "excerpt": "Limited time offer!"
    }
  ]
}
```

### 3. Supported Trigger Types
- Urgency
- Scarcity
- Social Proof
- Authority
- Reciprocity
- Commitment & Consistency
- Liking
- Loss Aversion
- Anchoring
- Framing
- Bandwagon
- Fear
- Greed
- Curiosity Gap
- Exclusivity
- Storytelling
- Contrast
- Call to Action

### 4. Usage in Frontend

```typescript
import { AnalysisService } from '@/lib/analysisService';

// Analyze text
const result = await AnalysisService.analyzeText(text, {
  language: 'en',
  max_triggers: 15
});

// Access results
console.log(result.highlighted_text); // HTML with highlights
console.log(result.stats.global_score); // Overall persuasion score
console.log(result.raw_triggers); // Detailed trigger analysis
```

### 5. Error Handling
The system handles various error scenarios:
- Invalid input text
- Text too long (>5000 characters)
- OpenAI API failures
- Network errors
- JSON parsing errors

### 6. Performance Considerations
- Uses GPT-4o-mini for cost efficiency
- Implements request validation
- Includes rate limiting considerations
- Optimized for latency

### 7. Future Extensions
- Multi-language support
- Custom LLM endpoints
- Batch analysis
- Comparison features
- Advanced insights and recommendations

## Testing
Test the API endpoint:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Limited time offer! Only 3 left in stock. Act now!"}'
```

## Troubleshooting
1. **API Key Issues**: Ensure your OpenAI API key is valid and has sufficient credits
2. **Rate Limits**: OpenAI has rate limits; implement retry logic if needed
3. **Text Length**: Maximum 5000 characters per request
4. **CORS**: Ensure proper CORS configuration for frontend integration

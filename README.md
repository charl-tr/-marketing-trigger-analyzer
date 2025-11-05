# Marketing Trigger Analyzer

A powerful web application that analyzes text content to identify psychological marketing triggers and persuasion techniques. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Text Analysis**: Upload text files or paste content directly
- **Trigger Detection**: Identifies 20+ marketing triggers including:
  - Mystery & Curiosity
  - Scarcity & Urgency
  - Social Proof & Authority
  - Reciprocity & Commitment
  - Fear & Greed
  - Storytelling & Contrast
  - And many more...
- **Visual Highlighting**: Color-coded highlighting of trigger segments
- **Detailed Analysis**: Comprehensive breakdown of detected triggers
- **Save & Load**: Store analyzed texts for future reference
- **Modern UI**: Clean, intuitive interface with drag-and-drop support

## Marketing Triggers Included

### Core Psychological Triggers
1. **Mystery** - Don't say everything you know, create curiosity
2. **Psychopathy Appeal** - Target high-adrenaline, low-anxiety individuals
3. **Scarcity** - Limited time, limited quantity, creates urgency
4. **Social Proof** - Show others are doing it, testimonials, reviews
5. **Authority** - Expertise, credentials, certifications, experience
6. **Reciprocity** - Give something first, free value, helpful content
7. **Commitment & Consistency** - Get small commitments, build consistency
8. **Liking** - Similarity, compliments, cooperation, association
9. **Fear** - Fear of missing out, fear of loss, fear of being left behind
10. **Greed** - More money, more success, more benefits

### Advanced Triggers
11. **Curiosity Gap** - Create information gaps that people want to fill
12. **Urgency** - Time pressure, deadlines, immediate action required
13. **Exclusivity** - VIP access, members-only, elite group
14. **Storytelling** - Narrative structure, personal stories, case studies
15. **Contrast** - Before vs after, problem vs solution, old vs new

## Getting Started

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Quick Start (3 steps)

1. **Clone and install:**
```bash
git clone <repository-url>
cd marketing-trigger-analyzer
npm install
```

2. **Start the app:**
```bash
npm run dev
```

3. **Open in browser:**
👉 [http://localhost:3000](http://localhost:3000)

That's it! The app will work immediately. You can optionally add your OpenAI API key via the web interface for enhanced analysis.

## Usage

1. **Input Text**: 
   - Drag and drop a `.txt` file onto the upload area
   - Or paste your text directly into the textarea

2. **Analyze**: Click the "Analyze Text" button to scan for marketing triggers

3. **Review Results**: 
   - View color-coded highlighting of trigger segments
   - See detailed breakdown of detected triggers
   - Check the summary of trigger usage

4. **Save Analysis**: Click "Save Analysis" to store the results for later reference

5. **Load Previous**: Access saved analyses from the sidebar

## How It Works

The analyzer uses pattern matching and keyword detection to identify marketing triggers in text. Each trigger has:

- **Keywords**: Specific words and phrases to look for
- **Patterns**: Regular expressions for more complex matching
- **Color Coding**: Unique colors for visual identification
- **Examples**: Sample phrases that trigger detection

## Examples

Try analyzing these sample texts:

**Mystery & Curiosity:**
> "Don't say everything you know. Keep them guessing. What happens next will shock you. Behind the scenes access coming soon."

**Scarcity & Urgency:**
> "Limited time offer! Only 5 spots left. Last chance to get this exclusive deal. Expires in 24 hours. Act now!"

**Social Proof & Authority:**
> "Join 10,000+ satisfied customers. Trusted by industry leaders. 5-star reviews. Recommended by experts with 20 years of experience."

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **File Handling**: HTML5 File API
- **Pattern Matching**: JavaScript Regular Expressions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

Inspired by Tai Lopez's marketing psychology course and Robert Cialdini's "Influence: The Psychology of Persuasion".
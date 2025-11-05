// Configuration pour l'analyseur de triggers marketing

export const config = {
  // Clé API OpenAI pour l'analyse intelligente
  // Obtenez votre clé sur https://platform.openai.com/api-keys
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // Modèle LLM à utiliser
  llmModel: 'gpt-4o-mini',
  
  // Paramètres de l'analyse
  analysis: {
    temperature: 0.3,
    maxTokens: 500,
    confidenceThreshold: 0.3
  },
  
  // Fallback si pas de clé API
  useFallback: !process.env.OPENAI_API_KEY,
  
  // Messages système pour le LLM
  systemPrompt: `You are an expert in marketing psychology and persuasion triggers. 
Analyze text segments for psychological marketing techniques used in sales copy, advertisements, and marketing content.
Focus on understanding the underlying psychological mechanisms, not just keyword matching.
Always respond with valid JSON only.`,
  
  // Instructions pour l'utilisateur
  instructions: {
    noApiKey: 'Pour une analyse intelligente, ajoutez votre clé API OpenAI dans les variables d\'environnement.',
    withApiKey: 'Analyse intelligente activée avec OpenAI GPT-4o-mini'
  }
};

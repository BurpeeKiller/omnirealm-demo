interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class OpenAIService {
  private apiKey: string | null = null;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  
  setApiKey(key: string) {
    this.apiKey = key;
  }
  
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Clé API non configurée');
    }
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Tu es un coach fitness personnel bienveillant et motivant. 
                       Tu donnes des conseils personnalisés basés sur les données d'exercices de l'utilisateur.
                       Reste concis et pratique dans tes réponses.
                       Utilise des emojis pour rendre la conversation plus engageante.
                       Réponds toujours en français.`
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur API OpenAI');
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Clé API invalide. Vérifiez votre clé dans les réglages.');
        } else if (error.message.includes('429')) {
          throw new Error('Limite de requêtes atteinte. Réessayez dans quelques secondes.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        }
      }
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();
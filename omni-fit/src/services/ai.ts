import { logger } from '@/utils/logger';
import { publicConfig } from '@/lib/config';

// Types pour les réponses AI
export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  latency: number;
  cost?: number;
  tokens?: {
    prompt: number;
    completion: number;
  };
}

export interface AIOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// Configuration des providers
interface AIProvider {
  name: string;
  apiUrl: string;
  apiKey?: string;
  models: {
    fast: string;
    balanced: string;
    quality: string;
  };
}

// Providers disponibles
const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: {
    name: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: publicConfig.openaiApiKey,
    models: {
      fast: 'gpt-4o-mini',
      balanced: 'gpt-4o-mini',
      quality: 'gpt-4o'
    }
  },
  openrouter: {
    name: 'OpenRouter',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: publicConfig.anthropicApiKey, // Peut utiliser la même clé ou une différente
    models: {
      fast: 'mistralai/mistral-7b-instruct:free',
      balanced: 'meta-llama/llama-3.2-3b-instruct:free',
      quality: 'anthropic/claude-3.5-haiku'
    }
  },
  groq: {
    name: 'Groq',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: publicConfig.aiApiKey,
    models: {
      fast: 'llama-3.2-3b-preview',
      balanced: 'llama-3.2-7b-preview',
      quality: 'llama-3.2-70b-preview'
    }
  },
  ollama: {
    name: 'Ollama (Local)',
    apiUrl: publicConfig.aiApiUrl || 'http://localhost:11434/api/chat',
    models: {
      fast: 'llama3.2:3b',
      balanced: 'llama3.1:8b',
      quality: 'llama3.1:70b'
    }
  }
};

class AIService {
  private currentProvider: string = 'openrouter'; // Provider par défaut
  private fallbackProviders: string[] = ['groq', 'ollama'];

  /**
   * Appel générique à un provider AI
   */
  private async callProvider(
    provider: AIProvider,
    messages: Array<{ role: string; content: string }>,
    options: AIOptions = {}
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const model = options.maxTokens && options.maxTokens > 500 
      ? provider.models.quality 
      : provider.models.fast;

    try {
      // Configuration selon le provider
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (provider.apiKey) {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      }

      // OpenRouter nécessite des headers spéciaux
      if (provider.name === 'OpenRouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'OmniFit Coach';
      }

      // Format du body selon le provider
      let body: any;
      if (provider.name === 'Ollama (Local)') {
        // Format Ollama
        body = {
          model,
          messages,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            num_predict: options.maxTokens || 200,
          }
        };
      } else {
        // Format OpenAI-compatible (OpenAI, OpenRouter, Groq)
        body = {
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 200,
          stream: false
        };
      }

      const response = await fetch(provider.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${provider.name} error: ${error}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      // Parser la réponse selon le format
      let content: string;
      let tokens: any = {};

      if (provider.name === 'Ollama (Local)') {
        content = data.message?.content || data.response || '';
        tokens = {
          prompt: data.prompt_eval_count || 0,
          completion: data.eval_count || 0
        };
      } else {
        // Format OpenAI-compatible
        content = data.choices?.[0]?.message?.content || '';
        tokens = data.usage || {};
      }

      // Calculer le coût approximatif (en centimes)
      let cost = 0;
      if (tokens.prompt_tokens && tokens.completion_tokens) {
        // Prix approximatifs par million de tokens
        const pricing: Record<string, { input: number; output: number }> = {
          'gpt-4o-mini': { input: 0.15, output: 0.60 },
          'gpt-4o': { input: 2.50, output: 10.00 },
          'claude-3.5-haiku': { input: 1.00, output: 5.00 },
          // Les modèles gratuits
          'mistralai/mistral-7b-instruct:free': { input: 0, output: 0 },
          'meta-llama/llama-3.2-3b-instruct:free': { input: 0, output: 0 },
        };

        const modelPricing = pricing[model] || { input: 0, output: 0 };
        cost = (tokens.prompt_tokens * modelPricing.input + tokens.completion_tokens * modelPricing.output) / 1000000;
      }

      return {
        content,
        provider: provider.name,
        model,
        latency,
        cost,
        tokens: {
          prompt: tokens.prompt_tokens || tokens.prompt || 0,
          completion: tokens.completion_tokens || tokens.completion || 0
        }
      };

    } catch (error) {
      logger.error(`Erreur ${provider.name}:`, error);
      throw error;
    }
  }

  /**
   * Envoyer un message avec fallback automatique
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
    options: AIOptions = {}
  ): Promise<AIResponse> {
    // Essayer le provider principal
    const primaryProvider = AI_PROVIDERS[this.currentProvider];
    if (primaryProvider && (primaryProvider.apiKey || primaryProvider.name === 'Ollama (Local)')) {
      try {
        return await this.callProvider(primaryProvider, messages, options);
      } catch (error) {
        logger.warn(`Provider principal ${this.currentProvider} échoué, essai fallback...`);
      }
    }

    // Essayer les fallbacks
    for (const fallbackName of this.fallbackProviders) {
      const fallbackProvider = AI_PROVIDERS[fallbackName];
      if (fallbackProvider && (fallbackProvider.apiKey || fallbackProvider.name === 'Ollama (Local)')) {
        try {
          const result = await this.callProvider(fallbackProvider, messages, options);
          // Si le fallback réussit, on le garde comme provider principal
          this.currentProvider = fallbackName;
          return result;
        } catch (error) {
          logger.warn(`Fallback ${fallbackName} échoué...`);
        }
      }
    }

    // Si tout échoue, utiliser les réponses mock
    return this.getMockResponse(messages, options);
  }

  /**
   * Réponses mock pour le développement
   */
  private async getMockResponse(
    messages: Array<{ role: string; content: string }>,
    options: AIOptions = {}
  ): Promise<AIResponse> {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const startTime = Date.now();

    // Simuler délai réseau
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const mockResponses = {
      workout: [
        "🏋️ **Programme Express 20min**\n\n1. **Échauffement** (3 min)\n   - Jumping jacks: 30s\n   - Rotation bras: 30s\n   - Montées genoux: 30s\n   - Squats légers: 30s\n\n2. **Circuit Principal** (15 min)\n   - Burpees: 3×8 (repos 45s)\n   - Pompes: 3×12 (repos 45s)\n   - Squats: 3×15 (repos 45s)\n   - Planche: 3×30s (repos 30s)\n\n3. **Récupération** (2 min)\n   - Étirements légers\n   - Respiration profonde\n\n💡 **Conseil**: Adapte le nombre de répétitions selon ton niveau!",
        
        "💪 **Circuit HIIT Intense**\n\n**4 rounds de:**\n- 20 Jumping Jacks\n- 15 Mountain Climbers\n- 10 Burpees\n- 5 Pompes diamant\n\n⏱️ **Timing**: 30s d'effort / 15s repos\n\n🔥 **Finisher**: 1 min de planche\n\n**Total**: ~18 minutes\n\nHydrate-toi bien et écoute ton corps!"
      ],
      technique: [
        "🎯 **Technique Pompes Parfaites**\n\n✅ **Position de départ**:\n- Mains largeur épaules\n- Corps aligné (tête-talons)\n- Abdos engagés\n\n✅ **Exécution**:\n- Descente contrôlée (2-3s)\n- Coudes à 45° du corps\n- Poitrine frôle le sol\n- Poussée explosive\n\n❌ **Erreurs courantes**:\n- Dos cambré\n- Tête qui tombe\n- Coudes trop écartés\n\n💡 **Progression**: Commence sur les genoux si besoin!",
        
        "🦵 **Squats: La Base**\n\n**Setup**:\n- Pieds largeur hanches\n- Pointes légèrement vers l'extérieur\n- Poids sur les talons\n\n**Mouvement**:\n1. Inspire en descendant\n2. Hanches en arrière (comme s'asseoir)\n3. Genoux dans l'axe des pieds\n4. Descendre jusqu'à cuisses parallèles\n5. Expire en remontant\n\n**Points clés**:\n- Dos droit\n- Regard devant\n- Genoux stables\n\n🎯 Objectif: Maîtrise > Vitesse"
      ],
      motivation: [
        "🔥 **Tu es plus fort que tes excuses!**\n\nChaque rep compte. Chaque série te rapproche de tes objectifs. La douleur d'aujourd'hui est la force de demain.\n\n💪 **Rappel**: Tu n'es pas obligé d'être parfait, juste constant!\n\nAllez, montre-moi ce que tu as dans le ventre! 🚀",
        
        "⚡ **Mode Guerrier Activé!**\n\nTon seul adversaire, c'est toi d'hier. Bats ton propre record!\n\n✨ **3 vérités**:\n1. Le début est toujours le plus dur\n2. La progression vient avec la constance\n3. Tu es capable de plus que tu ne le penses\n\nC'est parti champion! 🏆"
      ],
      nutrition: [
        "🥗 **Nutrition Post-Entraînement**\n\n**Dans les 30 min**:\n- Banane + poignée d'amandes\n- Ou: Shake protéiné + fruits\n\n**Repas (1-2h après)**:\n- Protéines: poulet, poisson, œufs\n- Glucides: riz, patates douces\n- Légumes: à volonté!\n\n💧 **Hydratation**: 500ml minimum\n\n⚡ **Règle d'or**: Manger selon ta faim, pas par obligation!",
        
        "🍎 **Snacks Fitness Malins**\n\n**Pré-entrainement** (1h avant):\n- Pomme + beurre de cacahuète\n- Toast complet + miel\n- Dattes + noix\n\n**Post-entrainement**:\n- Yaourt grec + fruits rouges\n- Œufs durs + pain complet\n- Smoothie banane-protéine\n\n🚫 **À éviter**: Sucres raffinés, aliments gras juste avant l'effort\n\n💡 Écoute ton corps!"
      ]
    };

    // Détection du type de question
    const lowerMessage = lastMessage.toLowerCase();
    let category = 'motivation';
    
    if (lowerMessage.includes('programme') || lowerMessage.includes('exercice') || lowerMessage.includes('entraînement')) {
      category = 'workout';
    } else if (lowerMessage.includes('technique') || lowerMessage.includes('comment') || lowerMessage.includes('forme')) {
      category = 'technique';
    } else if (lowerMessage.includes('manger') || lowerMessage.includes('nutrition') || lowerMessage.includes('repas')) {
      category = 'nutrition';
    }

    const responses = mockResponses[category as keyof typeof mockResponses];
    const response = responses[Math.floor(Math.random() * responses.length)];

    return {
      content: response,
      provider: 'Mock AI (Dev)',
      model: 'fitness-coach-v1',
      latency: Date.now() - startTime,
      cost: 0,
      tokens: {
        prompt: lastMessage.length,
        completion: response.length
      }
    };
  }

  /**
   * Méthodes spécialisées fitness
   */
  async generateWorkoutPlan(profile: {
    level: string;
    goal: string;
    duration: string;
    equipment?: string;
  }): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un coach fitness expert. Crée des programmes d\'entraînement personnalisés, pratiques et motivants. Utilise des emojis pour rendre le contenu plus engageant.'
      },
      {
        role: 'user',
        content: `Crée un programme d'entraînement pour:
- Niveau: ${profile.level}
- Objectif: ${profile.goal}
- Durée: ${profile.duration}
- Équipement: ${profile.equipment || 'aucun'}

Format le programme de manière claire avec échauffement, exercices principaux et récupération.`
      }
    ];

    return this.chat(messages, { maxTokens: 400, temperature: 0.7 });
  }

  async getExerciseTechnique(exercise: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un coach fitness expert en biomécanique. Explique les techniques d\'exercices de manière claire et précise.'
      },
      {
        role: 'user',
        content: `Explique la technique correcte pour: ${exercise}. Inclus position de départ, exécution, erreurs communes et conseils de progression.`
      }
    ];

    return this.chat(messages, { maxTokens: 300, temperature: 0.6 });
  }

  async getMotivationalMessage(context: {
    timeOfDay: string;
    lastWorkout?: string;
    currentStreak?: number;
  }): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un coach motivationnel dynamique. Crée des messages courts, percutants et encourageants.'
      },
      {
        role: 'user',
        content: `Message motivationnel pour ${context.timeOfDay}. ${context.currentStreak ? `Série actuelle: ${context.currentStreak} jours.` : ''} Court et énergique!`
      }
    ];

    return this.chat(messages, { maxTokens: 100, temperature: 0.8 });
  }

  async getNutritionAdvice(question: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un nutritionniste sportif. Donne des conseils pratiques et équilibrés pour optimiser les performances fitness.'
      },
      {
        role: 'user',
        content: question
      }
    ];

    return this.chat(messages, { maxTokens: 250, temperature: 0.7 });
  }

  /**
   * Changer de provider
   */
  setProvider(provider: string) {
    if (AI_PROVIDERS[provider]) {
      this.currentProvider = provider;
      logger.info(`Provider AI changé: ${provider}`);
    }
  }

  /**
   * Obtenir les providers disponibles
   */
  getAvailableProviders(): string[] {
    return Object.entries(AI_PROVIDERS)
      .filter(([_, provider]) => provider.apiKey || provider.name === 'Ollama (Local)')
      .map(([name]) => name);
  }
}

// Export singleton
export const aiService = new AIService();
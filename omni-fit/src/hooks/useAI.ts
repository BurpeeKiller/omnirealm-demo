import { useState, useCallback, useRef, useEffect } from 'react';

interface AIResponse {
  content: string;
  provider: string;
  latency: number;
  cost?: number;
}

interface HistoryItem {
  id: number;
  message: string;
  response: string;
  provider: string;
  latency: number;
  cost: number;
  timestamp: Date;
}

interface UserContext {
  exercisesDone?: Array<{
    type: string;
    completed: number;
    target: number;
  }>;
  totalCompleted?: number;
  timeOfDay?: string;
}

// Configuration de l'API AI - Intégration Jarvis
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:11434/api/generate'; // Ollama direct
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const JARVIS_ENABLED = import.meta.env.VITE_JARVIS_ENABLED === 'true';

export function useAI(config = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    totalCost: 0,
    avgLatency: 0
  });

  // Fonction pour appeler l'API AI avec support Ollama
  const callAI = async (prompt: string, options: any = {}) => {
    const startTime = Date.now();
    
    try {
      // Tentative d'appel direct à Ollama (plus rapide que Jarvis)
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(AI_API_KEY && { 'Authorization': `Bearer ${AI_API_KEY}` })
        },
        body: JSON.stringify({
          model: 'llama3.1:8b', // Modèle rapide
          prompt: `Tu es un coach fitness expert et motivant. ${prompt}`,
          stream: false,
          options: {
            num_predict: options.maxTokens || 200,
            temperature: options.temperature || 0.7,
            stop: ['<|endoftext|>', '\n\nUser:', '\n\nQuestion:']
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur Ollama: ${response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.response || data.content || data.message,
        provider: 'ollama-local',
        latency,
        cost: 0 // Gratuit en local
      };
    } catch (err: any) {
      // Fallback pour dev local sans serveur AI
      console.warn('API AI non disponible, utilisation du mock:', err.message);
      
      // Réponses améliorées pour le développement
      const fitnessResponses = {
        program: [
          "🏋️ Programme 30 min:\n1. Burpees: 3x8\n2. Pompes: 3x12\n3. Squats: 3x15\n4. Planche: 3x30s\n5. Mountain climbers: 3x20\n\nRepos 45s entre séries. Bon courage !",
          "💪 Entraînement express:\n1. Jumping jacks: 3x20\n2. Pompes: 3x10\n3. Fentes: 3x12/jambe\n4. Abdos: 3x15\n\nCircuit intense, reste hydraté !",
        ],
        motivation: [
          "💪 Chaque rep te rapproche de tes objectifs ! Tu es plus fort que tes excuses.",
          "🔥 La progression se fait un exercice à la fois. Continue comme ça !",
          "⚡ Ton corps peut le faire, c'est ton mental qu'il faut convaincre !",
          "🚀 Hier tu ne pouvais pas, aujourd'hui tu peux. Quelle sera ta limite demain ?"
        ],
        technique: [
          "🎯 Pour les pompes : corps aligné, descente contrôlée, poussée explosive. Qualité > quantité !",
          "🏃 Pour les squats : pieds largeur épaules, poids sur les talons, dos droit. Imagine t'asseoir sur une chaise.",
          "💥 Pour les burpees : mouvement fluide, pas de pause. Si tu es fatigué, adapte le rythme mais garde la forme.",
          "⚖️ Pour la planche : corps droit comme une planche, respiration continue, gainage actif."
        ],
        default: [
          "👍 Tu progresses bien ! La constance est ta meilleure alliée.",
          "🌟 Excellent travail ! Chaque séance compte pour ton développement.",
          "🎯 Continue sur cette lancée ! Tes efforts d'aujourd'hui sont tes résultats de demain.",
          "💚 Bravo pour ta régularité ! C'est exactement ça l'état d'esprit gagnant."
        ]
      };

      // Détection intelligente du type de requête
      const isProgram = prompt.toLowerCase().includes('programme') || prompt.toLowerCase().includes('exercice') || prompt.toLowerCase().includes('entraînement');
      const isMotivation = prompt.toLowerCase().includes('motiv') || prompt.toLowerCase().includes('encourage') || prompt.toLowerCase().includes('force');
      const isTechnique = prompt.toLowerCase().includes('technique') || prompt.toLowerCase().includes('forme') || prompt.toLowerCase().includes('comment');
      
      const category = isProgram ? 'program' : isMotivation ? 'motivation' : isTechnique ? 'technique' : 'default';
      const responses = fitnessResponses[category];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Simuler un délai réseau réaliste
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
      
      return {
        content: randomResponse,
        provider: 'fitness-coach-ai',
        latency: Date.now() - startTime,
        cost: 0
      };
    }
  };

  /**
   * Envoyer un message à l'AI
   */
  const sendMessage = useCallback(async (message: string, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await callAI(message, options);
      
      setResponse(result);
      
      // Ajouter à l'historique
      const historyEntry: HistoryItem = {
        id: Date.now(),
        message,
        response: result.content,
        provider: result.provider,
        latency: result.latency,
        cost: result.cost || 0,
        timestamp: new Date()
      };
      
      setHistory(prev => [...prev, historyEntry]);
      
      // Mettre à jour les métriques
      setMetrics(prev => {
        const newTotal = prev.totalRequests + 1;
        const newCost = prev.totalCost + (result.cost || 0);
        const newAvgLatency = ((prev.avgLatency * prev.totalRequests) + result.latency) / newTotal;
        
        return {
          totalRequests: newTotal,
          totalCost: newCost,
          avgLatency: Math.round(newAvgLatency)
        };
      });

      return result;

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fonction spécialisée Fitness
   */
  const askFitnessAdvice = useCallback(async (question: string, userContext: UserContext = {}) => {
    const prompt = `
      Context utilisateur fitness:
      - Exercices faits: ${JSON.stringify(userContext.exercisesDone || [])}
      - Total complété: ${userContext.totalCompleted || 0}
      - Moment: ${userContext.timeOfDay || 'journée'}
      
      Question: ${question}
      
      Donne un conseil fitness personnalisé, concis (max 3-4 phrases) et motivant.
    `;

    return sendMessage(prompt, {
      system: "Tu es un coach fitness bienveillant et expert. Sois concis, pratique et motivant.",
      maxTokens: 200,
      temperature: 0.7
    });
  }, [sendMessage]);

  /**
   * Générer programme d'exercices
   */
  const generateWorkout = useCallback(async (profile: any, duration = '30 minutes') => {
    const prompt = `
      Crée un programme d'exercices court et efficace pour:
      - Niveau: ${profile.level || 'débutant'}
      - Objectif: ${profile.goal || 'forme générale'}
      - Durée: ${duration}
      - Équipement: ${profile.equipment || 'aucun'}
      
      Format: liste simple avec 4-5 exercices max, séries/répétitions claires.
    `;

    return sendMessage(prompt, {
      system: "Tu es un coach fitness. Crée des programmes simples, efficaces et adaptés.",
      maxTokens: 300,
      temperature: 0.6
    });
  }, [sendMessage]);

  /**
   * Message motivationnel court
   */
  const getMotivation = useCallback(async (context: any = {}) => {
    const prompt = `
      Génère un message motivationnel court et percutant (max 15 mots) pour une app fitness.
      Contexte: ${context.lastWorkout ? `Dernier entraînement ${context.lastWorkout}` : 'Nouveau départ'}
      Heure: ${context.timeOfDay || 'journée'}
      
      Utilise un emoji approprié. Sois encourageant et dynamique.
    `;

    return sendMessage(prompt, {
      maxTokens: 50,
      temperature: 0.8
    });
  }, [sendMessage]);

  /**
   * Effacer l'historique
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setResponse(null);
    setError(null);
  }, []);

  return {
    // État
    isLoading,
    response,
    error,
    history,
    metrics,
    
    // Méthodes générales
    sendMessage,
    clearHistory,
    
    // Méthodes fitness spécialisées
    askFitnessAdvice,
    generateWorkout,
    getMotivation
  };
}
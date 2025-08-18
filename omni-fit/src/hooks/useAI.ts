import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { aiService, type AIResponse } from '@/services/ai';

interface HistoryItem {
  id: number;
  message: string;
  response: string;
  provider: string;
  latency: number;
  cost: number;
  timestamp: Date;
}

export interface UserContext {
  exercisesDone?: Array<{
    name: string;
    count: number;
    completed: boolean;
    target: number;
  }>;
  totalCompleted?: number;
  timeOfDay?: string;
  level?: string;
  goal?: string;
}

export function useAI(options?: { primary?: string; fallback?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    totalCost: 0,
    avgLatency: 0
  });

  // Configurer le provider si spécifié
  useEffect(() => {
    if (options?.primary) {
      aiService.setProvider(options.primary);
    }
  }, [options?.primary]);

  /**
   * Envoyer un message à l'AI
   */
  const sendMessage = useCallback(async (message: string, options: any = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Créer les messages pour le chat
      const messages = [
        {
          role: 'system',
          content: options.system || 'Tu es un coach fitness expert et motivant. Réponds de manière concise et pratique.'
        },
        {
          role: 'user',
          content: message
        }
      ];

      const result = await aiService.chat(messages, {
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        stream: options.stream
      });
      
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
  const generateWorkout = useCallback(async (profile: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.generateWorkoutPlan({
        level: profile.level || 'débutant',
        goal: profile.goal || 'forme générale',
        duration: profile.duration || '30 minutes',
        equipment: profile.equipment || 'aucun'
      });

      setResponse(result);
      
      // Ajouter à l'historique
      const historyEntry: HistoryItem = {
        id: Date.now(),
        message: `Programme ${profile.level} - ${profile.duration}`,
        response: result.content,
        provider: result.provider,
        latency: result.latency,
        cost: result.cost || 0,
        timestamp: new Date()
      };
      
      setHistory(prev => [...prev, historyEntry]);
      return result;

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Message motivationnel court
   */
  const getMotivation = useCallback(async (context: any = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.getMotivationalMessage({
        timeOfDay: context.timeOfDay || 'journée',
        lastWorkout: context.lastWorkout,
        currentStreak: context.currentStreak
      });

      setResponse(result);
      
      // Ajouter à l'historique
      const historyEntry: HistoryItem = {
        id: Date.now(),
        message: 'Motivation',
        response: result.content,
        provider: result.provider,
        latency: result.latency,
        cost: result.cost || 0,
        timestamp: new Date()
      };
      
      setHistory(prev => [...prev, historyEntry]);
      return result;

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
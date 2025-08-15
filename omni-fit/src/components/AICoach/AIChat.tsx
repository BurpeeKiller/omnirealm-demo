import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useExercisesStore } from '@/stores/exercises.store';
import { logger } from '@/utils/logger';
import type { UserContext } from '@/hooks/useAI';

export function AIChat() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { exercises, completedCount } = useExercisesStore();
  
  const {
    isLoading,
    history,
    askFitnessAdvice,
    generateWorkout,
    getMotivation,
    error
  } = useAI({
    primary: 'openrouter',
    fallback: 'openai'
  });

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Suggestions contextuelles basées sur l'état de l'app
  const getSuggestions = () => {
    const suggestions = [];
    
    if (completedCount === 0) {
      suggestions.push("Comment bien commencer ma séance ?");
      suggestions.push("Quel échauffement recommandes-tu ?");
    } else if (completedCount >= 3) {
      suggestions.push("Conseils pour la récupération ?");
      suggestions.push("Comment améliorer ma progression ?");
    }
    
    // Suggestions basées sur les exercices actifs
    const activeExercises = exercises.filter(e => (e.completed ?? false) === true);
    if (activeExercises.length > 0) {
      const lastExercise = activeExercises[activeExercises.length - 1];
      suggestions.push(`Technique pour ${lastExercise.name} ?`);
    }
    
    return suggestions.slice(0, 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    // Contexte utilisateur pour personnaliser les réponses
    const userContext: UserContext = {
      exercisesDone: exercises.map(e => ({
        name: e.name,
        count: e.count,
        completed: e.completed || false,
        target: e.target || 0
      })),
      totalCompleted: completedCount,
      timeOfDay: new Date().getHours() < 12 ? 'matin' : 
                 new Date().getHours() < 18 ? 'après-midi' : 'soir',
      level: 'intermédiaire',
      goal: 'forme générale'
    };

    try {
      await askFitnessAdvice(message, userContext);
    } catch (err) {
      logger.error('Erreur chat:', err);
    }

    inputRef.current?.focus();
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'workout':
          await generateWorkout({
            level: 'intermédiaire',
            goal: 'forme générale',
            equipment: 'aucun',
            duration: '20 minutes'
          });
          break;
        case 'motivation':
          await getMotivation({
            lastWorkout: completedCount > 0 ? 'aujourd\'hui' : 'pas encore',
            timeOfDay: new Date().getHours() < 12 ? 'matin' : 'soir'
          });
          break;
      }
    } catch (err) {
      logger.error('Erreur action rapide:', err);
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              Salut ! Je suis ton coach AI. Comment puis-je t'aider aujourd'hui ?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleQuickAction('workout')}
                className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors text-sm"
              >
                📋 Programme du jour
              </button>
              <button
                onClick={() => handleQuickAction('motivation')}
                className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors text-sm"
              >
                💪 Motivation
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Message utilisateur */}
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-2 bg-primary-500 text-white rounded-2xl rounded-br-sm">
                  {item.message}
                </div>
              </div>

              {/* Réponse AI */}
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="px-4 py-2 bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm border border-gray-700">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {item.response}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 px-2">
                    {item.provider} • {item.latency}ms
                    {item.cost > 0 && ` • $${item.cost.toFixed(4)}`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Le coach réfléchit...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm"
          >
            ❌ {error}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-800">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm whitespace-nowrap hover:bg-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose ta question..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-primary-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
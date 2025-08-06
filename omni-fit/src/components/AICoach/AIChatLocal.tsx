import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Wifi, WifiOff, Info, Sparkles } from 'lucide-react';
import { AIDisclosure } from '@omnirealm/compliance';
import { aiCoachLocal } from '@/services/ai-coach-local';
import { useExercisesStore } from '@/stores/exercises.store';
import { useApiStore } from '@/stores/api.store';
import { openAIService } from '@/services/openai-service';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLocal?: boolean;
}

export function AIChatLocal() {
  const { openaiApiKey, isApiConfigured } = useApiStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isApiConfigured 
        ? "Bonjour ! Je suis votre Coach AI personnel. 🌟 Avec votre clé API configurée, je peux vous donner des conseils personnalisés. Comment puis-je vous aider aujourd'hui ?"
        : "Bonjour ! Je suis votre Coach AI. Je fonctionne actuellement en mode local, sans connexion internet. Posez-moi vos questions sur le fitness !",
      timestamp: new Date(),
      isLocal: !isApiConfigured
    }
  ]);
  const [input, setInput] = useState('');
  const [isOnlineMode, setIsOnlineMode] = useState(isApiConfigured);
  const [showOnlinePrompt, setShowOnlinePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { exercises, completedCount } = useExercisesStore();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync API key avec le service
  useEffect(() => {
    if (openaiApiKey) {
      openAIService.setApiKey(openaiApiKey);
    }
  }, [openaiApiKey]);

  // Sync online mode avec API config
  useEffect(() => {
    setIsOnlineMode(isApiConfigured);
  }, [isApiConfigured]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Vérifier si la question nécessite le mode cloud
    if (!isOnlineMode && !isApiConfigured && aiCoachLocal.needsCloudResponse(input)) {
      setShowOnlinePrompt(true);
      const promptMessage: Message = {
        id: Date.now().toString() + '-prompt',
        role: 'system',
        content: "Cette question nécessite une analyse plus approfondie. Ajoutez votre clé API OpenAI dans les réglages pour débloquer les réponses personnalisées.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, promptMessage]);
      return;
    }

    setIsLoading(true);
    
    try {
      let response: string;
      
      if (isOnlineMode && isApiConfigured) {
        // Mode API OpenAI
        try {
          // Préparer le contexte avec les données d'exercices
          const exerciseContext = `L'utilisateur a fait aujourd'hui : ${exercises.map(e => `${e.count} ${e.label}`).join(', ')}. Total : ${completedCount} exercices.`;
          
          const chatMessages = messages
            .filter(m => m.role !== 'system')
            .slice(-5) // Garder les 5 derniers messages pour le contexte
            .map(m => ({ role: m.role, content: m.content }));
          
          chatMessages.push({ role: 'system' as const, content: exerciseContext });
          chatMessages.push({ role: 'user' as const, content: input });
          
          response = await openAIService.sendMessage(chatMessages);
        } catch (apiError) {
          console.error('Erreur API:', apiError);
          response = "❌ " + (apiError instanceof Error ? apiError.message : "Erreur lors de la communication avec OpenAI");
          // Fallback au mode local en cas d'erreur
          if (apiError instanceof Error && apiError.message.includes('Clé API')) {
            setIsOnlineMode(false);
          }
        }
      } else {
        // Mode local
        response = aiCoachLocal.getLocalResponse(input);
      }

      const assistantMessage: Message = {
        id: Date.now().toString() + '-response',
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        isLocal: !isOnlineMode || !isApiConfigured
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur chat:', error);
    } finally {
      setIsLoading(false);
    }

    inputRef.current?.focus();
  };

  const toggleOnlineMode = () => {
    if (!isApiConfigured && !isOnlineMode) {
      // Si pas de clé API et qu'on veut activer le mode online
      const infoMessage: Message = {
        id: Date.now().toString() + '-info',
        role: 'system',
        content: "💡 Pour activer le mode en ligne, ajoutez d'abord votre clé API OpenAI dans les Réglages.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, infoMessage]);
      return;
    }
    
    setIsOnlineMode(!isOnlineMode);
    setShowOnlinePrompt(false);
    
    const modeMessage: Message = {
      id: Date.now().toString() + '-mode',
      role: 'system',
      content: isOnlineMode 
        ? "🔒 Mode local activé. Vos données restent sur votre appareil."
        : "🌐 Mode IA avancé activé. Réponses personnalisées avec votre clé API.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, modeMessage]);
  };

  const quickQuestions = [
    "Comment bien débuter ?",
    "Quelle est la bonne technique pour les pompes ?",
    "J'ai des courbatures, que faire ?",
    "Comment rester motivé ?"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header avec indicateur de mode */}
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnlineMode && isApiConfigured ? (
              <>
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400">Mode IA avancé</span>
                <AIDisclosure 
                  feature="ai-coach" 
                  variant="badge" 
                  showDetails={false}
                  className="ml-2"
                />
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Mode local</span>
              </>
            )}
          </div>
          {isApiConfigured && (
            <button
              onClick={toggleOnlineMode}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Changer de mode
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-fuchsia-500 text-white'
                    : message.role === 'system'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                    {message.isLocal ? (
                      <>
                        <Info className="w-3 h-3" />
                        <span>Réponse locale</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>IA avancée</span>
                      </>
                    )}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de prompt en ligne */}
      {showOnlinePrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800"
        >
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsOnlineMode(true);
                setShowOnlinePrompt(false);
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
            >
              Activer le mode en ligne
            </button>
            <button
              onClick={() => setShowOnlinePrompt(false)}
              className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium"
            >
              Continuer hors ligne
            </button>
          </div>
        </motion.div>
      )}

      {/* Questions rapides */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setInput(question)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-xs whitespace-nowrap"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-fuchsia-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          {isOnlineMode && isApiConfigured
            ? "Mode IA avancé : réponses personnalisées avec GPT-3.5"
            : "Mode local : réponses instantanées sans connexion"
          }
        </p>
      </form>
    </div>
  );
}
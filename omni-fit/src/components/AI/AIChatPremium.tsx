"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Crown,
  Camera,
  TrendingUp,
  MessageCircle,
  Zap,
  Heart,
  Target,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "exercise_suggestion" | "posture_analysis" | "motivation";
  metadata?: {
    exerciseId?: string;
    confidence?: number;
    personalizedFor?: string;
    contextual?: boolean;
  };
}

interface AIChatPremiumProps {
  userProfile?: {
    name: string;
    level: "beginner" | "intermediate" | "advanced";
    preferences: string[];
    currentStreak: number;
    todayExercises: number;
    isPremium: boolean;
    messagesLeft?: number;
  };
  onUpgrade?: () => void;
  onExerciseSelect?: (exerciseId: string) => void;
  className?: string;
}

export function AIChatPremium({
  userProfile = {
    name: "Utilisateur",
    level: "beginner",
    preferences: [],
    currentStreak: 0,
    todayExercises: 0,
    isPremium: false,
    messagesLeft: 3,
  },
  onUpgrade,
  onExerciseSelect,
  className = "",
}: AIChatPremiumProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Premium features state
  const [contextualInsights, setContextualInsights] = useState<string[]>([]);
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with contextual welcome message
  useEffect(() => {
    const welcomeMessage = generateWelcomeMessage();
    setMessages([welcomeMessage]);

    if (userProfile.isPremium) {
      generateContextualInsights();
      generatePersonalizedSuggestions();
    }
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateWelcomeMessage = (): Message => {
    const hour = new Date().getHours();
    let greeting = "Bonjour";
    if (hour >= 12 && hour < 17) greeting = "Bon après-midi";
    if (hour >= 17) greeting = "Bonsoir";

    let personalizedContent = `${greeting} ${userProfile.name} ! `;

    if (userProfile.isPremium) {
      if (userProfile.currentStreak > 0) {
        personalizedContent += `Félicitations pour votre série de ${userProfile.currentStreak} jour${userProfile.currentStreak > 1 ? "s" : ""} ! 🔥 `;
      }

      if (userProfile.todayExercises > 0) {
        personalizedContent += `J'ai vu que vous avez déjà fait ${userProfile.todayExercises} exercice${userProfile.todayExercises > 1 ? "s" : ""} aujourd'hui. Comment vous sentez-vous ? `;
      } else {
        personalizedContent += `Prêt(e) pour votre séance du jour ? Je peux vous suggérer des exercices parfaits pour ce moment. `;
      }

      personalizedContent += `\n\nEn tant que membre Premium, je peux vous accompagner avec des conseils personnalisés, analyser votre posture, et adapter mes recommandations à votre progression. Comment puis-je vous aider aujourd'hui ?`;
    } else {
      personalizedContent += `Je suis votre coach IA ! Je peux vous donner quelques conseils de base pour commencer.\n\n⚠️ Version gratuite : ${userProfile.messagesLeft} message${userProfile.messagesLeft! > 1 ? "s" : ""} restant${userProfile.messagesLeft! > 1 ? "s" : ""} aujourd'hui.`;
    }

    return {
      id: "welcome",
      role: "assistant",
      content: personalizedContent,
      timestamp: new Date(),
      type: userProfile.isPremium ? "motivation" : "text",
    };
  };

  const generateContextualInsights = () => {
    const insights = [
      `Votre niveau ${userProfile.level} progresse bien !`,
      `${userProfile.todayExercises} exercices aujourd'hui, excellent rythme.`,
      `Série de ${userProfile.currentStreak} jours, vous êtes régulier !`,
    ];
    setContextualInsights(insights.filter(Boolean));
  };

  const generatePersonalizedSuggestions = () => {
    const time = new Date().getHours();
    let suggestions = [];

    if (time >= 9 && time <= 11) {
      suggestions.push("Réveillez vos muscles avec des étirements matinaux");
      suggestions.push("Parfait moment pour activer votre métabolisme");
    } else if (time >= 14 && time <= 16) {
      suggestions.push("Combattez le coup de fatigue de l'après-midi");
      suggestions.push("Réactivez votre circulation avec du cardio léger");
    } else if (time >= 17 && time <= 19) {
      suggestions.push("Décompressez après votre journée");
      suggestions.push("Libérez les tensions avec des étirements");
    }

    setPersonalizedSuggestions(suggestions);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const responses = {
      premium: [
        `Excellente question ! Basé sur votre profil ${userProfile.level} et vos ${userProfile.todayExercises} exercices d'aujourd'hui, voici ce que je recommande...`,
        `Je vois que vous avez une série de ${userProfile.currentStreak} jours ! Pour maintenir cette motivation, essayons...`,
        `Parfait timing ! Compte tenu de l'heure (${new Date().getHours()}h), votre corps est prêt pour...`,
        `En analysant votre progression, je pense que vous êtes prêt(e) pour passer au niveau suivant avec...`,
      ],
      free: [
        `Conseil de base : commencez toujours par vous échauffer !`,
        `Pensez à respirer correctement pendant vos exercices.`,
        `La régularité est plus importante que l'intensité au début.`,
        `⚠️ Plus que ${userProfile.messagesLeft! - messagesUsed - 1} message(s) gratuit(s) aujourd'hui.`,
      ],
    };

    const responsePool = userProfile.isPremium ? responses.premium : responses.free;
    const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];

    return {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: randomResponse,
      timestamp: new Date(),
      type: userProfile.isPremium ? "exercise_suggestion" : "text",
      metadata: {
        personalizedFor: userProfile.name,
        contextual: userProfile.isPremium,
        confidence: userProfile.isPremium ? 0.95 : 0.6,
      },
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Check limits for free users
    if (!userProfile.isPremium && messagesUsed >= userProfile.messagesLeft!) {
      if (onUpgrade) onUpgrade();
      return;
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setMessagesUsed(prev => prev + 1);

    // Simulate AI thinking
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(inputValue);
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1500 + Math.random() * 1000
    );
  };

  const QuickAction = ({ icon: Icon, text, onClick }: any) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#E6FFF9] to-[#E6F7FF] rounded-lg text-sm font-medium text-[#00B89F] hover:from-[#D1FFF0] hover:to-[#D1F5FF] transition-all"
    >
      <Icon className="w-4 h-4" />
      {text}
    </motion.button>
  );

  return (
    <Card className={`flex flex-col h-full max-h-[600px] bg-white border-0 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 bg-gradient-to-r from-[#00D9B1] to-[#00B89F]">
              <Bot className="w-6 h-6 text-white" />
            </Avatar>
            {userProfile.isPremium && (
              <div className="absolute -top-1 -right-1">
                <Crown className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Coach IA
              {userProfile.isPremium ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Gratuit
                </Badge>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {userProfile.isPremium
                ? "Coach personnalisé illimité"
                : `${userProfile.messagesLeft! - messagesUsed} messages restants`}
            </p>
          </div>
        </div>

        {userProfile.isPremium && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
              <Camera className="w-4 h-4 mr-1" />
              Analyse posture
            </Button>
          </div>
        )}
      </div>

      {/* Premium Insights */}
      {userProfile.isPremium && contextualInsights.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Insights personnalisés</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {contextualInsights.map((insight, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-white/50">
                {insight}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                className={`w-8 h-8 ${
                  message.role === "user"
                    ? "bg-gray-100"
                    : "bg-gradient-to-r from-[#00D9B1] to-[#00B89F]"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-gray-600" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </Avatar>

              <div
                className={`max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white"
                      : message.type === "motivation"
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                        : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-sm whitespace-pre-wrap ${
                      message.role === "user" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {message.content}
                  </p>

                  {message.metadata?.confidence && userProfile.isPremium && (
                    <div className="flex items-center gap-1 mt-2">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="text-xs text-purple-600">
                        Confiance IA: {Math.round(message.metadata.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <Avatar className="w-8 h-8 bg-gradient-to-r from-[#00D9B1] to-[#00B89F]">
              <Bot className="w-5 h-5 text-white" />
            </Avatar>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-[#00D9B1] rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (Premium only) */}
      {userProfile.isPremium && personalizedSuggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Suggestions personnalisées</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {personalizedSuggestions.map((suggestion, idx) => (
              <QuickAction
                key={idx}
                icon={idx % 2 === 0 ? Target : Heart}
                text={suggestion}
                onClick={() => setInputValue(suggestion)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        {!userProfile.isPremium && messagesUsed >= userProfile.messagesLeft! ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-3"
          >
            <p className="text-sm text-gray-600">Limite quotidienne atteinte !</p>
            <Button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Débloquer le coach illimité
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSend()}
              placeholder={
                userProfile.isPremium
                  ? "Demandez-moi n'importe quoi sur le fitness..."
                  : `${userProfile.messagesLeft! - messagesUsed} messages restants...`
              }
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white"
            >
              {isTyping ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Clock className="w-4 h-4" />
                </motion.div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

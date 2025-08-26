"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Mail, Lock } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        console.log("🔐 Tentative de connexion NextAuth...");

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        console.log("📊 Résultat NextAuth:", result);

        if (result?.error) {
          setError("Email ou mot de passe incorrect");
        } else if (result?.ok) {
          console.log("✅ Connexion réussie !");
          onSuccess?.();
          onClose();
        }
      } else {
        // Mode inscription
        console.log("📝 Tentative d'inscription...");

        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          console.log("✅ Inscription réussie !");
          // Connexion automatique après inscription
          const loginResult = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (loginResult?.ok) {
            onSuccess?.();
            onClose();
          }
        } else {
          const data = await response.json();
          setError(data.error || "Erreur lors de l'inscription");
        }
      }
    } catch (err: any) {
      console.error("💥 Erreur auth:", err);
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#00D9B1] to-[#00B89F] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9B1] to-[#00B89F]">
              OmniFit
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-[#2D3436] mb-2">
            {mode === "login" ? "Connexion" : "Inscription"}
          </h2>
          <p className="text-gray-600">
            {mode === "login"
              ? "Reprends ton entraînement où tu l'as laissé"
              : "Commence ton parcours fitness dès aujourd'hui"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2D3436]">Nom complet</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors bg-gray-50 focus:bg-white text-[#2D3436] placeholder:text-gray-400"
                  placeholder="Jean Dupont"
                  required={mode === "register"}
                />
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors bg-gray-50 focus:bg-white text-[#2D3436] placeholder:text-gray-400"
                placeholder="votre@email.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Mot de passe</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00D9B1] focus:border-[#00D9B1] outline-none transition-colors bg-gray-50 focus:bg-white text-[#2D3436] placeholder:text-gray-400"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00D9B1] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                S'inscrire
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#00D9B1] hover:text-[#00B89F] font-medium underline transition-colors"
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-200 hover:border-[#00D9B1] hover:text-[#00D9B1] py-3 rounded-xl transition-colors"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}

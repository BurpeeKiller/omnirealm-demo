import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiStore {
  openaiApiKey: string | null;
  isApiConfigured: boolean;
  setApiKey: (key: string) => void;
  removeApiKey: () => void;
  validateApiKey: (key: string) => boolean;
}

// Simple encryption/decryption pour stocker la clé
const encrypt = (text: string): string => {
  // En production, utiliser une vraie méthode de chiffrement
  return btoa(text);
};

const decrypt = (text: string): string => {
  try {
    return atob(text);
  } catch {
    return '';
  }
};

export const useApiStore = create<ApiStore>()(
  persist(
    (set) => ({
      openaiApiKey: null,
      isApiConfigured: false,

      setApiKey: (key: string) => {
        const encryptedKey = encrypt(key);
        set({ 
          openaiApiKey: encryptedKey, 
          isApiConfigured: true 
        });
      },

      removeApiKey: () => {
        set({ 
          openaiApiKey: null, 
          isApiConfigured: false 
        });
      },

      validateApiKey: (key: string) => {
        // Validation basique du format de clé OpenAI
        return key.startsWith('sk-') && key.length > 20;
      }
    }),
    {
      name: 'fitness-api-config',
      // Custom storage pour décrypter à la lecture
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const state = JSON.parse(str);
          if (state.state.openaiApiKey) {
            state.state.openaiApiKey = decrypt(state.state.openaiApiKey);
          }
          return state;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  scans_used: number
  scans_limit: number
  is_pro: boolean
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
  updateUsage: (used: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      setAuth: (token, user) => set({
        token,
        user,
        isAuthenticated: true
      }),
      
      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false
      }),
      
      updateUsage: (used) => set((state) => ({
        user: state.user ? { ...state.user, scans_used: used } : null
      }))
    }),
    {
      name: 'omniscan-auth'
    }
  )
)
import { User } from '@prisma/client'
import { create } from 'zustand'

interface UserStore {
  user?: User
  setUser: (user?: User) => void
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
  isLoading: boolean
  setIsLoading: (v: boolean) => void
}

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined,
  isAuthenticated: false,
  setUser: (user?: User) => set({ user }),
  setIsAuthenticated: (v: boolean) => set({ isAuthenticated: v }),
  isLoading: true,
  setIsLoading: (v: boolean) => set({ isLoading: v })
}))

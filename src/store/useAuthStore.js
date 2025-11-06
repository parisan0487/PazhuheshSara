'use client';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    isAuthenticated: false,
    role: null,

    setAuth: (auth, role = null) => set({ isAuthenticated: auth, role }),
    logout: () => set({ isAuthenticated: false, role: null }),
}));

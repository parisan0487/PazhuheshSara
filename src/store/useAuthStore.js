'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            role: null,

            setAuth: (auth, role = null) => set({ isAuthenticated: auth, role }),
            logout: () => set({ isAuthenticated: false, role: null }),
        }),
        {
            name: 'auth-storage', // اسم در localStorage
        }
    )
);

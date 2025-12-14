import { create } from 'zustand';
import type { CV } from '../types';

interface CVStore {
    currentCV: CV | null;
    cvList: CV[];
    setCurrentCV: (cv: CV | null) => void;
    addCV: (cv: CV) => void;
    updateCV: (id: string, cv: Partial<CV>) => void;
    deleteCV: (id: string) => void;
}

export const useCVStore = create<CVStore>((set) => ({
    currentCV: null,
    cvList: [],

    setCurrentCV: (cv) => set({ currentCV: cv }),

    addCV: (cv) => set((state) => ({
        cvList: [...state.cvList, cv],
        currentCV: cv
    })),

    updateCV: (id, updates) => set((state) => ({
        cvList: state.cvList.map((cv) =>
            cv.id === id ? { ...cv, ...updates, updatedAt: new Date() } : cv
        ),
        currentCV: state.currentCV?.id === id
            ? { ...state.currentCV, ...updates, updatedAt: new Date() }
            : state.currentCV
    })),

    deleteCV: (id) => set((state) => ({
        cvList: state.cvList.filter((cv) => cv.id !== id),
        currentCV: state.currentCV?.id === id ? null : state.currentCV
    })),
}));

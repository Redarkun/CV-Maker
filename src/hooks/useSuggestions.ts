import { useState, useEffect, useCallback } from 'react';
import type { FieldSuggestion, SuggestionsStore } from '../types';

const STORAGE_KEY = 'cv-maker-suggestions';
const STORAGE_VERSION = 1;

// Initialize empty store
const getEmptyStore = (): SuggestionsStore => ({
    suggestions: [],
    version: STORAGE_VERSION,
});

// Save to localStorage
const saveSuggestions = (store: SuggestionsStore): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
        console.error('Error saving suggestions:', error);
    }
};

// Load from localStorage
const loadSuggestions = (): SuggestionsStore => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Initialize with demo data for testing (header fields only)
            const demoStore: SuggestionsStore = {
                version: STORAGE_VERSION,
                suggestions: [
                    {
                        id: 'demo-1',
                        value: 'John Doe',
                        fieldType: 'fullName',
                        sectionType: 'header',
                        metadata: { useCount: 5, lastUsed: new Date() },
                        createdAt: new Date(),
                    },
                    {
                        id: 'demo-2',
                        value: 'Jane Smith',
                        fieldType: 'fullName',
                        sectionType: 'header',
                        metadata: { useCount: 2, lastUsed: new Date() },
                        createdAt: new Date(),
                    },
                    {
                        id: 'demo-3',
                        value: 'Senior Software Engineer',
                        fieldType: 'jobPosition',
                        sectionType: 'header',
                        metadata: { useCount: 3, lastUsed: new Date() },
                        createdAt: new Date(),
                    },
                    {
                        id: 'demo-4',
                        value: 'Frontend Developer',
                        fieldType: 'jobPosition',
                        sectionType: 'header',
                        metadata: { useCount: 2, lastUsed: new Date() },
                        createdAt: new Date(),
                    },
                    {
                        id: 'demo-5',
                        value: 'john@example.com',
                        fieldType: 'email',
                        sectionType: 'header',
                        metadata: { useCount: 3, lastUsed: new Date() },
                        createdAt: new Date(),
                    },
                    {
                        id: 'demo-6',
                        value: 'jane.smith@company.com',
                        fieldType: 'email',
                        sectionType: 'header',
                        metadata: { useCount: 1, lastUsed: new Date() },
                        createdAt: new Date(),
                    },
                ],
            };
            saveSuggestions(demoStore);
            return demoStore;
        }

        const parsed = JSON.parse(stored) as SuggestionsStore;

        // Version check for future migrations
        if (parsed.version !== STORAGE_VERSION) {
            console.warn('Suggestions version mismatch, resetting...');
            return getEmptyStore();
        }

        // Convert date strings back to Date objects
        parsed.suggestions = parsed.suggestions.map(s => ({
            ...s,
            createdAt: new Date(s.createdAt),
            metadata: s.metadata ? {
                ...s.metadata,
                lastUsed: s.metadata.lastUsed ? new Date(s.metadata.lastUsed) : undefined,
            } : undefined,
        }));

        return parsed;
    } catch (error) {
        console.error('Error loading suggestions:', error);
        return getEmptyStore();
    }
};

export const useSuggestions = () => {
    const [store, setStore] = useState<SuggestionsStore>(loadSuggestions);

    // Persist changes to localStorage
    useEffect(() => {
        saveSuggestions(store);
    }, [store]);

    // Add new suggestion (with deduplication)
    const addSuggestion = useCallback((
        value: string,
        fieldType: string,
        sectionType: FieldSuggestion['sectionType']
    ) => {
        if (!value.trim()) return;

        setStore(prev => {
            // Check if exact match exists
            const existing = prev.suggestions.find(
                s => s.value.toLowerCase() === value.toLowerCase() &&
                    s.fieldType === fieldType &&
                    s.sectionType === sectionType
            );

            if (existing) {
                // Update metadata instead of creating duplicate
                return {
                    ...prev,
                    suggestions: prev.suggestions.map(s =>
                        s.id === existing.id
                            ? {
                                ...s,
                                metadata: {
                                    lastUsed: new Date(),
                                    useCount: (s.metadata?.useCount || 0) + 1,
                                },
                            }
                            : s
                    ),
                };
            }

            // Create new suggestion
            const newSuggestion: FieldSuggestion = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                value: value.trim(),
                fieldType,
                sectionType,
                metadata: {
                    lastUsed: new Date(),
                    useCount: 1,
                },
                createdAt: new Date(),
            };

            return {
                ...prev,
                suggestions: [...prev.suggestions, newSuggestion],
            };
        });
    }, []);

    // Add multiple suggestions at once
    const addBulkSuggestions = useCallback((suggestions: Array<{
        value: string;
        fieldType: string;
        sectionType: FieldSuggestion['sectionType'];
    }>) => {
        suggestions.forEach(s => addSuggestion(s.value, s.fieldType, s.sectionType));
    }, [addSuggestion]);

    // Remove suggestion by ID
    const removeSuggestion = useCallback((id: string) => {
        setStore(prev => ({
            ...prev,
            suggestions: prev.suggestions.filter(s => s.id !== id),
        }));
    }, []);

    // Get suggestions for specific field
    const getSuggestionsForField = useCallback((
        fieldType: string,
        sectionType: FieldSuggestion['sectionType']
    ): FieldSuggestion[] => {
        return store.suggestions
            .filter(s => s.fieldType === fieldType && s.sectionType === sectionType)
            .sort((a, b) => {
                // Sort by use count (most used first), then by last used
                const aUseCount = a.metadata?.useCount || 0;
                const bUseCount = b.metadata?.useCount || 0;

                if (aUseCount !== bUseCount) {
                    return bUseCount - aUseCount;
                }

                const aLastUsed = a.metadata?.lastUsed || a.createdAt;
                const bLastUsed = b.metadata?.lastUsed || b.createdAt;
                return bLastUsed.getTime() - aLastUsed.getTime();
            });
    }, [store.suggestions]);

    // Clear all suggestions
    const clearAllSuggestions = useCallback(() => {
        setStore(getEmptyStore());
    }, []);

    // Get total count
    const getTotalCount = useCallback(() => {
        return store.suggestions.length;
    }, [store.suggestions.length]);

    return {
        suggestions: store.suggestions,
        addSuggestion,
        addBulkSuggestions,
        removeSuggestion,
        getSuggestionsForField,
        clearAllSuggestions,
        getTotalCount,
    };
};

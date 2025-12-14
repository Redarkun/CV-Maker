import { useState, useEffect, useCallback } from 'react';
import type { SavedTemplate, TemplatesStore, CV } from '../types';

const STORAGE_KEY = 'cv-maker-templates';
const STORAGE_VERSION = 1;

// Initialize empty store
const getEmptyStore = (): TemplatesStore => ({
    templates: [],
    activeTemplateId: null,
    version: STORAGE_VERSION,
});

// Save to localStorage
const saveTemplates = (store: TemplatesStore): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
        console.error('Error saving templates:', error);
    }
};

// Load from localStorage
const loadTemplates = (): TemplatesStore => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return getEmptyStore();

        const parsed = JSON.parse(stored) as TemplatesStore;

        // Version check
        if (parsed.version !== STORAGE_VERSION) {
            console.warn('Templates version mismatch, resetting...');
            return getEmptyStore();
        }

        // Convert date strings back to Date objects
        parsed.templates = parsed.templates.map(t => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            cv: {
                ...t.cv,
                createdAt: new Date(t.cv.createdAt),
                updatedAt: new Date(t.cv.updatedAt),
            },
        }));

        return parsed;
    } catch (error) {
        console.error('Error loading templates:', error);
        return getEmptyStore();
    }
};

export const useTemplates = () => {
    const [store, setStore] = useState<TemplatesStore>(loadTemplates);

    // Persist changes to localStorage
    useEffect(() => {
        saveTemplates(store);
    }, [store]);

    // Save/Create new template
    const saveTemplate = useCallback((name: string, cv: CV): SavedTemplate => {
        const newTemplate: SavedTemplate = {
            id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            cv: {
                ...cv,
                id: cv.id, // Preserve original CV id
                updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setStore(prev => ({
            ...prev,
            templates: [...prev.templates, newTemplate],
            activeTemplateId: newTemplate.id,
        }));

        return newTemplate;
    }, []);

    // Update existing template
    const updateTemplate = useCallback((templateId: string, cv: CV, newName?: string) => {
        setStore(prev => ({
            ...prev,
            templates: prev.templates.map(t =>
                t.id === templateId
                    ? {
                        ...t,
                        name: newName !== undefined ? newName.trim() : t.name,
                        cv: {
                            ...cv,
                            updatedAt: new Date(),
                        },
                        updatedAt: new Date(),
                    }
                    : t
            ),
        }));
    }, []);

    // Delete template
    const deleteTemplate = useCallback((templateId: string) => {
        setStore(prev => {
            const newTemplates = prev.templates.filter(t => t.id !== templateId);
            const newActiveId =
                prev.activeTemplateId === templateId
                    ? newTemplates.length > 0
                        ? newTemplates[0].id
                        : null
                    : prev.activeTemplateId;

            return {
                ...prev,
                templates: newTemplates,
                activeTemplateId: newActiveId,
            };
        });
    }, []);

    // Set active template
    const setActiveTemplate = useCallback((templateId: string | null) => {
        setStore(prev => ({
            ...prev,
            activeTemplateId: templateId,
        }));
    }, []);

    // Get template by ID
    const getTemplate = useCallback(
        (templateId: string): SavedTemplate | undefined => {
            return store.templates.find(t => t.id === templateId);
        },
        [store.templates]
    );

    // Get active template
    const getActiveTemplate = useCallback((): SavedTemplate | null => {
        if (!store.activeTemplateId) return null;
        return store.templates.find(t => t.id === store.activeTemplateId) || null;
    }, [store.activeTemplateId, store.templates]);

    // Rename template
    const renameTemplate = useCallback((templateId: string, newName: string) => {
        setStore(prev => ({
            ...prev,
            templates: prev.templates.map(t =>
                t.id === templateId
                    ? {
                        ...t,
                        name: newName.trim(),
                        updatedAt: new Date(),
                    }
                    : t
            ),
        }));
    }, []);

    // Clear all templates
    const clearAllTemplates = useCallback(() => {
        setStore(getEmptyStore());
    }, []);

    return {
        templates: store.templates,
        activeTemplateId: store.activeTemplateId,
        saveTemplate,
        updateTemplate,
        deleteTemplate,
        setActiveTemplate,
        getTemplate,
        getActiveTemplate,
        renameTemplate,
        clearAllTemplates,
    };
};

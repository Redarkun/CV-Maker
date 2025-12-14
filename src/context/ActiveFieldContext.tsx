import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { FieldSuggestion } from '../types';

interface ActiveFieldContextType {
    activeField: {
        fieldType: string;
        sectionType: FieldSuggestion['sectionType'];
        setValue: (value: string) => void;
    } | null;
    setActiveField: (field: ActiveFieldContextType['activeField']) => void;
}

const ActiveFieldContext = createContext<ActiveFieldContextType | undefined>(undefined);

export const ActiveFieldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeField, setActiveField] = useState<ActiveFieldContextType['activeField']>(null);

    return (
        <ActiveFieldContext.Provider value={{ activeField, setActiveField }}>
            {children}
        </ActiveFieldContext.Provider>
    );
};

export const useActiveField = () => {
    const context = useContext(ActiveFieldContext);
    if (!context) {
        throw new Error('useActiveField must be used within ActiveFieldProvider');
    }
    return context;
};

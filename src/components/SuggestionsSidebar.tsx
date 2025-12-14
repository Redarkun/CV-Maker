import React from 'react';
import type { FieldSuggestion } from '../types';

interface SuggestionsSidebarProps {
    suggestions: FieldSuggestion[];
    activeField: {
        fieldType: string;
        sectionType: FieldSuggestion['sectionType'];
    } | null;
    onPaste: (value: string) => void;
    onDelete: (id: string) => void;
}

export const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({
    suggestions,
    activeField,
    onPaste,
    onDelete,
}) => {
    // Filter suggestions based on active field
    const filteredSuggestions = activeField
        ? suggestions.filter(
            s => s.fieldType === activeField.fieldType && s.sectionType === activeField.sectionType
        )
        : [];

    return (
        <div className="sticky top-24 w-[250px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 text-sm">💡 Sugerencias</h3>
                {activeField ? (
                    <p className="text-xs text-gray-500 mt-1">
                        Campo activo: <span className="font-medium">{activeField.fieldType}</span>
                    </p>
                ) : (
                    <p className="text-xs text-gray-500 mt-1">
                        Haz click en un campo para ver sugerencias
                    </p>
                )}
            </div>

            {/* Suggestions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {!activeField ? (
                    <div className="text-center py-12 px-4">
                        <div className="text-gray-400 mb-2">
                            <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-500">
                            Selecciona un campo del editor para ver sugerencias guardadas
                        </p>
                    </div>
                ) : filteredSuggestions.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="text-gray-400 mb-2">
                            <svg
                                className="w-10 h-10 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-500">
                            No hay sugerencias para este campo
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Rellena el campo y guarda el CV para crear una
                        </p>
                    </div>
                ) : (
                    filteredSuggestions.map(suggestion => (
                        <SuggestionItem
                            key={suggestion.id}
                            suggestion={suggestion}
                            onPaste={() => onPaste(suggestion.value)}
                            onDelete={() => onDelete(suggestion.id)}
                        />
                    ))
                )}
            </div>

            {/* Footer Stats */}
            {suggestions.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                        {suggestions.length} sugerencia{suggestions.length !== 1 ? 's' : ''} guardada
                        {suggestions.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

interface SuggestionItemProps {
    suggestion: FieldSuggestion;
    onPaste: () => void;
    onDelete: () => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
    suggestion,
    onPaste,
    onDelete,
}) => {
    const useCount = suggestion.metadata?.useCount || 0;

    return (
        <div className="group bg-gray-50 hover:bg-gray-100 rounded-md p-2 transition-colors border border-gray-200">
            {/* Value */}
            <div className="text-sm text-gray-800 mb-2 font-medium line-clamp-2">
                {suggestion.value}
            </div>

            {/* Metadata */}
            {useCount > 0 && (
                <div className="text-xs text-gray-500 mb-2">
                    Usado {useCount} {useCount === 1 ? 'vez' : 'veces'}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-1">
                <button
                    onClick={onPaste}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    title="Pegar en campo activo"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    <span>Pegar</span>
                </button>
                <button
                    onClick={onDelete}
                    className="px-2 py-1.5 bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 text-xs rounded transition-colors"
                    title="Eliminar sugerencia"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

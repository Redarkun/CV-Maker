import React, { useState } from 'react';

export interface NewSuggestionData {
    value: string;
    fieldType: string;
    sectionType: 'header' | 'experience' | 'education' | 'skills' | 'summary';
}

interface SuggestionsConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedSuggestions: NewSuggestionData[]) => void;
    newSuggestions: NewSuggestionData[];
}

export const SuggestionsConfirmModal: React.FC<SuggestionsConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    newSuggestions,
}) => {
    const [selected, setSelected] = useState<Set<number>>(
        new Set(newSuggestions.map((_, i) => i)) // All selected by default
    );

    if (!isOpen || newSuggestions.length === 0) return null;

    const toggleSelection = (index: number) => {
        const newSelected = new Set(selected);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelected(newSelected);
    };

    const handleConfirm = () => {
        const selectedSuggestions = newSuggestions.filter((_, i) => selected.has(i));
        onConfirm(selectedSuggestions);
        setSelected(new Set());
    };

    const handleSkip = () => {
        onConfirm([]);
        setSelected(new Set());
    };

    const groupedBySection = newSuggestions.reduce((acc, suggestion, index) => {
        const section = suggestion.sectionType;
        if (!acc[section]) acc[section] = [];
        acc[section].push({ ...suggestion, originalIndex: index });
        return acc;
    }, {} as Record<string, Array<NewSuggestionData & { originalIndex: number }>>);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            ✨ New Data Detected
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Would you like to save these values for future use?
                        </p>
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto mb-6">
                    <div className="space-y-4">
                        {Object.entries(groupedBySection).map(([sectionType, items]) => (
                            <div key={sectionType} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-700 mb-3 capitalize">
                                    {sectionType}
                                </h3>
                                <div className="space-y-2">
                                    {items.map(({ value, fieldType, originalIndex }) => (
                                        <label
                                            key={originalIndex}
                                            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected.has(originalIndex)}
                                                onChange={() => toggleSelection(originalIndex)}
                                                className="mt-1 w-4 h-4 text-blue-600 rounded"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-800">
                                                    {value}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {fieldType}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                        {selected.size} of {newSuggestions.length} selected
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Skip All
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selected.size === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Save {selected.size > 0 ? `(${selected.size})` : ''}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

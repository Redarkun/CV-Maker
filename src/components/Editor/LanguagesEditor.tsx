import React from 'react';
import type { LanguagesSection, LanguageItem } from '../../types';

interface LanguagesEditorProps {
    data: LanguagesSection;
    onChange: (data: LanguagesSection) => void;
}

export const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ data, onChange }) => {
    const handleTitleChange = (title: string) => {
        onChange({ ...data, title });
    };

    const handleAddLanguage = () => {
        const newLanguage: LanguageItem = {
            id: Date.now().toString(),
            language: '',
            proficiency: 'intermediate',
        };
        onChange({ ...data, items: [...data.items, newLanguage] });
    };

    const handleRemoveLanguage = (id: string) => {
        onChange({
            ...data,
            items: data.items.filter((item) => item.id !== id),
        });
    };

    const handleLanguageChange = (id: string, field: keyof LanguageItem, value: string) => {
        onChange({
            ...data,
            items: data.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const proficiencyLevels: Array<{ value: LanguageItem['proficiency']; label: string }> = [
        { value: 'native', label: 'Native' },
        { value: 'fluent', label: 'Fluent' },
        { value: 'professional', label: 'Professional' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'basic', label: 'Basic' },
    ];

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Languages</h3>
                <button
                    onClick={handleAddLanguage}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Language
                </button>
            </div>

            {/* Section Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="LANGUAGES"
                />
            </div>

            {/* Languages List */}
            <div className="space-y-3">
                {data.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No languages added yet. Click "Add Language" to get started.
                    </div>
                ) : (
                    data.items.map((language) => (
                        <div
                            key={language.id}
                            className="border border-gray-200 rounded-md p-3 flex items-center gap-3"
                        >
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                {/* Language Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Language *
                                    </label>
                                    <input
                                        type="text"
                                        value={language.language}
                                        onChange={(e) =>
                                            handleLanguageChange(
                                                language.id,
                                                'language',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Spanish"
                                    />
                                </div>

                                {/* Proficiency Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Proficiency *
                                    </label>
                                    <select
                                        value={language.proficiency}
                                        onChange={(e) =>
                                            handleLanguageChange(
                                                language.id,
                                                'proficiency',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {proficiencyLevels.map((level) => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveLanguage(language.id)}
                                className="px-2 py-1 text-sm text-red-600 hover:text-red-800 self-end"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

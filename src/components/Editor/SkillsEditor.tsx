import React from 'react';
import type { SkillsSection, SkillCategory } from '../../types';
import { nanoid } from 'nanoid';

interface SkillsEditorProps {
    data: SkillsSection;
    onChange: (data: SkillsSection) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ data, onChange }) => {
    const handleTitleChange = (value: string) => {
        onChange({ ...data, title: value });
    };

    const handleAddCategory = () => {
        const newCategory: SkillCategory = {
            id: nanoid(),
            name: '',
            items: [''],
        };
        onChange({ ...data, categories: [...data.categories, newCategory] });
    };

    const handleRemoveCategory = (id: string) => {
        onChange({ ...data, categories: data.categories.filter(cat => cat.id !== id) });
    };

    const handleCategoryChange = (id: string, field: keyof SkillCategory, value: any) => {
        onChange({
            ...data,
            categories: data.categories.map(cat =>
                cat.id === id ? { ...cat, [field]: value } : cat
            ),
        });
    };

    const handleSkillsTextChange = (id: string, value: string) => {
        // Split by comma and trim, filter out empty strings
        const skills = value
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        handleCategoryChange(id, 'items', skills);
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                <button
                    onClick={handleAddCategory}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Category
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                </label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SKILLS"
                />
            </div>

            <div className="space-y-3">
                {data.categories.map((category, index) => (
                    <div key={category.id} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={category.name}
                                    onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Technical / Languages / Certifications"
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveCategory(category.id)}
                                className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ml-2 mt-6"
                            >
                                Remove
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skills (comma-separated) *
                            </label>
                            <textarea
                                value={category.items.join(', ')}
                                onChange={(e) => handleSkillsTextChange(category.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={2}
                                placeholder="JavaScript, React, TypeScript, Node.js, Python, SQL"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separate skills with commas
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {data.categories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No skill categories added yet. Click "Add Category" to get started.
                </div>
            )}
        </div>
    );
};

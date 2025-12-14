import React, { useState } from 'react';
import type { EducationSection, EducationItem } from '../../types';
import { nanoid } from 'nanoid';

interface EducationEditorProps {
    data: EducationSection;
    onChange: (data: EducationSection) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ data, onChange }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleTitleChange = (value: string) => {
        onChange({ ...data, title: value });
    };

    const handleAddItem = () => {
        const newItem: EducationItem = {
            id: nanoid(),
            degree: '',
            institution: '',
            year: new Date().getFullYear(),
            notes: '',
        };
        onChange({ ...data, items: [...data.items, newItem] });
        setExpandedId(newItem.id);
    };

    const handleRemoveItem = (id: string) => {
        onChange({ ...data, items: data.items.filter(item => item.id !== id) });
        if (expandedId === id) setExpandedId(null);
    };

    const handleItemChange = (id: string, field: keyof EducationItem, value: any) => {
        onChange({
            ...data,
            items: data.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                <button
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Education
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
                    placeholder="EDUCATION"
                />
            </div>

            <div className="space-y-3">
                {data.items.map((item, index) => {
                    const isExpanded = expandedId === item.id;

                    return (
                        <div key={item.id} className="border border-gray-200 rounded-md p-3">
                            <div className="flex justify-between items-start mb-2">
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                    className="text-left flex-1"
                                >
                                    <div className="font-medium text-gray-900">
                                        {item.degree || `Education ${index + 1}`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {item.institution || 'Institution'} • {item.year}
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ml-2"
                                >
                                    Remove
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Degree / Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={item.degree}
                                            onChange={(e) => handleItemChange(item.id, 'degree', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Bachelor of Science in Computer Science"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Institution *
                                        </label>
                                        <input
                                            type="text"
                                            value={item.institution}
                                            onChange={(e) => handleItemChange(item.id, 'institution', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="University of Madrid"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Graduation Year *
                                        </label>
                                        <input
                                            type="number"
                                            value={item.year}
                                            onChange={(e) => handleItemChange(item.id, 'year', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min={1950}
                                            max={2050}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes (GPA, Honors, etc.)
                                        </label>
                                        <textarea
                                            value={item.notes || ''}
                                            onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows={2}
                                            placeholder="Honors in Software Engineering • GPA: 3.8/4.0"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {data.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No education added yet. Click "Add Education" to get started.
                </div>
            )}
        </div>
    );
};

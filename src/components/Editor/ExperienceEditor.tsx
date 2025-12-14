import React, { useState } from 'react';
import type { ExperienceSection, ExperienceItem } from '../../types';
import { nanoid } from 'nanoid';

interface ExperienceEditorProps {
    data: ExperienceSection;
    onChange: (data: ExperienceSection) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ data, onChange }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleTitleChange = (value: string) => {
        onChange({ ...data, title: value });
    };

    const handleAddItem = () => {
        const newItem: ExperienceItem = {
            id: nanoid(),
            company: '',
            role: '',
            location: '',
            startDate: new Date(),
            endDate: null,
            bullets: [''],
        };
        onChange({ ...data, items: [...data.items, newItem] });
        setExpandedId(newItem.id);
    };

    const handleRemoveItem = (id: string) => {
        onChange({ ...data, items: data.items.filter(item => item.id !== id) });
        if (expandedId === id) setExpandedId(null);
    };

    const handleItemChange = (id: string, field: keyof ExperienceItem, value: any) => {
        onChange({
            ...data,
            items: data.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const handleBulletChange = (itemId: string, bulletIndex: number, value: string) => {
        const item = data.items.find(i => i.id === itemId);
        if (!item) return;

        const newBullets = [...item.bullets];
        newBullets[bulletIndex] = value;
        handleItemChange(itemId, 'bullets', newBullets);
    };

    const handleAddBullet = (itemId: string) => {
        const item = data.items.find(i => i.id === itemId);
        if (!item) return;

        handleItemChange(itemId, 'bullets', [...item.bullets, '']);
    };

    const handleRemoveBullet = (itemId: string, bulletIndex: number) => {
        const item = data.items.find(i => i.id === itemId);
        if (!item || item.bullets.length <= 1) return;

        const newBullets = item.bullets.filter((_, idx) => idx !== bulletIndex);
        handleItemChange(itemId, 'bullets', newBullets);
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Professional Experience</h3>
                <button
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Position
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
                    placeholder="PROFESSIONAL EXPERIENCE"
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
                                        {item.role || `Position ${index + 1}`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {item.company || 'Company Name'}
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
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Job Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={item.role}
                                                onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Senior Software Engineer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company *
                                            </label>
                                            <input
                                                type="text"
                                                value={item.company}
                                                onChange={(e) => handleItemChange(item.id, 'company', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={item.location || ''}
                                            onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Madrid, Spain"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date *
                                            </label>
                                            <input
                                                type="month"
                                                value={item.startDate.toISOString().slice(0, 7)}
                                                onChange={(e) => handleItemChange(item.id, 'startDate', new Date(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                End Date
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="month"
                                                    value={item.endDate ? item.endDate.toISOString().slice(0, 7) : ''}
                                                    onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value ? new Date(e.target.value) : null)}
                                                    disabled={!item.endDate}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                />
                                                <label className="flex items-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={!item.endDate}
                                                        onChange={(e) => handleItemChange(item.id, 'endDate', e.target.checked ? null : new Date())}
                                                        className="mr-1"
                                                    />
                                                    Present
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Year-only toggle */}
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            id={`year-only-${item.id}`}
                                            checked={item.dateFormat === 'year-only'}
                                            onChange={(e) => handleItemChange(item.id, 'dateFormat', e.target.checked ? 'year-only' : 'month-year')}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mr-2"
                                        />
                                        <label htmlFor={`year-only-${item.id}`} className="text-sm text-gray-700">
                                            Show year only (e.g., "2020 - 2023" instead of "Jan 2020 - Dec 2023")
                                        </label>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Achievements / Responsibilities *
                                            </label>
                                            <button
                                                onClick={() => handleAddBullet(item.id)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                + Add Bullet
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {item.bullets.map((bullet, bulletIdx) => (
                                                <div key={bulletIdx} className="flex gap-2">
                                                    <span className="text-gray-600 mt-2">•</span>
                                                    <textarea
                                                        value={bullet}
                                                        onChange={(e) => handleBulletChange(item.id, bulletIdx, e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                        rows={2}
                                                        placeholder="Led team of 10+ to deliver $2M project, achieving 25% efficiency improvement"
                                                    />
                                                    {item.bullets.length > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveBullet(item.id, bulletIdx)}
                                                            className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {data.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No experience added yet. Click "Add Position" to get started.
                </div>
            )}
        </div>
    );
};

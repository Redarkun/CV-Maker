import React from 'react';
import type { AwardsSection, AwardItem } from '../../types';

interface AwardsEditorProps {
    data: AwardsSection;
    onChange: (data: AwardsSection) => void;
}

export const AwardsEditor: React.FC<AwardsEditorProps> = ({ data, onChange }) => {
    const handleTitleChange = (title: string) => {
        onChange({ ...data, title });
    };

    const handleAddAward = () => {
        const newAward: AwardItem = {
            id: Date.now().toString(),
            title: '',
            issuer: '',
            date: '',
            description: '',
        };
        onChange({ ...data, items: [...data.items, newAward] });
    };

    const handleRemoveAward = (id: string) => {
        onChange({
            ...data,
            items: data.items.filter((item) => item.id !== id),
        });
    };

    const handleAwardChange = (id: string, field: keyof AwardItem, value: string) => {
        onChange({
            ...data,
            items: data.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Awards</h3>
                <button
                    onClick={handleAddAward}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Award
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
                    placeholder="AWARDS & HONORS"
                />
            </div>

            {/* Awards List */}
            <div className="space-y-4">
                {data.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No awards added yet. Click "Add Award" to get started.
                    </div>
                ) : (
                    data.items.map((award, index) => (
                        <div key={award.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Award {index + 1}</h4>
                                <button
                                    onClick={() => handleRemoveAward(award.id)}
                                    className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Award Title */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Award Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={award.title}
                                        onChange={(e) =>
                                            handleAwardChange(award.id, 'title', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Employee of the Year"
                                    />
                                </div>

                                {/* Issuer */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issuer *
                                    </label>
                                    <input
                                        type="text"
                                        value={award.issuer}
                                        onChange={(e) =>
                                            handleAwardChange(award.id, 'issuer', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Company Name"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="month"
                                        value={award.date}
                                        onChange={(e) =>
                                            handleAwardChange(award.id, 'date', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={award.description || ''}
                                        onChange={(e) =>
                                            handleAwardChange(award.id, 'description', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        rows={2}
                                        placeholder="Brief description (optional)..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

import React from 'react';
import type { SummarySection } from '../../types';

interface SummaryEditorProps {
    data: SummarySection;
    onChange: (data: SummarySection) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ data, onChange }) => {
    const maxLength = 300;
    const currentLength = data.content.length;

    const handleTitleChange = (value: string) => {
        onChange({ ...data, title: value });
    };

    const handleContentChange = (value: string) => {
        if (value.length <= maxLength) {
            onChange({ ...data, content: value });
        }
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Professional Summary</h3>
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
                    placeholder="PROFESSIONAL SUMMARY"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Summary Content *
                    </label>
                    <span className={`text-sm ${currentLength > 250 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {currentLength}/{maxLength}
                    </span>
                </div>
                <textarea
                    value={data.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="Experienced professional with X+ years in [industry/field]..."
                />
                <p className="text-xs text-gray-500 mt-1">
                    Keep it concise and impactful (2-3 sentences recommended)
                </p>
            </div>
        </div>
    );
};

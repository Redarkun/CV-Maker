import React, { useState, useRef, useEffect } from 'react';
import type { SavedTemplate } from '../types';

interface TemplateSelectorProps {
    templates: SavedTemplate[];
    activeTemplateId: string | null;
    onSelectTemplate: (templateId: string) => void;
    onNewTemplate: () => void;
    onDeleteTemplate: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    templates,
    activeTemplateId,
    onSelectTemplate,
    onNewTemplate,
    onDeleteTemplate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeTemplate = templates.find(t => t.id === activeTemplateId);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
                <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span className="font-medium text-gray-700">
                    {activeTemplate ? activeTemplate.name : 'Untitled CV'}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700">Templates</h3>
                    </div>

                    {/* Templates List */}
                    <div className="flex-1 overflow-y-auto">
                        {templates.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No templates saved yet
                            </div>
                        ) : (
                            templates.map(template => (
                                <div
                                    key={template.id}
                                    className={`group flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${template.id === activeTemplateId ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <button
                                        onClick={() => {
                                            onSelectTemplate(template.id);
                                            setIsOpen(false);
                                        }}
                                        className="flex-1 text-left"
                                    >
                                        <div className="font-medium text-sm text-gray-800">
                                            {template.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Updated {new Date(template.updatedAt).toLocaleDateString()}
                                        </div>
                                    </button>

                                    {template.id === activeTemplateId && (
                                        <svg
                                            className="w-5 h-5 text-blue-600 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Delete template "${template.name}"?`)) {
                                                onDeleteTemplate(template.id);
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                                        title="Delete template"
                                    >
                                        <svg
                                            className="w-4 h-4 text-red-600"
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
                            ))
                        )}
                    </div>

                    {/* Footer - New Template Button */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={() => {
                                onNewTemplate();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span>New Template</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

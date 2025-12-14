import React, { useState } from 'react';

interface SaveTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    existingNames: string[];
    defaultName?: string;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingNames,
    defaultName = '',
}) => {
    const [name, setName] = useState(defaultName);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        const trimmedName = name.trim();

        // Validation
        if (!trimmedName) {
            setError('Template name cannot be empty');
            return;
        }

        if (existingNames.includes(trimmedName)) {
            setError('A template with this name already exists');
            return;
        }

        if (trimmedName.length > 50) {
            setError('Template name is too long (max 50 characters)');
            return;
        }

        onSave(trimmedName);
        setName('');
        setError('');
    };

    const handleClose = () => {
        setName('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">💾 Save Template</h2>
                    <button
                        onClick={handleClose}
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

                {/* Body */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            } else if (e.key === 'Escape') {
                                handleClose();
                            }
                        }}
                        placeholder="e.g., CV Tech Lead 2024"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                            }`}
                        autoFocus
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                    <p className="mt-3 text-xs text-gray-500">
                        Give your CV template a memorable name. You can save multiple versions for
                        different job applications.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Save Template
                    </button>
                </div>
            </div>
        </div>
    );
};

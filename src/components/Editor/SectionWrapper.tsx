import React from 'react';
import type { Section } from '../../types';

interface SectionWrapperProps {
    children: React.ReactNode;
    dragHandleProps?: any;
    isDragging?: boolean;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
    children,
    dragHandleProps,
    isDragging = false
}) => {
    return (
        <div
            className={`relative ${isDragging ? 'opacity-50' : ''}`}
        >
            {dragHandleProps && (
                <div
                    {...dragHandleProps}
                    className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-l-lg"
                >
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                        />
                    </svg>
                </div>
            )}
            <div className={dragHandleProps ? 'ml-8' : ''}>
                {children}
            </div>
        </div>
    );
};

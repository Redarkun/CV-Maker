import React from 'react';

interface PageOverflowAlertProps {
    isOverflowing: boolean;
    onDismiss?: () => void;
}

export const PageOverflowAlert: React.FC<PageOverflowAlertProps> = ({ isOverflowing, onDismiss }) => {
    if (!isOverflowing) return null;

    return (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg flex items-center justify-between mb-4 shadow-sm">
            <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="font-medium">Content exceeds one page</p>
                    <p className="text-sm text-amber-700">Your CV may span multiple pages when exported to PDF. Consider reducing content or adjusting margins.</p>
                </div>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-amber-600 hover:text-amber-800 p-1"
                    aria-label="Dismiss"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

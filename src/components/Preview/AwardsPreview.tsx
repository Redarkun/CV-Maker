import React from 'react';
import type { AwardsSection } from '../../types';

interface AwardsPreviewProps {
    data: AwardsSection;
}

const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!month) return year;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const AwardsPreview: React.FC<AwardsPreviewProps> = ({ data }) => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-bold uppercase border-b-2 border-gray-800 pb-1 mb-3">
                {data.title}
            </h2>
            <div className="space-y-2">
                {data.items.map((award) => (
                    <div key={award.id}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold">{award.title}</h3>
                            <span className="text-sm text-gray-600">{formatDate(award.date)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{award.issuer}</p>
                        {award.description && (
                            <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

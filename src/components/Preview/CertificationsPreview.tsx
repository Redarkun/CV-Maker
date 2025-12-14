import React from 'react';
import type { CertificationsSection } from '../../types';

interface CertificationsPreviewProps {
    data: CertificationsSection;
}

const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!month) return year;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const CertificationsPreview: React.FC<CertificationsPreviewProps> = ({ data }) => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-bold uppercase border-b-2 border-gray-800 pb-1 mb-3">
                {data.title}
            </h2>
            <div className="space-y-2">
                {data.items.map((cert) => (
                    <div key={cert.id}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold">{cert.name}</h3>
                            <span className="text-sm text-gray-600">{formatDate(cert.date)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{cert.issuer}</p>
                        {cert.credentialId && (
                            <p className="text-xs text-gray-600">ID: {cert.credentialId}</p>
                        )}
                        {cert.link && (
                            <p className="text-xs text-gray-700">{cert.link}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

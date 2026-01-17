import React from 'react';
import type { LanguagesSection } from '../../types';

interface LanguagesPreviewProps {
    data: LanguagesSection;
}

export const LanguagesPreview: React.FC<LanguagesPreviewProps> = ({ data }) => {
    const proficiencyLabels: Record<string, string> = {
        native: 'Native',
        fluent: 'Fluent',
        professional: 'Professional',
        intermediate: 'Intermediate',
        basic: 'Basic',
    };

    return (
        <section className="cv-section">
            <h2 className="section-title">
                {data.title}
            </h2>
            <div className="section-content">
                {data.items.map((lang, idx) => (
                    <span key={lang.id}>
                        <strong>{lang.language}</strong> ({proficiencyLabels[lang.proficiency]})
                        {idx < data.items.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>
        </section>
    );
};

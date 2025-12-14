import React from 'react';
import type { ProjectsSection } from '../../types';

interface ProjectsPreviewProps {
    data: ProjectsSection;
}

const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present') return 'Present';

    const [year, month] = dateStr.split('-');
    if (!month) return year;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ProjectsPreview: React.FC<ProjectsPreviewProps> = ({ data }) => {
    return (
        <section className="cv-section">
            <h2 className="section-title">{data.title}</h2>
            {data.items.map((project) => (
                <div key={project.id} className="experience-item">
                    <div className="exp-header">
                        <div className="exp-left">
                            <h3 className="exp-title">{project.name}</h3>
                            {project.technologies && (
                                <div className="exp-company">{project.technologies}</div>
                            )}
                        </div>
                        <div className="exp-date">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                    </div>
                    {project.description && (
                        <p className="section-content">{project.description}</p>
                    )}
                    {project.link && (
                        <div className="edu-note">{project.link}</div>
                    )}
                </div>
            ))}
        </section>
    );
};

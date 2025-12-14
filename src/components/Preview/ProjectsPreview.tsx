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
        <div className="mb-4">
            <h2 className="text-xl font-bold uppercase border-b-2 border-gray-800 pb-1 mb-3">
                {data.title}
            </h2>
            <div className="space-y-3">
                {data.items.map((project) => (
                    <div key={project.id}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold">{project.name}</h3>
                            <span className="text-sm text-gray-600">
                                {formatDate(project.startDate)} - {formatDate(project.endDate)}
                            </span>
                        </div>
                        {project.technologies && (
                            <p className="text-sm text-gray-700 italic">{project.technologies}</p>
                        )}
                        {project.description && (
                            <p className="text-sm mt-1">{project.description}</p>
                        )}
                        {project.link && (
                            <p className="text-sm text-gray-700 mt-1">
                                {project.link}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

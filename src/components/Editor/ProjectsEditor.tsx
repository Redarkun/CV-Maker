import React from 'react';
import type { ProjectsSection, ProjectItem } from '../../types';

interface ProjectsEditorProps {
    data: ProjectsSection;
    onChange: (data: ProjectsSection) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ data, onChange }) => {
    const handleTitleChange = (title: string) => {
        onChange({ ...data, title });
    };

    const handleAddProject = () => {
        const newProject: ProjectItem = {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: '',
            link: '',
            startDate: '',
            endDate: '',
        };
        onChange({ ...data, items: [...data.items, newProject] });
    };

    const handleRemoveProject = (id: string) => {
        onChange({
            ...data,
            items: data.items.filter((item) => item.id !== id),
        });
    };

    const handleProjectChange = (id: string, field: keyof ProjectItem, value: string) => {
        onChange({
            ...data,
            items: data.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                <button
                    onClick={handleAddProject}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Project
                </button>
            </div>

            {/* Section Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="PERSONAL PROJECTS"
                />
            </div>

            {/* Projects List */}
            <div className="space-y-4">
                {data.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No projects added yet. Click "Add Project" to get started.
                    </div>
                ) : (
                    data.items.map((project, index) => (
                        <div key={project.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium text-gray-700">
                                    Project {index + 1}
                                </h4>
                                <button
                                    onClick={() => handleRemoveProject(project.id)}
                                    className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Project Name */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) =>
                                            handleProjectChange(project.id, 'name', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="E-Commerce Platform"
                                    />
                                </div>

                                {/* Technologies */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Technologies
                                    </label>
                                    <input
                                        type="text"
                                        value={project.technologies}
                                        onChange={(e) =>
                                            handleProjectChange(
                                                project.id,
                                                'technologies',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={project.description}
                                        onChange={(e) =>
                                            handleProjectChange(
                                                project.id,
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        rows={2}
                                        placeholder="Brief description of the project..."
                                    />
                                </div>

                                {/* Link */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link (GitHub/Demo)
                                    </label>
                                    <input
                                        type="url"
                                        value={project.link || ''}
                                        onChange={(e) =>
                                            handleProjectChange(project.id, 'link', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://github.com/username/project"
                                    />
                                </div>

                                {/* Dates */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="month"
                                        value={project.startDate}
                                        onChange={(e) =>
                                            handleProjectChange(
                                                project.id,
                                                'startDate',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="month"
                                        value={project.endDate}
                                        onChange={(e) =>
                                            handleProjectChange(project.id, 'endDate', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Or 'Present'"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

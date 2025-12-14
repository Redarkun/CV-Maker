import { useState } from 'react';
import type { CV, Section } from '../types';
import { nanoid } from 'nanoid';

export const useCV = () => {
    const [currentCV, setCurrentCV] = useState<CV>({
        id: nanoid(),
        name: 'My CV',
        template: 'clean-professional',
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: [
            {
                id: nanoid(),
                order: 0,
                isActive: true,
                data: {
                    type: 'header',
                    fields: [
                        { id: nanoid(), type: 'fullName', value: '', enabled: true, order: 0, layout: 'full' },
                        { id: nanoid(), type: 'jobPosition', value: '', enabled: true, order: 1, layout: 'full' },
                        { id: nanoid(), type: 'email', value: '', enabled: true, order: 2, layout: 'half' },
                        { id: nanoid(), type: 'phone', value: '', enabled: true, order: 3, layout: 'half' },
                        { id: nanoid(), type: 'location', value: '', enabled: false, order: 4, layout: 'full' },
                        { id: nanoid(), type: 'linkedin', value: '', enabled: false, order: 5, layout: 'half' },
                        { id: nanoid(), type: 'portfolio', value: '', enabled: false, order: 6, layout: 'half' },
                    ],
                },
            },
            {
                id: nanoid(),
                order: 1,
                isActive: true,
                data: {
                    type: 'summary',
                    title: 'PROFESSIONAL SUMMARY',
                    content: '',
                },
            },
            {
                id: nanoid(),
                order: 2,
                isActive: true,
                data: {
                    type: 'experience',
                    title: 'PROFESSIONAL EXPERIENCE',
                    items: [],
                },
            },
            {
                id: nanoid(),
                order: 3,
                isActive: true,
                data: {
                    type: 'education',
                    title: 'EDUCATION',
                    items: [],
                },
            },
            {
                id: nanoid(),
                order: 4,
                isActive: true,
                data: {
                    type: 'skills',
                    title: 'SKILLS',
                    categories: [],
                },
            },
            // Optional sections - Start inactive
            {
                id: nanoid(),
                order: 5,
                isActive: false,
                data: {
                    type: 'projects',
                    title: 'PERSONAL PROJECTS',
                    items: [],
                },
            },
            {
                id: nanoid(),
                order: 6,
                isActive: false,
                data: {
                    type: 'languages',
                    title: 'LANGUAGES',
                    items: [],
                },
            },
            {
                id: nanoid(),
                order: 7,
                isActive: false,
                data: {
                    type: 'certifications',
                    title: 'CERTIFICATIONS',
                    items: [],
                },
            },
            {
                id: nanoid(),
                order: 8,
                isActive: false,
                data: {
                    type: 'awards',
                    title: 'AWARDS & HONORS',
                    items: [],
                },
            },
        ],
        settings: {
            font: 'Arial',
            fontSize: 10,
            margins: { top: 2, right: 2, bottom: 2, left: 2 },
            lineSpacing: 1.25,
        },
    });

    const updateSection = (sectionId: string, data: Section['data']) => {
        setCurrentCV(prev => ({
            ...prev,
            updatedAt: new Date(),
            sections: prev.sections.map(section =>
                section.id === sectionId ? { ...section, data } : section
            ),
        }));
    };

    const getSection = (sectionId: string) => {
        return currentCV.sections.find(s => s.id === sectionId);
    };

    return {
        currentCV,
        setCurrentCV,
        updateSection,
        getSection,
    };
};

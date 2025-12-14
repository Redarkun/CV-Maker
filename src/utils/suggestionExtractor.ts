import type { CV, FieldSuggestion, HeaderSection, ExperienceSection, EducationSection, SkillsSection } from '../types';

interface ExtractedSuggestion {
    value: string;
    fieldType: string;
    sectionType: FieldSuggestion['sectionType'];
}

/**
 * Extract all potential suggestions from a CV
 * Returns array of unique field values that could be saved as suggestions
 */
export const extractSuggestionsFromCV = (cv: CV): ExtractedSuggestion[] => {
    const extracted: ExtractedSuggestion[] = [];

    cv.sections.forEach(section => {
        switch (section.data.type) {
            case 'header': {
                const headerData = section.data as HeaderSection;
                headerData.fields.forEach(field => {
                    if (field.value && field.enabled) {
                        extracted.push({
                            value: field.value,
                            fieldType: field.type,
                            sectionType: 'header',
                        });
                    }
                });
                break;
            }

            case 'summary': {
                // We don't suggest full summaries (too long), skip
                break;
            }

            case 'experience': {
                const expData = section.data as ExperienceSection;
                expData.items.forEach(item => {
                    if (item.company) {
                        extracted.push({
                            value: item.company,
                            fieldType: 'company',
                            sectionType: 'experience',
                        });
                    }
                    if (item.role) {
                        extracted.push({
                            value: item.role,
                            fieldType: 'role',
                            sectionType: 'experience',
                        });
                    }
                    if (item.location) {
                        extracted.push({
                            value: item.location,
                            fieldType: 'location',
                            sectionType: 'experience',
                        });
                    }
                    // Note: We don't suggest individual bullets (too specific)
                });
                break;
            }

            case 'education': {
                const eduData = section.data as EducationSection;
                eduData.items.forEach(item => {
                    if (item.degree) {
                        extracted.push({
                            value: item.degree,
                            fieldType: 'degree',
                            sectionType: 'education',
                        });
                    }
                    if (item.institution) {
                        extracted.push({
                            value: item.institution,
                            fieldType: 'institution',
                            sectionType: 'education',
                        });
                    }
                });
                break;
            }

            case 'skills': {
                const skillsData = section.data as SkillsSection;
                skillsData.categories.forEach(category => {
                    if (category.name) {
                        extracted.push({
                            value: category.name,
                            fieldType: 'categoryName',
                            sectionType: 'skills',
                        });
                    }
                    // Individual skills could be suggested too, but might be too granular
                    // Uncomment if needed:
                    // category.items.forEach(skill => {
                    //     extracted.push({
                    //         value: skill,
                    //         fieldType: 'skill',
                    //         sectionType: 'skills',
                    //     });
                    // });
                });
                break;
            }
        }
    });

    return extracted;
};

/**
 * Filter out suggestions that already exist in the suggestions store
 * Returns only NEW suggestions that should be offered to user
 */
export const getNewSuggestions = (
    extracted: ExtractedSuggestion[],
    existing: FieldSuggestion[]
): ExtractedSuggestion[] => {
    return extracted.filter(ext => {
        // Check if this exact combination exists
        return !existing.some(
            exist =>
                exist.value.toLowerCase() === ext.value.toLowerCase() &&
                exist.fieldType === ext.fieldType &&
                exist.sectionType === ext.sectionType
        );
    });
};

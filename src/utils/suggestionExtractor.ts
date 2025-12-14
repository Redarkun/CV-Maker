import type { CV, FieldSuggestion, Section } from '../types';
import type { NewSuggestionData } from '../components/SuggestionsConfirmModal';

/**
 * Extract all valuable field values from a CV for suggestions
 */
export const extractSuggestionsFromCV = (cv: CV): NewSuggestionData[] => {
    const suggestions: NewSuggestionData[] = [];

    cv.sections.forEach(section => {
        const { data } = section;

        switch (data.type) {
            case 'header':
                // Extract header fields
                data.fields.forEach(field => {
                    if (field.enabled && field.value.trim()) {
                        suggestions.push({
                            value: field.value.trim(),
                            fieldType: field.type,
                            sectionType: 'header',
                        });
                    }
                });
                break;

            case 'experience':
                // Extract from each experience entry
                data.items.forEach(item => {
                    // Company
                    if (item.company?.trim()) {
                        suggestions.push({
                            value: item.company.trim(),
                            fieldType: 'company',
                            sectionType: 'experience',
                        });
                    }

                    // Job title
                    if (item.role?.trim()) {
                        suggestions.push({
                            value: item.role.trim(),
                            fieldType: 'jobTitle',
                            sectionType: 'experience',
                        });
                    }

                    // Location
                    if (item.location?.trim()) {
                        suggestions.push({
                            value: item.location.trim(),
                            fieldType: 'location',
                            sectionType: 'experience',
                        });
                    }
                });
                break;

            case 'education':
                // Extract from each education entry
                data.items.forEach(item => {
                    // Degree/Title
                    if (item.degree?.trim()) {
                        suggestions.push({
                            value: item.degree.trim(),
                            fieldType: 'degree',
                            sectionType: 'education',
                        });
                    }

                    // Institution
                    if (item.institution?.trim()) {
                        suggestions.push({
                            value: item.institution.trim(),
                            fieldType: 'institution',
                            sectionType: 'education',
                        });
                    }

                    // Location
                    if (item.location?.trim()) {
                        suggestions.push({
                            value: item.location.trim(),
                            fieldType: 'location',
                            sectionType: 'education',
                        });
                    }
                });
                break;

            case 'skills':
                // Extract category names only (not individual skills)
                data.categories.forEach(category => {
                    if (category.name?.trim()) {
                        suggestions.push({
                            value: category.name.trim(),
                            fieldType: 'categoryName',
                            sectionType: 'skills',
                        });
                    }
                });
                break;

            case 'summary':
                // Skip - too specific and long
                break;

            default:
                // Handle custom sections if needed
                break;
        }
    });

    // Remove exact duplicates
    return deduplicateSuggestions(suggestions);
};

/**
 * Remove duplicate suggestions (case-insensitive)
 */
const deduplicateSuggestions = (suggestions: NewSuggestionData[]): NewSuggestionData[] => {
    const seen = new Set<string>();
    const unique: NewSuggestionData[] = [];

    suggestions.forEach(suggestion => {
        const key = `${suggestion.fieldType}:${suggestion.sectionType}:${suggestion.value.toLowerCase()}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(suggestion);
        }
    });

    return unique;
};

/**
 * Filter extracted suggestions to only include NEW values
 * (not already in existing suggestions)
 */
export const getNewSuggestions = (
    extracted: NewSuggestionData[],
    existingSuggestions: FieldSuggestion[]
): NewSuggestionData[] => {
    return extracted.filter(newSugg => {
        // Check if this value already exists for this field type and section
        const exists = existingSuggestions.some(
            existing =>
                existing.fieldType === newSugg.fieldType &&
                existing.sectionType === newSugg.sectionType &&
                existing.value.toLowerCase() === newSugg.value.toLowerCase()
        );

        return !exists;
    });
};

/**
 * Validate suggestion value (not empty, reasonable length)
 */
export const isValidSuggestionValue = (value: string): boolean => {
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.length <= 200;
};

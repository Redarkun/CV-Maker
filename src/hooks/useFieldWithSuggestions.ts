import { useActiveField } from '../context/ActiveFieldContext';
import type { FieldSuggestion } from '../types';

/**
 * Hook to register an input field with the suggestions system
 * Returns props to spread on the input element
 */
export const useFieldWithSuggestions = (
    fieldType: string,
    sectionType: FieldSuggestion['sectionType'],
    _currentValue: string,
    onChange: (value: string) => void
) => {
    const { setActiveField } = useActiveField();

    return {
        onFocus: () => {
            setActiveField({
                fieldType,
                sectionType,
                setValue: onChange,
            });
        },
        onBlur: () => {
            // Optionally clear active field on blur
            // setActiveField(null);
        },
    };
};

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useActiveField } from '../../context/ActiveFieldContext';
import type { HeaderSection, HeaderField } from '../../types';

interface HeaderEditorProps {
    data: HeaderSection;
    onChange: (data: HeaderSection) => void;
}

interface SortableFieldProps {
    field: HeaderField;
    onUpdate: (id: string, updates: Partial<HeaderField>) => void;
}

const fieldLabels: Record<string, string> = {
    fullName: 'Full Name',
    jobPosition: 'Job Position / Title',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    linkedin: 'LinkedIn',
    portfolio: 'Portfolio/Website',
};

const fieldPlaceholders: Record<string, string> = {
    fullName: 'John Doe',
    jobPosition: 'Senior Software Engineer',
    email: 'john@example.com',
    phone: '+34 123 456 789',
    location: 'Madrid, Spain',
    linkedin: 'linkedin.com/in/username',
    portfolio: 'yourwebsite.com',
};

const SortableField: React.FC<SortableFieldProps> = ({ field, onUpdate }) => {
    const { setActiveField } = useActiveField();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative border border-gray-200 rounded-md p-3 bg-white ${field.layout === 'half' ? 'col-span-1' : 'col-span-2'
                }`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-2 cursor-grab active:cursor-grabbing"
            >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>

            {/* Content */}
            <div className="ml-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.enabled}
                            onChange={(e) => onUpdate(field.id, { enabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            {fieldLabels[field.type]}
                        </label>
                    </div>

                    {/* Layout Toggle */}
                    <button
                        onClick={() => onUpdate(field.id, { layout: field.layout === 'full' ? 'half' : 'full' })}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                        title={field.layout === 'full' ? 'Switch to half width' : 'Switch to full width'}
                    >
                        {field.layout === 'full' ? '⬌ Full' : '⬌ Half'}
                    </button>
                </div>

                {field.enabled && (
                    <input
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'url'}
                        value={field.value}
                        onChange={(e) => onUpdate(field.id, { value: e.target.value })}
                        onFocus={() => {
                            setActiveField({
                                fieldType: field.type,
                                sectionType: 'header',
                                setValue: (value) => onUpdate(field.id, { value }),
                            });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={fieldPlaceholders[field.type]}
                    />
                )}
            </div>
        </div>
    );
};

export const HeaderEditor: React.FC<HeaderEditorProps> = ({ data, onChange }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFieldUpdate = (fieldId: string, updates: Partial<HeaderField>) => {
        const updatedFields = data.fields.map((field) =>
            field.id === fieldId ? { ...field, ...updates } : field
        );
        onChange({ ...data, fields: updatedFields });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = data.fields.findIndex((f) => f.id === active.id);
            const newIndex = data.fields.findIndex((f) => f.id === over.id);

            const reorderedFields = arrayMove(data.fields, oldIndex, newIndex).map((field, idx) => ({
                ...field,
                order: idx,
            }));

            onChange({ ...data, fields: reorderedFields });
        }
    };

    const sortedFields = [...data.fields].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Header Information</h3>

                {/* Alignment Toggle */}
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Alignment:</label>
                    <select
                        value={data.alignment || 'left'}
                        onChange={(e) => onChange({ ...data, alignment: e.target.value as 'left' | 'center' })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="left">Left</option>
                        <option value="center">Centered</option>
                    </select>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600">
                        Drag to reorder • Toggle full/half width • Enable/disable fields
                    </p>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortedFields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {sortedFields.map((field) => (
                                <SortableField
                                    key={field.id}
                                    field={field}
                                    onUpdate={handleFieldUpdate}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

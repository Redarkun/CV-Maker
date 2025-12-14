import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    useDroppable,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCV } from '../hooks/useCV';
import { useSuggestions } from '../hooks/useSuggestions';
import { useTemplates } from '../hooks/useTemplates';
import { CVPreview } from '../components/CVPreview';
import { SuggestionsSidebar } from '../components/SuggestionsSidebar';
import { TemplateSelector } from '../components/TemplateSelector';
import { SaveTemplateModal } from '../components/SaveTemplateModal';
import { SuggestionsConfirmModal, type NewSuggestionData } from '../components/SuggestionsConfirmModal';
import { ActiveFieldProvider, useActiveField } from '../context/ActiveFieldContext';
import { exportToDOCX } from '../utils/exportDOCX';
import { extractSuggestionsFromCV, getNewSuggestions } from '../utils/suggestionExtractor';
import {
    HeaderEditor,
    SummaryEditor,
    ExperienceEditor,
    EducationEditor,
    SkillsEditor,
} from '../components/Editor';
import type {
    HeaderSection,
    SummarySection,
    ExperienceSection,
    EducationSection,
    SkillsSection,
    Section,
    CV,
} from '../types';

interface EditorViewProps {
    onBack: () => void;
    onExport: (cv: CV) => void;
}

interface SortableSectionProps {
    section: Section;
    updateSection: (sectionId: string, data: Section['data']) => void;
}

const sectionTitles: Record<string, string> = {
    header: 'Header Information',
    summary: 'Professional Summary',
    experience: 'Professional Experience',
    education: 'Education',
    skills: 'Skills',
};

const SortableSection: React.FC<SortableSectionProps> = ({ section, updateSection }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const renderEditor = () => {
        switch (section.data.type) {
            case 'header':
                return (
                    <HeaderEditor
                        data={section.data as HeaderSection}
                        onChange={(data) => updateSection(section.id, data)}
                    />
                );
            case 'summary':
                return (
                    <SummaryEditor
                        data={section.data as SummarySection}
                        onChange={(data) => updateSection(section.id, data)}
                    />
                );
            case 'experience':
                return (
                    <ExperienceEditor
                        data={section.data as ExperienceSection}
                        onChange={(data) => updateSection(section.id, data)}
                    />
                );
            case 'education':
                return (
                    <EducationEditor
                        data={section.data as EducationSection}
                        onChange={(data) => updateSection(section.id, data)}
                    />
                );
            case 'skills':
                return (
                    <SkillsEditor
                        data={section.data as SkillsSection}
                        onChange={(data) => updateSection(section.id, data)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="relative">
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-l-lg z-10"
            >
                <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                    />
                </svg>
            </div>
            <div className="ml-8">
                {renderEditor()}
            </div>
        </div>
    );
};

const InactiveSectionCard: React.FC<{ section: Section }> = ({ section }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 bg-gray-50 border border-gray-300 rounded-md cursor-grab active:cursor-grabbing hover:bg-gray-100"
        >
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                    {sectionTitles[section.data.type] || 'Section'}
                </span>
            </div>
        </div>
    );
};

const DroppableZone: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({
    id,
    children,
    className = ''
}) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`${className} ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        >
            {children}
        </div>
    );
};

export const EditorView: React.FC<EditorViewProps> = (props) => {
    return (
        <ActiveFieldProvider>
            <EditorViewContent {...props} />
        </ActiveFieldProvider>
    );
};

const EditorViewContent: React.FC<EditorViewProps> = ({ onBack, onExport }) => {
    const { currentCV, setCurrentCV, updateSection } = useCV();
    const { suggestions, removeSuggestion, addBulkSuggestions } = useSuggestions();
    const {
        templates,
        activeTemplateId,
        saveTemplate,
        updateTemplate,
        deleteTemplate,
        setActiveTemplate,
        getActiveTemplate,
    } = useTemplates();
    const { activeField } = useActiveField();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

    // Template modals
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
    const [pendingNewSuggestions, setPendingNewSuggestions] = useState<NewSuggestionData[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if (!over) return;

        setCurrentCV((prev) => {
            const activeSection = prev.sections.find((s) => s.id === active.id);
            if (!activeSection) return prev;

            const overSection = prev.sections.find((s) => s.id === over.id);

            if (overSection && active.id !== over.id) {
                const needsZoneChange = activeSection.isActive !== overSection.isActive;

                let updatedSections = prev.sections;

                if (needsZoneChange) {
                    updatedSections = prev.sections.map((s) =>
                        s.id === active.id
                            ? { ...s, isActive: overSection.isActive }
                            : s
                    );
                }

                const oldIndex = updatedSections.findIndex((s) => s.id === active.id);
                const newIndex = updatedSections.findIndex((s) => s.id === over.id);

                const reordered = arrayMove(updatedSections, oldIndex, newIndex).map((section, idx) => ({
                    ...section,
                    order: idx,
                }));

                return {
                    ...prev,
                    sections: reordered,
                    updatedAt: new Date(),
                };
            }

            if (over.id === 'active-zone' || over.id === 'inactive-zone') {
                const shouldBeActive = over.id === 'active-zone';

                if (activeSection.isActive !== shouldBeActive) {
                    const updatedSections = prev.sections.map((s) =>
                        s.id === active.id
                            ? { ...s, isActive: shouldBeActive }
                            : s
                    );

                    const activeSecs = updatedSections.filter(s => s.isActive);
                    const inactiveSecs = updatedSections.filter(s => !s.isActive);

                    const reorderedSections = [
                        ...activeSecs.map((s, idx) => ({ ...s, order: idx })),
                        ...inactiveSecs.map((s, idx) => ({ ...s, order: idx })),
                    ];

                    return {
                        ...prev,
                        sections: reorderedSections,
                        updatedAt: new Date(),
                    };
                }
                return prev;
            }

            return prev;
        });
    };

    const activeSections = currentCV.sections
        .filter((s) => s.isActive)
        .sort((a, b) => a.order - b.order);

    const inactiveSections = currentCV.sections
        .filter((s) => !s.isActive)
        .sort((a, b) => a.order - b.order);

    // Handlers for suggestions
    const handlePaste = (value: string) => {
        if (activeField) {
            activeField.setValue(value);
        }
    };

    const handleDeleteSuggestion = (id: string) => {
        removeSuggestion(id);
    };

    // Template handlers
    const handleSaveTemplate = (name: string) => {
        // Extract new suggestions from current CV
        const extracted = extractSuggestionsFromCV(currentCV);
        const newSuggestions = getNewSuggestions(extracted, suggestions);

        // Save template
        saveTemplate(name, currentCV);
        setShowSaveModal(false);

        // If there are new suggestions, show confirmation modal
        if (newSuggestions.length > 0) {
            setPendingNewSuggestions(newSuggestions);
            setShowSuggestionsModal(true);
        }
    };

    const handleConfirmSuggestions = (selectedSuggestions: NewSuggestionData[]) => {
        if (selectedSuggestions.length > 0) {
            addBulkSuggestions(selectedSuggestions);
        }
        setShowSuggestionsModal(false);
        setPendingNewSuggestions([]);
    };

    const handleSelectTemplate = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setCurrentCV(template.cv);
            setActiveTemplate(templateId);
        }
    };

    const handleNewTemplate = () => {
        // Just clear active, keep current CV for editing
        setActiveTemplate(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-[1400px] mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            ← Back to Home
                        </button>

                        {/* Template Selector */}
                        <TemplateSelector
                            templates={templates}
                            activeTemplateId={activeTemplateId}
                            onSelectTemplate={handleSelectTemplate}
                            onNewTemplate={handleNewTemplate}
                            onDeleteTemplate={deleteTemplate}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            💾 Save Template
                        </button>
                        <button
                            onClick={() => exportToDOCX(currentCV)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            📝 Export DOCX
                        </button>
                        <button
                            onClick={() => onExport(currentCV)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            📄 Export PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto py-6 px-4">
                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'editor'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            ✏️ Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'preview'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            👁️ Preview
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'editor' ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={[...activeSections, ...inactiveSections].map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-[250px_1fr_300px] gap-6">
                                {/* Suggestions Sidebar - Left */}
                                <SuggestionsSidebar
                                    suggestions={suggestions}
                                    activeField={activeField}
                                    onPaste={handlePaste}
                                    onDelete={handleDeleteSuggestion}
                                />

                                {/* Main Editor - Center */}
                                <DroppableZone id="active-zone">
                                    <div className="space-y-4 min-h-[400px] p-2">
                                        {activeSections.length === 0 && (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                                <p className="text-gray-500">
                                                    Drag sections from the sidebar to add them to your CV
                                                </p>
                                            </div>
                                        )}
                                        {activeSections.map((section) => (
                                            <SortableSection
                                                key={section.id}
                                                section={section}
                                                updateSection={updateSection}
                                            />
                                        ))}
                                    </div>
                                </DroppableZone>

                                <div className="sticky top-24 h-fit">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-3">Inactive Sections</h3>
                                        <p className="text-xs text-gray-600 mb-4">
                                            Drag sections here to remove from CV. Drag back to main area to add them.
                                        </p>

                                        <DroppableZone id="inactive-zone" className="min-h-[300px]">
                                            <div className="space-y-2 min-h-[400px] p-2">
                                                {inactiveSections.length === 0 && (
                                                    <div className="border-2 border-dashed border-gray-200 rounded p-6 text-center">
                                                        <p className="text-xs text-gray-400">
                                                            No inactive sections
                                                        </p>
                                                    </div>
                                                )}
                                                {inactiveSections.map((section) => (
                                                    <InactiveSectionCard key={section.id} section={section} />
                                                ))}
                                            </div>
                                        </DroppableZone>
                                    </div>
                                </div>
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeId ? (
                                <div className="p-3 bg-white border-2 border-blue-500 rounded-md shadow-xl opacity-90">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            {sectionTitles[
                                                currentCV.sections.find(s => s.id === activeId)?.data.type || ''
                                            ] || 'Section'}
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="bg-gray-50 rounded-lg">
                        <CVPreview cv={currentCV} />
                    </div>
                )}
            </div>
        </div>

            {/* Save Template Modal */ }
    <SaveTemplateModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveTemplate}
        existingNames={templates.map(t => t.name)}
    />

    {/* Suggestions Confirmation Modal */ }
    <SuggestionsConfirmModal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        onConfirm={handleConfirmSuggestions}
        newSuggestions={pendingNewSuggestions}
    />
        </div >
    );
};

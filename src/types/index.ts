// CV Data Types with discriminated unions for type safety

export interface CV {
    id: string;
    name: string;
    template: 'clean-professional';
    createdAt: Date;
    updatedAt: Date;
    sections: Section[];
    settings: CVSettings;
}

export interface Section {
    id: string;
    order: number;
    isActive: boolean; // true = en CV, false = en sidebar
    data: SectionData;
}

// Discriminated unions para type safety
export type SectionData =
    | HeaderSection
    | SummarySection
    | ExperienceSection
    | EducationSection
    | SkillsSection
    | CustomSection;

export type HeaderFieldType = 'fullName' | 'jobPosition' | 'email' | 'phone' | 'location' | 'linkedin' | 'portfolio';

export interface HeaderField {
    id: string;
    type: HeaderFieldType;
    value: string;
    enabled: boolean;
    order: number;
    layout: 'full' | 'half'; // full = ancho completo, half = comparte fila
}

export interface HeaderSection {
    type: 'header';
    fields: HeaderField[];
}

export interface SummarySection {
    type: 'summary';
    title: string; // "Resumen Profesional" (editable)
    content: string; // Máx 300 caracteres
}

export interface ExperienceSection {
    type: 'experience';
    title: string; // "Experiencia Laboral" (editable)
    items: ExperienceItem[];
}

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate: Date | null; // null = "Actualidad"
    bullets: string[]; // Logros/responsabilidades
}

export interface EducationSection {
    type: 'education';
    title: string; // "Educación" (editable)
    items: EducationItem[];
}

export interface EducationItem {
    id: string;
    degree: string;
    institution: string;
    year: number;
    notes?: string;
}

export interface SkillsSection {
    type: 'skills';
    title: string; // "Habilidades" (editable)
    categories: SkillCategory[];
}

export interface SkillCategory {
    id: string;
    name: string; // "Técnicas", "Idiomas", etc.
    items: string[];
}

export interface CustomSection {
    type: 'custom';
    title: string;
    content: string; // Flexible para contenido libre
}

export interface CVSettings {
    font: 'Arial' | 'Times New Roman' | 'Calibri';
    fontSize: number;
    margins: { top: number; right: number; bottom: number; left: number };
    lineSpacing: number;
}

// ATS Analysis Types
export interface ATSAnalysis {
    score: number; // 0-100
    breakdown: {
        format: number;      // 0-25
        structure: number;   // 0-25
        parseable: number;   // 0-30
        content: number;     // 0-20
    };
    issues: {
        critical: string[];  // Problemas graves
        warnings: string[];  // Advertencias
        positive: string[];  // Aspectos buenos
    };
    suggestions: string[]; // Recomendaciones
}

// Field Suggestions System
export interface FieldSuggestion {
    id: string;
    value: string;
    fieldType: string; // HeaderFieldType, 'company', 'role', 'degree', etc.
    sectionType: 'header' | 'experience' | 'education' | 'skills' | 'summary';
    metadata?: {
        lastUsed?: Date;
        useCount?: number;
    };
    createdAt: Date;
}

export interface SuggestionsStore {
    suggestions: FieldSuggestion[];
    version: number; // Para migraciones futuras
}

// Multi-Template Management
export interface SavedTemplate {
    id: string;
    name: string; // User-defined name like "CV Tech Lead 2024"
    cv: CV; // Full CV data snapshot
    createdAt: Date;
    updatedAt: Date;
}

export interface TemplatesStore {
    templates: SavedTemplate[];
    activeTemplateId: string | null; // Currently active template
    version: number;
}


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
    | ProjectsSection
    | LanguagesSection
    | CertificationsSection
    | AwardsSection
    | CustomSection;

export type HeaderFieldType = 'fullName' | 'jobPosition' | 'email' | 'phone' | 'location' | 'linkedin' | 'portfolio' | 'languages';

export interface HeaderField {
    id: string;
    type: HeaderFieldType;
    value: string;
    enabled: boolean;
    order: number;
    layout: 'full' | 'half' | 'third'; // full = ancho completo, half = 1/2, third = 1/3
}

export interface HeaderSection {
    type: 'header';
    fields: HeaderField[];
    alignment?: 'left' | 'center'; // Header alignment preference
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
    dateFormat?: 'month-year' | 'year-only'; // Format for display
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
    dateFormat?: 'month-year' | 'year-only'; // Format for display
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

// Optional Sections - Start inactive by default

export interface ProjectsSection {
    type: 'projects';
    title: string;
    items: ProjectItem[];
}

export interface ProjectItem {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link?: string;
    startDate: string;
    endDate: string; // or "Present"
}

export interface LanguagesSection {
    type: 'languages';
    title: string;
    items: LanguageItem[];
}

export interface LanguageItem {
    id: string;
    language: string;
    proficiency: 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
}

export interface CertificationsSection {
    type: 'certifications';
    title: string;
    items: CertificationItem[];
}

export interface CertificationItem {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    link?: string;
}

export interface AwardsSection {
    type: 'awards';
    title: string;
    items: AwardItem[];
}

export interface AwardItem {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
}

export interface CustomSection {
    type: 'custom';
    title: string;
    content: string; // Flexible para contenido libre
}

export interface CVSettings {
    font: 'Arial' | 'Times New Roman' | 'Calibri';
    fontSize: 'minimal' | 'small' | 'normal' | 'large';
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


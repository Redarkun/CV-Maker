import React from 'react';
import type { CV, ExperienceSection, EducationSection, SkillsSection, SummarySection, HeaderSection, HeaderField, Section, ProjectsSection, LanguagesSection, CertificationsSection, AwardsSection } from '../types';
import { ProjectsPreview } from './Preview/ProjectsPreview';
import { LanguagesPreview } from './Preview/LanguagesPreview';
import { CertificationsPreview } from './Preview/CertificationsPreview';
import { AwardsPreview } from './Preview/AwardsPreview';
import '../styles/cv-preview.css';

interface CVPreviewProps {
    cv: CV;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cv }) => {
    const activeSections = cv.sections
        .filter(s => s.isActive)
        .sort((a, b) => a.order - b.order);

    // Helper to render contact fields with proper layout
    const renderContactFields = (headerSection: HeaderSection) => {
        const contactFields = headerSection.fields
            .filter(f => f.enabled && f.value && f.type !== 'fullName' && f.type !== 'jobPosition')
            .sort((a, b) => a.order - b.order);

        if (contactFields.length === 0) return null;

        const rows: HeaderField[][] = [];
        let currentRow: HeaderField[] = [];
        let currentRowWidth = 0;

        contactFields.forEach(field => {
            const fieldWidth = field.layout === 'full' ? 1 : field.layout === 'half' ? 0.5 : 0.33;

            if (currentRowWidth + fieldWidth > 1.01) { // Small tolerance for floating point
                rows.push([...currentRow]);
                currentRow = [field];
                currentRowWidth = fieldWidth;
            } else {
                currentRow.push(field);
                currentRowWidth += fieldWidth;
            }
        });

        if (currentRow.length > 0) rows.push(currentRow);

        return rows.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '2px' }}>
                {row.map(field => (
                    <span
                        key={field.id}
                        style={{
                            flex: field.layout === 'full' ? '1 1 100%' :
                                field.layout === 'half' ? '1 1 50%' : '1 1 33%'
                        }}
                    >
                        {field.value}
                    </span>
                ))}
            </div>
        ));
    };

    const getFullName = (headerSection: HeaderSection) => {
        const fullNameField = headerSection.fields.find(f => f.type === 'fullName');
        return fullNameField?.value || 'FULL NAME';
    };

    const getJobPosition = (headerSection: HeaderSection) => {
        const jobPosField = headerSection.fields.find(f => f.type === 'jobPosition');
        return jobPosField?.value;
    };

    // Render each section based on type
    const renderSection = (section: Section) => {
        switch (section.data.type) {
            case 'header': {
                const headerData = section.data as HeaderSection;
                const alignment = headerData.alignment || 'left';
                const headerClass = alignment === 'center' ? 'cv-header cv-header-center' : 'cv-header';

                return (
                    <header key={section.id} className={headerClass}>
                        <h1 className="cv-name">{getFullName(headerData)}</h1>
                        {getJobPosition(headerData) && <div className="cv-subtitle">{getJobPosition(headerData)}</div>}
                        <div className="cv-contact">
                            {renderContactFields(headerData)}
                        </div>
                    </header>
                );
            }

            case 'summary': {
                const summaryData = section.data as SummarySection;
                return summaryData.content ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{summaryData.title}</h2>
                        <p className="section-content">{summaryData.content}</p>
                    </section>
                ) : null;
            }

            case 'experience': {
                const experienceData = section.data as ExperienceSection;
                return experienceData.items.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{experienceData.title}</h2>
                        {experienceData.items.map((item) => (
                            <div key={item.id} className="experience-item">
                                <div className="exp-header">
                                    <div className="exp-left">
                                        <h3 className="exp-title">{item.role || 'Job Title'}</h3>
                                        <div className="exp-company">{item.company || 'Company Name'}</div>
                                    </div>
                                    <div className="exp-date">
                                        {item.dateFormat === 'year-only'
                                            ? `${item.startDate ? new Date(item.startDate).getFullYear() : 'Start'} - ${item.endDate ? new Date(item.endDate).getFullYear() : 'Present'}`
                                            : `${item.startDate ? new Date(item.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Start'} - ${item.endDate ? new Date(item.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Present'}`
                                        }
                                        {item.location && `, ${item.location}`}
                                    </div>
                                </div>
                                {item.bullets && item.bullets.length > 0 && (
                                    <ul className="exp-bullets">
                                        {item.bullets.map((bullet, idx) => (
                                            <li key={idx}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                ) : null;
            }

            case 'education': {
                const educationData = section.data as EducationSection;
                return educationData.items.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{educationData.title}</h2>
                        {educationData.items.map((item) => (
                            <div key={item.id} className="education-item">
                                <div className="edu-header">
                                    <div className="edu-left">
                                        <h3 className="edu-degree">{item.degree || 'Degree'}</h3>
                                        <div className="edu-school">{item.institution || 'School/University'}</div>
                                    </div>
                                    <div className="edu-date">
                                        {item.year || 'Year'}
                                    </div>
                                </div>
                                {item.notes && (
                                    <div className="edu-note">{item.notes}</div>
                                )}
                            </div>
                        ))}
                    </section>
                ) : null;
            }

            case 'skills': {
                const skillsData = section.data as SkillsSection;
                return skillsData.categories.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{skillsData.title}</h2>
                        {skillsData.categories.map((category) => (
                            <div key={category.id} className="skills-category">
                                <strong>{category.name}:</strong> {category.items.join(', ')}
                            </div>
                        ))}
                    </section>
                ) : null;
            }

            case 'projects':
                return section.data.items?.length > 0 ? (
                    <ProjectsPreview key={section.id} data={section.data as ProjectsSection} />
                ) : null;

            case 'languages':
                return section.data.items?.length > 0 ? (
                    <LanguagesPreview key={section.id} data={section.data as LanguagesSection} />
                ) : null;

            case 'certifications':
                return section.data.items?.length > 0 ? (
                    <CertificationsPreview key={section.id} data={section.data as CertificationsSection} />
                ) : null;

            case 'awards':
                return section.data.items?.length > 0 ? (
                    <AwardsPreview key={section.id} data={section.data as AwardsSection} />
                ) : null;

            default:
                return null;
        }
    };

    // Font size presets to pt values
    const fontSizeMap: Record<typeof cv.settings.fontSize, number> = {
        minimal: 8,
        small: 9,
        normal: 9.5,
        large: 10.5,
    };
    const baseFontSize = fontSizeMap[cv.settings.fontSize];

    // Build dynamic styles from settings
    const dynamicStyles: React.CSSProperties = {
        '--cv-margin-top': `${cv.settings.margins.top}cm`,
        '--cv-margin-right': `${cv.settings.margins.right}cm`,
        '--cv-margin-bottom': `${cv.settings.margins.bottom}cm`,
        '--cv-margin-left': `${cv.settings.margins.left}cm`,
        '--cv-font-family': cv.settings.font,
        '--cv-font-size': `${baseFontSize}pt`,
        '--cv-line-spacing': cv.settings.lineSpacing,
    } as React.CSSProperties;

    return (
        <div className="cv-preview-wrapper">
            <div
                className="cv-container"
                style={{
                    ...dynamicStyles,
                    fontFamily: cv.settings.font,
                    fontSize: `${baseFontSize}pt`,
                    lineHeight: cv.settings.lineSpacing,
                    padding: `${cv.settings.margins.top}cm ${cv.settings.margins.right}cm ${cv.settings.margins.bottom}cm ${cv.settings.margins.left}cm`,
                }}
            >
                {/* Render sections in order */}
                {activeSections.map(section => renderSection(section))}

                {/* Empty state */}
                {activeSections.length === 0 && (
                    <div className="cv-empty-state">
                        <p>Start editing your CV to see a live preview here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

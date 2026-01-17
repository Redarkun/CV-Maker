import React from 'react';
import type { CV, ExperienceSection, EducationSection, SkillsSection, SummarySection, HeaderSection, Section, ProjectsSection, LanguagesSection, CertificationsSection, AwardsSection } from '../types';

interface CVPrintableProps {
    cv: CV;
}

export const CVPrintable: React.FC<CVPrintableProps> = ({ cv }) => {
    const activeSections = cv.sections
        .filter(s => s.isActive)
        .sort((a, b) => a.order - b.order);

    // Helper to render contact fields with proper layout (matching CVPreview)
    const renderContactFields = (headerSection: HeaderSection) => {
        const contactFields = headerSection.fields
            .filter(f => f.enabled && f.value && f.type !== 'fullName' && f.type !== 'jobPosition')
            .sort((a, b) => a.order - b.order);

        if (contactFields.length === 0) return null;

        // Group fields into rows based on layout
        const rows: Array<typeof contactFields> = [];
        let currentRow: typeof contactFields = [];
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
            <div key={idx} className="cv-contact-row">
                {row.map(field => (
                    <span
                        key={field.id}
                        className={`cv-contact-field cv-contact-${field.layout}`}
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

    // Helper to format project dates (matching ProjectsPreview)
    const formatProjectDate = (dateStr: string): string => {
        if (!dateStr) return '';
        if (dateStr.toLowerCase() === 'present') return 'Present';

        const [year, month] = dateStr.split('-');
        if (!month) return year;

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
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

            case 'projects': {
                const projectsData = section.data as ProjectsSection;
                return projectsData.items.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{projectsData.title}</h2>
                        {projectsData.items.map((project) => (
                            <div key={project.id} className="experience-item">
                                <div className="exp-header">
                                    <div className="exp-left">
                                        <h3 className="exp-title">{project.name}</h3>
                                        {project.technologies && (
                                            <div className="exp-company">{project.technologies}</div>
                                        )}
                                    </div>
                                    <div className="exp-date">
                                        {formatProjectDate(project.startDate)} - {formatProjectDate(project.endDate)}
                                    </div>
                                </div>
                                {project.description && (
                                    <p className="section-content">{project.description}</p>
                                )}
                                {project.link && (
                                    <div className="edu-note">{project.link}</div>
                                )}
                            </div>
                        ))}
                    </section>
                ) : null;
            }

            case 'languages': {
                const languagesData = section.data as LanguagesSection;
                const proficiencyLabels: Record<string, string> = {
                    native: 'Native',
                    fluent: 'Fluent',
                    professional: 'Professional',
                    intermediate: 'Intermediate',
                    basic: 'Basic',
                };

                return languagesData.items.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{languagesData.title}</h2>
                        <div className="section-content">
                            {languagesData.items.map((lang, idx) => (
                                <span key={lang.id}>
                                    <strong>{lang.language}</strong> ({proficiencyLabels[lang.proficiency]})
                                    {idx < languagesData.items.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </section>
                ) : null;
            }

            case 'certifications': {
                const certificationsData = section.data as CertificationsSection;
                return certificationsData.items.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{certificationsData.title}</h2>
                        {certificationsData.items.map((cert) => (
                            <div key={cert.id} className="education-item">
                                <div className="edu-header">
                                    <div className="edu-left">
                                        <h3 className="edu-degree">{cert.name}</h3>
                                        <div className="edu-school">{cert.issuer}</div>
                                    </div>
                                    <div className="edu-date">
                                        {cert.date ? new Date(cert.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : ''}
                                    </div>
                                </div>
                                {cert.credentialId && (
                                    <div className="edu-note">ID: {cert.credentialId}</div>
                                )}
                                {cert.link && (
                                    <div className="edu-note">{cert.link}</div>
                                )}
                            </div>
                        ))}
                    </section>
                ) : null;
            }

            case 'awards': {
                const awardsData = section.data as AwardsSection;
                return awardsData.items.length > 0 ? (
                    <section key={section.id} className="cv-section">
                        <h2 className="section-title">{awardsData.title}</h2>
                        {awardsData.items.map((award) => (
                            <div key={award.id} className="education-item">
                                <div className="edu-header">
                                    <div className="edu-left">
                                        <h3 className="edu-degree">{award.title}</h3>
                                        <div className="edu-school">{award.issuer}</div>
                                    </div>
                                    <div className="edu-date">
                                        {award.date ? new Date(award.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : ''}
                                    </div>
                                </div>
                                {award.description && (
                                    <div className="edu-note">{award.description}</div>
                                )}
                            </div>
                        ))}
                    </section>
                ) : null;
            }

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

    // Dynamic print styles based on settings
    const printStyles = `
        @page {
            size: A4;
            margin: ${cv.settings.margins.top}cm ${cv.settings.margins.right}cm ${cv.settings.margins.bottom}cm ${cv.settings.margins.left}cm;
        }
        @media print {
            .cv-container {
                font-family: '${cv.settings.font}', serif !important;
                font-size: ${baseFontSize}pt !important;
                line-height: ${cv.settings.lineSpacing} !important;
            }
        }
    `;

    return (
        <>
            <style>{printStyles}</style>
            <div
                className="cv-container"
                style={{
                    fontFamily: cv.settings.font,
                    fontSize: `${baseFontSize}pt`,
                    lineHeight: cv.settings.lineSpacing,
                }}
            >
                {activeSections.map(section => renderSection(section))}
            </div>
        </>
    );
};

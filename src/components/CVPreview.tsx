import React from 'react';
import type { CV, ExperienceSection, EducationSection, SkillsSection, SummarySection, HeaderSection, Section, ProjectsSection, LanguagesSection, CertificationsSection, AwardsSection } from '../types';
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

    // Helper functions for header
    const getContactLine = (headerSection: HeaderSection) => {
        const enabledFields = headerSection.fields
            .filter(f => f.enabled && f.value && f.type !== 'fullName' && f.type !== 'jobPosition')
            .sort((a, b) => a.order - b.order);

        return enabledFields.map(f => f.value).join(' • ');
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
                return (
                    <header key={section.id} className="cv-header">
                        <h1 className="cv-name">{getFullName(headerData)}</h1>
                        {getJobPosition(headerData) && <div className="cv-subtitle">{getJobPosition(headerData)}</div>}
                        {getContactLine(headerData) && (
                            <div className="cv-contact">{getContactLine(headerData)}</div>
                        )}
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
                                        {item.startDate ? new Date(item.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Start'}
                                        {' - '}
                                        {item.endDate ? new Date(item.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Present'}
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

    return (
        <div className="cv-preview-wrapper">
            <div className="cv-container">
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

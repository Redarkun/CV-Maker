import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, Packer } from 'docx';
import { saveAs } from 'file-saver';
import type { CV, ExperienceSection, EducationSection, SkillsSection, SummarySection, HeaderSection, Section } from '../types';

export const exportToDOCX = async (cv: CV) => {
    const activeSections = cv.sections
        .filter(s => s.isActive)
        .sort((a, b) => a.order - b.order);

    const children: Paragraph[] = [];

    // Helper to create section paragraphs
    const createSection = (section: Section): Paragraph[] => {
        const paragraphs: Paragraph[] = [];

        switch (section.data.type) {
            case 'header': {
                const headerData = section.data as HeaderSection;
                const fullNameField = headerData.fields.find(f => f.type === 'fullName');
                const jobPosField = headerData.fields.find(f => f.type === 'jobPosition');
                const contactFields = headerData.fields
                    .filter(f => f.enabled && f.value && f.type !== 'fullName' && f.type !== 'jobPosition')
                    .sort((a, b) => a.order - b.order);

                // Full Name
                paragraphs.push(
                    new Paragraph({
                        text: fullNameField?.value || 'FULL NAME',
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 },
                    })
                );

                // Job Position
                if (jobPosField?.value) {
                    paragraphs.push(
                        new Paragraph({
                            text: jobPosField.value,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 100 },
                        })
                    );
                }

                // Contact info
                if (contactFields.length > 0) {
                    paragraphs.push(
                        new Paragraph({
                            text: contactFields.map(f => f.value).join(' • '),
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 200 },
                        })
                    );
                }
                break;
            }

            case 'summary': {
                const summaryData = section.data as SummarySection;
                if (summaryData.content) {
                    paragraphs.push(
                        new Paragraph({
                            text: summaryData.title,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 200, after: 100 },
                            border: {
                                bottom: {
                                    color: '000000',
                                    space: 1,
                                    style: 'single',
                                    size: 6,
                                },
                            },
                        })
                    );
                    paragraphs.push(
                        new Paragraph({
                            text: summaryData.content,
                            spacing: { after: 200 },
                        })
                    );
                }
                break;
            }

            case 'experience': {
                const experienceData = section.data as ExperienceSection;
                if (experienceData.items.length > 0) {
                    paragraphs.push(
                        new Paragraph({
                            text: experienceData.title,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 200, after: 100 },
                            border: {
                                bottom: {
                                    color: '000000',
                                    space: 1,
                                    style: 'single',
                                    size: 6,
                                },
                            },
                        })
                    );

                    experienceData.items.forEach(item => {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: item.role || 'Job Title',
                                        bold: true,
                                    }),
                                ],
                                spacing: { before: 100, after: 50 },
                            })
                        );

                        const companyInfo = [item.company];
                        if (item.location) companyInfo.push(item.location);

                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: companyInfo.join(', '),
                                        italics: true,
                                    }),
                                ],
                                spacing: { after: 50 },
                            })
                        );

                        const dateStr = `${item.startDate ? new Date(item.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Start'} - ${item.endDate ? new Date(item.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Present'}`;
                        paragraphs.push(
                            new Paragraph({
                                text: dateStr,
                                spacing: { after: 100 },
                            })
                        );

                        item.bullets?.forEach(bullet => {
                            paragraphs.push(
                                new Paragraph({
                                    text: bullet,
                                    bullet: {
                                        level: 0,
                                    },
                                    spacing: { after: 50 },
                                })
                            );
                        });

                        paragraphs.push(
                            new Paragraph({
                                text: '',
                                spacing: { after: 100 },
                            })
                        );
                    });
                }
                break;
            }

            case 'education': {
                const educationData = section.data as EducationSection;
                if (educationData.items.length > 0) {
                    paragraphs.push(
                        new Paragraph({
                            text: educationData.title,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 200, after: 100 },
                            border: {
                                bottom: {
                                    color: '000000',
                                    space: 1,
                                    style: 'single',
                                    size: 6,
                                },
                            },
                        })
                    );

                    educationData.items.forEach(item => {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: item.degree || 'Degree',
                                        bold: true,
                                    }),
                                ],
                                spacing: { before: 100, after: 50 },
                            })
                        );

                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: item.institution || 'School/University',
                                        italics: true,
                                    }),
                                ],
                                spacing: { after: 50 },
                            })
                        );

                        paragraphs.push(
                            new Paragraph({
                                text: item.year?.toString() || 'Year',
                                spacing: { after: 50 },
                            })
                        );

                        if (item.notes) {
                            paragraphs.push(
                                new Paragraph({
                                    text: item.notes,
                                    spacing: { after: 100 },
                                })
                            );
                        }
                    });
                }
                break;
            }

            case 'skills': {
                const skillsData = section.data as SkillsSection;
                if (skillsData.categories.length > 0) {
                    paragraphs.push(
                        new Paragraph({
                            text: skillsData.title,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 200, after: 100 },
                            border: {
                                bottom: {
                                    color: '000000',
                                    space: 1,
                                    style: 'single',
                                    size: 6,
                                },
                            },
                        })
                    );

                    skillsData.categories.forEach(category => {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${category.name}: `,
                                        bold: true,
                                    }),
                                    new TextRun({
                                        text: category.items.join(', '),
                                    }),
                                ],
                                spacing: { after: 50 },
                            })
                        );
                    });
                }
                break;
            }
        }

        return paragraphs;
    };

    // Build document
    activeSections.forEach(section => {
        children.push(...createSection(section));
    });

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(0.79),
                            right: convertInchesToTwip(0.79),
                            bottom: convertInchesToTwip(0.79),
                            left: convertInchesToTwip(0.79),
                        },
                    },
                },
                children: children,
            },
        ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const fullNameField = cv.sections
        .find(s => s.data.type === 'header')
        ?.data as HeaderSection | undefined;
    const fileName = fullNameField?.fields.find(f => f.type === 'fullName')?.value || 'CV';

    saveAs(blob, `${fileName.replace(/\s+/g, '_')}_CV.docx`);
};

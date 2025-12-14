import React from 'react';
import type { CertificationsSection, CertificationItem } from '../../types';

interface CertificationsEditorProps {
    data: CertificationsSection;
    onChange: (data: CertificationsSection) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({ data, onChange }) => {
    const handleTitleChange = (title: string) => {
        onChange({ ...data, title });
    };

    const handleAddCertification = () => {
        const newCert: CertificationItem = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
            credentialId: '',
            link: '',
        };
        onChange({ ...data, items: [...data.items, newCert] });
    };

    const handleRemoveCertification = (id: string) => {
        onChange({
            ...data,
            items: data.items.filter((item) => item.id !== id),
        });
    };

    const handleCertificationChange = (id: string, field: keyof CertificationItem, value: string) => {
        onChange({
            ...data,
            items: data.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    return (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
                <button
                    onClick={handleAddCertification}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    + Add Certification
                </button>
            </div>

            {/* Section Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="CERTIFICATIONS"
                />
            </div>

            {/* Certifications List */}
            <div className="space-y-4">
                {data.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No certifications added yet. Click "Add Certification" to get started.
                    </div>
                ) : (
                    data.items.map((cert, index) => (
                        <div key={cert.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium text-gray-700">
                                    Certification {index + 1}
                                </h4>
                                <button
                                    onClick={() => handleRemoveCertification(cert.id)}
                                    className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Certification Name */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Certification Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) =>
                                            handleCertificationChange(cert.id, 'name', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="AWS Certified Solutions Architect"
                                    />
                                </div>

                                {/* Issuer */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issuer *
                                    </label>
                                    <input
                                        type="text"
                                        value={cert.issuer}
                                        onChange={(e) =>
                                            handleCertificationChange(cert.id, 'issuer', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Amazon Web Services"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="month"
                                        value={cert.date}
                                        onChange={(e) =>
                                            handleCertificationChange(cert.id, 'date', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Credential ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Credential ID
                                    </label>
                                    <input
                                        type="text"
                                        value={cert.credentialId || ''}
                                        onChange={(e) =>
                                            handleCertificationChange(
                                                cert.id,
                                                'credentialId',
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="ABC123XYZ"
                                    />
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Verification Link
                                    </label>
                                    <input
                                        type="url"
                                        value={cert.link || ''}
                                        onChange={(e) =>
                                            handleCertificationChange(cert.id, 'link', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://verify.example.com/ABC123"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

import React from 'react';
import type { CVSettings } from '../types';

interface PageSettingsPanelProps {
    settings: CVSettings;
    onUpdateSettings: (updates: Partial<CVSettings>) => void;
}

// Font size presets - these define base sizes, other elements scale proportionally
const fontSizeLabels: Record<CVSettings['fontSize'], string> = {
    minimal: 'Minimal',
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
};

export const PageSettingsPanel: React.FC<PageSettingsPanelProps> = ({ settings, onUpdateSettings }) => {
    return (
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-2">
            {/* Margins */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Margins (cm):</span>
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={settings.margins.top}
                        onChange={(e) => onUpdateSettings({ margins: { ...settings.margins, top: parseFloat(e.target.value) || 0 } })}
                        className="w-12 px-1.5 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                        max="5"
                        title="Top margin"
                    />
                    <input
                        type="number"
                        value={settings.margins.right}
                        onChange={(e) => onUpdateSettings({ margins: { ...settings.margins, right: parseFloat(e.target.value) || 0 } })}
                        className="w-12 px-1.5 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                        max="5"
                        title="Right margin"
                    />
                    <input
                        type="number"
                        value={settings.margins.bottom}
                        onChange={(e) => onUpdateSettings({ margins: { ...settings.margins, bottom: parseFloat(e.target.value) || 0 } })}
                        className="w-12 px-1.5 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                        max="5"
                        title="Bottom margin"
                    />
                    <input
                        type="number"
                        value={settings.margins.left}
                        onChange={(e) => onUpdateSettings({ margins: { ...settings.margins, left: parseFloat(e.target.value) || 0 } })}
                        className="w-12 px-1.5 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                        max="5"
                        title="Left margin"
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Font */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Font:</label>
                <select
                    value={settings.font}
                    onChange={(e) => onUpdateSettings({ font: e.target.value as CVSettings['font'] })}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Calibri">Calibri</option>
                </select>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Font Size - Now a select with presets */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Size:</label>
                <select
                    value={settings.fontSize}
                    onChange={(e) => onUpdateSettings({ fontSize: e.target.value as CVSettings['fontSize'] })}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    {Object.entries(fontSizeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Line Spacing */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Line:</label>
                <input
                    type="number"
                    value={settings.lineSpacing}
                    onChange={(e) => onUpdateSettings({ lineSpacing: parseFloat(e.target.value) || 1.25 })}
                    className="w-14 px-1.5 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    step="0.05"
                    min="1"
                    max="2"
                />
            </div>
        </div>
    );
};

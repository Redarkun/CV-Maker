# CV Maker 📄

![Work in Progress](https://img.shields.io/badge/status-work%20in%20progress-yellow)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)

> **⚠️ This project is currently under active development. Features and APIs may change.**

Professional CV/Resume builder with real-time preview, multiple templates, and ATS-friendly exports.

## ✨ Features

### ✅ Implemented
- **Live Editor**: Real-time CV editing with drag-and-drop section reordering
- **Multi-Template System**: Save and load custom CV templates
- **Smart Suggestions**: Context-aware autocomplete for CV fields
- **Export Options**: PDF and DOCX export with print-optimized styling
- **ATS-Friendly**: Left-aligned, clean formatting without images or icons
- **Optional Sections**: Projects, Languages, Certifications, Awards (drag to activate)
- **Header Alignment**: Choose between left-aligned and centered header
- **Field Management**: Enable/disable, reorder, and customize header fields

### 🚧 In Development
- ATS Compatibility Analyzer
- More template designs
- Import from existing CVs
- Year-only date format toggle for Experience/Education

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **PDF Export**: jsPDF
- **DOCX Export**: docx
- **State Management**: React Hooks (custom)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cvmaker.git
cd cvmaker

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

1. **Edit your CV**: Fill in your information in the left panel
2. **Preview**: See live updates in the right panel
3. **Reorder sections**: Drag sections to change order
4. **Add optional sections**: Drag from "Inactive Sections" to activate
5. **Export**: Download as PDF or DOCX

## 📋 Project Structure

```
cvmaker/
├── src/
│   ├── components/        # React components
│   │   ├── Editor/       # Section editors
│   │   └── Preview/      # Preview components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── styles/           # CSS files
├── public/               # Static assets
└── package.json
```

## 🤝 Contributing

This project is currently in early development. Contributions, issues, and feature requests are welcome!

## 📝 License

MIT

## 🔗 Links

- [Report Bug](https://github.com/yourusername/cvmaker/issues)
- [Request Feature](https://github.com/yourusername/cvmaker/issues)

---

**Status**: 🟡 Work in Progress | **Last Updated**: December 2024

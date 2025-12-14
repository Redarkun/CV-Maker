import { useState, useEffect } from 'react'
import './App.css'
import { EditorView } from './views/EditorView'
import { CVPrintable } from './components/CVPrintable'
import type { CV } from './types'
import '../src/styles/cv-print.css'

function App() {
  const [view, setView] = useState<'home' | 'editor' | 'print'>('home')
  const [cvToPrint, setCVToPrint] = useState<CV | null>(null)

  const handleExportPDF = (cv: CV) => {
    // Store CV and switch to print view
    setCVToPrint(cv);
    setView('print');
  };

  // Auto-print when entering print view
  useEffect(() => {
    if (view === 'print' && cvToPrint) {
      // Small delay to ensure rendering is complete
      const timer = setTimeout(() => {
        window.print();
        // Return to editor after print dialog
        setView('editor');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [view, cvToPrint]);

  if (view === 'print' && cvToPrint) {
    return <CVPrintable cv={cvToPrint} />;
  }

  if (view === 'editor') {
    return (
      <EditorView
        onBack={() => setView('home')}
        onExport={handleExportPDF}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          CV Maker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create professional, ATS-friendly CVs in minutes
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={() => setView('editor')}
            className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            ✨ Create New CV
          </button>
          <button className="px-8 py-4 bg-gray-200 text-gray-700 text-lg rounded-lg hover:bg-gray-300 font-medium shadow-lg hover:shadow-xl transition-all">
            📊 Analyze CV
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-gray-900 mb-2">ATS-Optimized</h3>
            <p className="text-sm text-gray-600">
              Machine-readable format that passes automated screening systems
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Clean Design</h3>
            <p className="text-sm text-gray-600">
              Professional template optimized for single-page layout
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Export</h3>
            <p className="text-sm text-gray-600">
              Instant PDF generation with perfect print formatting
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

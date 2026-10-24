import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { DiagnosticTestView } from './components/diagnostic/DiagnosticTestView';
import { DiagnosticReportView } from './components/diagnostic/DiagnosticReportView';
import { AdaptiveVisualizationHub } from './components/visualizations/AdaptiveVisualizationHub';
import { FunctionalTestRunner } from './components/verification/FunctionalTestRunner';
import { FunctionSandbox } from './components/sandbox/FunctionSandbox';
import { PaperDocumentationView } from './components/paper/PaperDocumentationView';
import { OverallDiagnosticSummary, VisualizationTabType } from './types/math';

export default function App() {
  const [activeView, setActiveView] = useState<'diagnostic' | 'visualization' | 'tests' | 'sandbox' | 'paper'>('diagnostic');
  const [diagnosticMode, setDiagnosticMode] = useState<'test' | 'report'>('test');
  const [diagnosticSummary, setDiagnosticSummary] = useState<OverallDiagnosticSummary | null>(null);
  
  // Visualization configuration
  const [visTab, setVisTab] = useState<VisualizationTabType>('vlt');
  const [detectedMisconceptionName, setDetectedMisconceptionName] = useState<string | undefined>(undefined);

  const handleTestComplete = (summary: OverallDiagnosticSummary) => {
    setDiagnosticSummary(summary);
    setDiagnosticMode('report');
  };

  const handleNavigateToVisualization = (
    tab: VisualizationTabType,
    misconceptionName?: string
  ) => {
    setVisTab(tab);
    setDetectedMisconceptionName(misconceptionName);
    setActiveView('visualization');
  };

  const handleRetakeTest = () => {
    setDiagnosticMode('test');
    setActiveView('diagnostic');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'diagnostic' && !diagnosticSummary) {
            setDiagnosticMode('test');
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'diagnostic' && (
          <>
            {diagnosticMode === 'test' ? (
              <DiagnosticTestView onComplete={handleTestComplete} />
            ) : (
              diagnosticSummary && (
                <DiagnosticReportView
                  summary={diagnosticSummary}
                  onNavigateToVisualization={handleNavigateToVisualization}
                  onRetakeTest={handleRetakeTest}
                />
              )
            )}
          </>
        )}

        {activeView === 'visualization' && (
          <AdaptiveVisualizationHub
            initialTab={visTab}
            detectedMisconceptionName={detectedMisconceptionName}
          />
        )}

        {activeView === 'tests' && <FunctionalTestRunner />}

        {activeView === 'sandbox' && <FunctionSandbox />}

        {activeView === 'paper' && <PaperDocumentationView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Pendidikan Ilmu Komputer · FPMIPA · Universitas Pendidikan Indonesia (UPI)
          </div>
          <div className="flex items-center gap-4">
            <span>Yahfasyat Asabir Abuya</span>
            <span aria-hidden="true">·</span>
            <span>Muhammad Aqsah Aufasyaif</span>
            <span aria-hidden="true">·</span>
            <span>Leonard Gilardino</span>
          </div>
          <div>Menuju Education 5.0</div>
        </div>
      </footer>
    </div>
  );
}

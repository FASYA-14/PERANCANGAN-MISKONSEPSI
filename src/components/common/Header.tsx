import React from 'react';

interface Props {
  activeView: 'diagnostic' | 'visualization' | 'tests' | 'sandbox' | 'paper';
  onNavigate: (view: 'diagnostic' | 'visualization' | 'tests' | 'sandbox' | 'paper') => void;
}

export const Header: React.FC<Props> = ({ activeView, onNavigate }) => {
  return (
    <>
      <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onNavigate('diagnostic')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left hover:text-indigo-600 transition-colors"
        >
          SmartFunc 5.0
        </button>

        {/* Zone 2: Navigation links for desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('diagnostic')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'diagnostic' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
            }`}
          >
            Tes Diagnostik
          </button>

          <button
            onClick={() => onNavigate('visualization')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'visualization' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
            }`}
          >
            Visualisasi Adaptif
          </button>

          <button
            onClick={() => onNavigate('tests')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'tests' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
            }`}
          >
            Uji Fungsional
          </button>

          <button
            onClick={() => onNavigate('sandbox')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'sandbox' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
            }`}
          >
            Kalkulator Grafik
          </button>

          <button
            onClick={() => onNavigate('paper')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'paper' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
            }`}
          >
            Makalah UPI
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('diagnostic')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Mulai Diagnosis
          </button>
        </div>
      </header>

      {/* Sub-header navigation on mobile devices */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
        <button
          onClick={() => onNavigate('diagnostic')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeView === 'diagnostic' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:text-slate-900'
          }`}
        >
          Tes Diagnostik
        </button>
        <button
          onClick={() => onNavigate('visualization')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeView === 'visualization' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:text-slate-900'
          }`}
        >
          Visualisasi Adaptif
        </button>
        <button
          onClick={() => onNavigate('tests')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeView === 'tests' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:text-slate-900'
          }`}
        >
          Uji Fungsional
        </button>
        <button
          onClick={() => onNavigate('sandbox')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeView === 'sandbox' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:text-slate-900'
          }`}
        >
          Kalkulator Grafik
        </button>
        <button
          onClick={() => onNavigate('paper')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeView === 'paper' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:text-slate-900'
          }`}
        >
          Makalah UPI
        </button>
      </div>
    </>
  );
};

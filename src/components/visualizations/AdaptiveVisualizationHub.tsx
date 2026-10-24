import React, { useState } from 'react';
import { VerticalLineTestVisualizer } from './VerticalLineTestVisualizer';
import { DomainRangeVisualizer } from './DomainRangeVisualizer';
import { ParameterTransformationVisualizer } from './ParameterTransformationVisualizer';
import { NotationInterpretationVisualizer } from './NotationInterpretationVisualizer';
import { DerivativeVisualizer } from './DerivativeVisualizer';
import { VisualizationTabType } from '../../types/math';
import { Compass, SplitSquareVertical, Sliders, Type, LineChart } from 'lucide-react';

interface Props {
  initialTab?: VisualizationTabType;
  detectedMisconceptionName?: string;
}

export const AdaptiveVisualizationHub: React.FC<Props> = ({
  initialTab = 'vlt',
  detectedMisconceptionName
}) => {
  const [activeTab, setActiveTab] = useState<VisualizationTabType>(initialTab);

  return (
    <div className="space-y-6">
      {/* Adaptive Recommendation Banner (if routed from diagnostic) */}
      {detectedMisconceptionName && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
          <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">
              Umpan Balik Adaptif Berdasarkan Diagnosis
            </div>
            <div className="text-sm text-indigo-950 font-medium">
              Sistem secara otomatis mengarahkan Anda ke modul ini untuk meremediasi:{' '}
              <span className="text-indigo-700 font-bold underline decoration-indigo-400">
                {detectedMisconceptionName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('vlt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'vlt'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SplitSquareVertical className="w-4 h-4" />
          1. Uji Garis Vertikal (VLT)
        </button>

        <button
          onClick={() => setActiveTab('domain-range')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'domain-range'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          2. Eksplorasi Domain & Range
        </button>

        <button
          onClick={() => setActiveTab('parameters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'parameters'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          3. Transformasi Parameter
        </button>

        <button
          onClick={() => setActiveTab('notation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'notation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Type className="w-4 h-4" />
          4. Jembatan Notasi f(a)
        </button>

        <button
          onClick={() => setActiveTab('derivatives')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'derivatives'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <LineChart className="w-4 h-4" />
          5. Turunan & Garis Singgung
        </button>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'vlt' && <VerticalLineTestVisualizer />}
        {activeTab === 'domain-range' && <DomainRangeVisualizer />}
        {activeTab === 'parameters' && <ParameterTransformationVisualizer />}
        {activeTab === 'notation' && <NotationInterpretationVisualizer />}
        {activeTab === 'derivatives' && <DerivativeVisualizer />}
      </div>
    </div>
  );
};

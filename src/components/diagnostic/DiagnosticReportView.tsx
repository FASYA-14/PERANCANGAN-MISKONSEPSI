import React from 'react';
import { OverallDiagnosticSummary, VisualizationTabType } from '../../types/math';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Compass,
  FileCheck
} from 'lucide-react';

interface Props {
  summary: OverallDiagnosticSummary;
  onNavigateToVisualization: (tab: VisualizationTabType, misconceptionName?: string) => void;
  onRetakeTest: () => void;
}

export const DiagnosticReportView: React.FC<Props> = ({
  summary,
  onNavigateToVisualization,
  onRetakeTest
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Verdict Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              Laporan Analisis Diagnosis Empat Tingkat
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Profil Pemahaman Konsep Fungsi Matematika
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRetakeTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ulangi Tes
            </button>
            <button
              onClick={() => onNavigateToVisualization(summary.recommendedStartingTab)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Buka Visualisasi Adaptif
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Category Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
            <div className="text-2xl font-bold text-emerald-700 font-mono">
              {summary.soundUnderstandingCount}
            </div>
            <div className="text-xs font-semibold text-emerald-900 mt-1">
              Paham Konsep (SU)
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Jawaban & Alasan Benar (Yakin)</div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-center">
            <div className="text-2xl font-bold text-rose-700 font-mono">
              {summary.misconceptionCount}
            </div>
            <div className="text-xs font-semibold text-rose-900 mt-1">
              Miskonsepsi (MC)
            </div>
            <div className="text-[11px] text-rose-600 mt-0.5">Alasan/Jawaban Salah (Yakin Tinggi)</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
            <div className="text-2xl font-bold text-amber-700 font-mono">
              {summary.partialCount}
            </div>
            <div className="text-xs font-semibold text-amber-900 mt-1">
              Paham Sebagian (PU)
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5">Sebagian benar / False Positive</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
            <div className="text-2xl font-bold text-slate-700 font-mono">
              {summary.lackOfKnowledgeCount}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-1">
              Kurang Paham (LK)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tebakan / Keyakinan Rendah</div>
          </div>
        </div>
      </div>

      {/* Primary Misconceptions Detected */}
      {summary.primaryMisconceptions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Miskonsepsi Terdeteksi yang Memerlukan Remediasi Visual:
          </h3>
          <div className="space-y-3">
            {summary.primaryMisconceptions.map((mc, idx) => (
              <div
                key={mc.code}
                className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-rose-950">
                      {idx + 1}. {mc.name}
                    </span>
                    <span className="text-[11px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-mono font-semibold">
                      {mc.count} Butir Soal
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed max-w-2xl">
                    {mc.description}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToVisualization(mc.recommendedTab, mc.name)}
                  className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  Buka Visualisasi Terkait
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item-by-Item Diagnostic Trace */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          Rincian Hasil Diagnostik per Butir Soal (T1 - T4):
        </h3>

        <div className="space-y-3">
          {summary.detailedResults.map((result, idx) => {
            const isSound = result.category === 'SOUND_UNDERSTANDING';
            const isMisconception = result.category === 'MISCONCEPTION';
            const isPartial = result.category === 'PARTIAL_UNDERSTANDING';

            return (
              <div
                key={result.questionId}
                className={`border rounded-xl p-4 transition-all ${
                  isSound
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : isMisconception
                    ? 'border-rose-200 bg-rose-50/40'
                    : isPartial
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200/60 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      Soal {idx + 1}:
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {result.conceptArea}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      isSound
                        ? 'bg-emerald-100 text-emerald-800'
                        : isMisconception
                        ? 'bg-rose-100 text-rose-800'
                        : isPartial
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {result.categoryLabel}
                  </span>
                </div>

                {/* 4-Tier Breakdown Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-1">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-400">Tier 1: Jawaban</div>
                    <div className={`font-semibold ${result.tier1Correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {result.tier1Correct ? '✓ Benar' : '✗ Keliru'}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-400">Tier 2: Keyakinan</div>
                    <div className="font-semibold text-slate-800">
                      {result.tier2HighConfidence ? 'Yakin (CRI ≥ 4)' : 'Ragu (CRI ≤ 3)'}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-400">Tier 3: Alasan</div>
                    <div className={`font-semibold ${result.tier3Correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {result.tier3Correct ? '✓ Benar' : '✗ Keliru/Miskonsepsi'}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-400">Tier 4: Keyakinan</div>
                    <div className="font-semibold text-slate-800">
                      {result.tier4HighConfidence ? 'Yakin (CRI ≥ 4)' : 'Ragu (CRI ≤ 3)'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <strong>Umpan Balik:</strong> {result.pedagogicalAdvice}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/50 flex justify-end">
                  <button
                    onClick={() => onNavigateToVisualization(result.recommendedVisualizationTab)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                  >
                    Buka visualisasi modul ini
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

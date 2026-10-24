import React, { useState } from 'react';
import { DIAGNOSTIC_QUESTIONS } from '../../data/diagnosticQuestions';
import { StudentResponse, OverallDiagnosticSummary } from '../../types/math';
import { evaluateDiagnosticResponses } from '../../engine/diagnosticEngine';
import { CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (summary: OverallDiagnosticSummary) => void;
}

const CONFIDENCE_LEVELS = [
  { value: 1, label: '1 - Sangat Tidak Yakin (Menebak)' },
  { value: 2, label: '2 - Kurang Yakin' },
  { value: 3, label: '3 - Cukup Yakin' },
  { value: 4, label: '4 - Yakin' },
  { value: 5, label: '5 - Sangat Yakin (Paham)' },
];

export const DiagnosticTestView: React.FC<Props> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [responses, setResponses] = useState<StudentResponse[]>(() =>
    DIAGNOSTIC_QUESTIONS.map((q) => ({
      questionId: q.id,
      tier1SelectedOptionId: null,
      tier2Confidence: 3,
      tier3SelectedReasonId: null,
      tier4Confidence: 3
    }))
  );

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];
  const currentResp = responses[currentIdx];

  const updateResponse = (updates: Partial<StudentResponse>) => {
    setResponses((prev) =>
      prev.map((r, i) => (i === currentIdx ? { ...r, ...updates } : r))
    );
  };

  const handleNext = () => {
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Evaluate test
      const summary = evaluateDiagnosticResponses(responses);
      if (summary.soundUnderstandingCount >= 3) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
      onComplete(summary);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Quick Preset Simulations for Evaluators
  const loadPreset = (presetType: 'sound' | 'misconceptions' | 'derivatives' | 'guessing') => {
    if (presetType === 'sound') {
      // High confidence, right answers, right reasons
      setResponses([
        { questionId: 'q1', tier1SelectedOptionId: 'q1_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q1_rsn_a', tier4Confidence: 5 },
        { questionId: 'q2', tier1SelectedOptionId: 'q2_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q2_rsn_a', tier4Confidence: 5 },
        { questionId: 'q3', tier1SelectedOptionId: 'q3_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q3_rsn_a', tier4Confidence: 5 },
        { questionId: 'q4', tier1SelectedOptionId: 'q4_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q4_rsn_a', tier4Confidence: 5 },
        { questionId: 'q5', tier1SelectedOptionId: 'q5_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q5_rsn_a', tier4Confidence: 5 },
        { questionId: 'q6', tier1SelectedOptionId: 'q6_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q6_rsn_a', tier4Confidence: 5 },
      ]);
    } else if (presetType === 'misconceptions') {
      // Systematic misconception choices across topics
      setResponses([
        { questionId: 'q1', tier1SelectedOptionId: 'q1_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q1_rsn_b', tier4Confidence: 5 },
        { questionId: 'q2', tier1SelectedOptionId: 'q2_opt_b', tier2Confidence: 4, tier3SelectedReasonId: 'q2_rsn_b', tier4Confidence: 5 },
        { questionId: 'q3', tier1SelectedOptionId: 'q3_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q3_rsn_b', tier4Confidence: 5 },
        { questionId: 'q4', tier1SelectedOptionId: 'q4_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q4_rsn_b', tier4Confidence: 5 },
        { questionId: 'q5', tier1SelectedOptionId: 'q5_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q5_rsn_b', tier4Confidence: 5 },
        { questionId: 'q6', tier1SelectedOptionId: 'q6_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q6_rsn_b', tier4Confidence: 5 },
      ]);
    } else if (presetType === 'derivatives') {
      // Focus on derivative misconceptions (MC_DERIVATIVE_TANGENT_CONFUSION & MC_CONTINUITY_IMPLIES_DIFF)
      setResponses([
        { questionId: 'q1', tier1SelectedOptionId: 'q1_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q1_rsn_a', tier4Confidence: 5 },
        { questionId: 'q2', tier1SelectedOptionId: 'q2_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q2_rsn_a', tier4Confidence: 5 },
        { questionId: 'q3', tier1SelectedOptionId: 'q3_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q3_rsn_a', tier4Confidence: 5 },
        { questionId: 'q4', tier1SelectedOptionId: 'q4_opt_a', tier2Confidence: 5, tier3SelectedReasonId: 'q4_rsn_a', tier4Confidence: 5 },
        { questionId: 'q5', tier1SelectedOptionId: 'q5_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q5_rsn_b', tier4Confidence: 5 },
        { questionId: 'q6', tier1SelectedOptionId: 'q6_opt_b', tier2Confidence: 5, tier3SelectedReasonId: 'q6_rsn_b', tier4Confidence: 5 },
      ]);
    } else {
      // Guessing (Lack of knowledge)
      setResponses([
        { questionId: 'q1', tier1SelectedOptionId: 'q1_opt_c', tier2Confidence: 1, tier3SelectedReasonId: 'q1_rsn_d', tier4Confidence: 1 },
        { questionId: 'q2', tier1SelectedOptionId: 'q2_opt_c', tier2Confidence: 2, tier3SelectedReasonId: 'q2_rsn_c', tier4Confidence: 2 },
        { questionId: 'q3', tier1SelectedOptionId: 'q3_opt_c', tier2Confidence: 1, tier3SelectedReasonId: 'q3_rsn_c', tier4Confidence: 1 },
        { questionId: 'q4', tier1SelectedOptionId: 'q4_opt_c', tier2Confidence: 2, tier3SelectedReasonId: 'q4_rsn_c', tier4Confidence: 2 },
        { questionId: 'q5', tier1SelectedOptionId: 'q5_opt_c', tier2Confidence: 1, tier3SelectedReasonId: 'q5_rsn_c', tier4Confidence: 2 },
        { questionId: 'q6', tier1SelectedOptionId: 'q6_opt_c', tier2Confidence: 2, tier3SelectedReasonId: 'q6_rsn_c', tier4Confidence: 1 },
      ]);
    }
  };

  const isCurrentComplete =
    currentResp.tier1SelectedOptionId !== null && currentResp.tier3SelectedReasonId !== null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            Instrumen Diagnostik Empat Tingkat (Four-Tier Diagnostic Test)
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Evaluasi Pemahaman & Deteksi Miskonsepsi Konsep Fungsi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Menggabungkan pilihan jawaban, alasan matematis, dan Certainty of Response Index (CRI) 
            sesuai rancangan Oat-ngam & Chaimongkol (2024).
          </p>
        </div>

        {/* Quick Simulation Presets for Evaluator */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium px-2 text-[11px]">
            Skenario Uji Evaluator:
          </span>
          <button
            onClick={() => loadPreset('sound')}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-emerald-800 rounded font-medium transition-colors active:scale-98"
          >
            Paham Konsep
          </button>
          <button
            onClick={() => loadPreset('misconceptions')}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-rose-800 rounded font-medium transition-colors active:scale-98"
          >
            Miskonsepsi Umum
          </button>
          <button
            onClick={() => loadPreset('derivatives')}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-indigo-800 rounded font-medium transition-colors active:scale-98"
          >
            Miskonsepsi Turunan
          </button>
          <button
            onClick={() => loadPreset('guessing')}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded font-medium transition-colors active:scale-98"
          >
            Tebakan
          </button>
        </div>
      </div>

      {/* Item Pagination Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
            const isAnswered =
              responses[idx].tier1SelectedOptionId && responses[idx].tier3SelectedReasonId;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Soal {currentIdx + 1} dari {DIAGNOSTIC_QUESTIONS.length}
        </div>
      </div>

      {/* Main Question Card with 4 Tiers */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-semibold text-indigo-600">
            {currentQ.title}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            {currentQ.tier1.prompt}
          </h3>
          {currentQ.tier1.mathExpression && (
            <div className="mt-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm text-indigo-950 inline-block font-semibold">
              {currentQ.tier1.mathExpression}
            </div>
          )}
        </div>

        {/* TIER 1: Pilihan Jawaban */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px]">
              1
            </span>
            Tingkat 1 (Tier 1): Pilihan Jawaban Konseptual
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.tier1.options.map((opt) => {
              const isSelected = currentResp.tier1SelectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateResponse({ tier1SelectedOptionId: opt.id })}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-medium shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TIER 2: Tingkat Keyakinan Jawaban (CRI) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px]">
              2
            </span>
            Tingkat 2 (Tier 2): Keyakinan Terhadap Jawaban di Atas (Certainty of Response Index)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {CONFIDENCE_LEVELS.map((lvl) => {
              const isSelected = currentResp.tier2Confidence === lvl.value;
              return (
                <button
                  key={lvl.value}
                  onClick={() => updateResponse({ tier2Confidence: lvl.value })}
                  className={`p-2.5 rounded-lg border text-xs text-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">{lvl.value}</div>
                  <div className="text-[10px] opacity-90 mt-0.5 truncate">
                    {lvl.value <= 2 ? 'Ragu/Menebak' : lvl.value === 3 ? 'Cukup Yakin' : 'Yakin'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TIER 3: Pilihan Alasan Matematis */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px]">
              3
            </span>
            Tingkat 3 (Tier 3): Alasan / Justifikasi Matematis
          </div>
          <div className="text-xs text-slate-600 mb-1">{currentQ.tier3.prompt}</div>
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.tier3.reasons.map((rsn) => {
              const isSelected = currentResp.tier3SelectedReasonId === rsn.id;
              return (
                <button
                  key={rsn.id}
                  onClick={() => updateResponse({ tier3SelectedReasonId: rsn.id })}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-medium shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>{rsn.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TIER 4: Tingkat Keyakinan Alasan (CRI) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px]">
              4
            </span>
            Tingkat 4 (Tier 4): Keyakinan Terhadap Alasan Matematis di Atas
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {CONFIDENCE_LEVELS.map((lvl) => {
              const isSelected = currentResp.tier4Confidence === lvl.value;
              return (
                <button
                  key={lvl.value}
                  onClick={() => updateResponse({ tier4Confidence: lvl.value })}
                  className={`p-2.5 rounded-lg border text-xs text-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">{lvl.value}</div>
                  <div className="text-[10px] opacity-90 mt-0.5 truncate">
                    {lvl.value <= 2 ? 'Ragu/Menebak' : lvl.value === 3 ? 'Cukup Yakin' : 'Yakin'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border ${
              currentIdx === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentComplete}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm ${
              !isCurrentComplete
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {currentIdx === DIAGNOSTIC_QUESTIONS.length - 1 ? (
              <>
                Selesaikan Diagnosis & Buka Hasil
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                Lanjut ke Soal Berikutnya
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

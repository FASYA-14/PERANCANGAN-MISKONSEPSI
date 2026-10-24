import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import {
  StudentResponse,
  QuestionDiagnosisResult,
  OverallDiagnosticSummary,
  UnderstandingCategory,
  MisconceptionCode,
  ConceptAreaType,
  VisualizationTabType
} from '../types/math';

/**
 * Evaluates a student's responses using the Four-Tier Diagnostic decision rules
 * described in Section 3.3 of the UPI research paper, expanded for Derivatives & Functions.
 */
export function evaluateDiagnosticResponses(responses: StudentResponse[]): OverallDiagnosticSummary {
  const detailedResults: QuestionDiagnosisResult[] = [];

  let soundUnderstandingCount = 0;
  let misconceptionCount = 0;
  let partialCount = 0;
  let lackOfKnowledgeCount = 0;

  const misconceptionCounts: Record<MisconceptionCode, { count: number; name: string; description: string; tab: VisualizationTabType }> = {
    MC_VERTICAL_LINE_FAILURE: {
      count: 0,
      name: 'Miskonsepsi Uji Garis Vertikal & Relasi',
      description: 'Siswa menganggap kurva multi-nilai atau kurva kontinu apa pun sebagai fungsi, belum menginternalisasi syarat satu input x tepat satu output y.',
      tab: 'vlt'
    },
    MC_DOMAIN_RANGE_INVERSION: {
      count: 0,
      name: 'Miskonsepsi Domain & Range Tertukar',
      description: 'Siswa menukar himpunan masukan (sumbu-x) dengan himpunan keluaran (sumbu-y), atau menyamakan domain dengan nilai konstan.',
      tab: 'domain-range'
    },
    MC_DOMAIN_RESTRICTION_OMISSION: {
      count: 0,
      name: 'Miskonsepsi Pengabaian Syarat Domain',
      description: 'Siswa mengabaikan pembatasan daerah asal (misalnya penyebut pecahan ≠ 0 atau nilai di bawah akar ≥ 0).',
      tab: 'domain-range'
    },
    MC_HORIZONTAL_SHIFT_INVERSION: {
      count: 0,
      name: 'Miskonsepsi Arah Translasi Horizontal',
      description: 'Siswa mengira tanda minus pada f(x - h) berarti grafik bergeser ke kiri (arah negatif), padahal grafik bergeser ke kanan.',
      tab: 'parameters'
    },
    MC_NOTATION_MULTIPLICATION: {
      count: 0,
      name: 'Miskonsepsi Notasi Perkalian f(x)',
      description: 'Siswa menganggap notasi fungsi f(a) adalah operasi perkalian aljabar f × a alih-alih lambang mesin pemetaan input ke output.',
      tab: 'notation'
    },
    MC_DERIVATIVE_TANGENT_CONFUSION: {
      count: 0,
      name: 'Miskonsepsi Nilai Turunan vs Nilai Fungsi',
      description: 'Siswa menyamakan nilai turunan f\'(a) dengan nilai ketinggian fungsi f(a), atau mengira garis singgung hanya boleh menyentuh kurva di tepat satu titik secara global.',
      tab: 'derivatives'
    },
    MC_CONTINUITY_IMPLIES_DIFF: {
      count: 0,
      name: 'Miskonsepsi Kontinuitas Implikasikan Keterdiferensialan',
      description: 'Siswa mengira setiap fungsi yang kontinu (tanpa terputus) pasti memiliki turunan di seluruh titik, mengabaikan adanya titik sudut tajam (corner/cusp) seperti pada |x|.',
      tab: 'derivatives'
    },
    MC_DERIVATIVE_SIGN_VALUE_CONFUSION: {
      count: 0,
      name: 'Miskonsepsi Hubungan Tanda Turunan & Grafik',
      description: 'Siswa mengacaukan kemiringan garis singgung dengan titik potong sumbu koordinat atau mengira tanda f\'(x) mewakili posisi kurva di atas sumbu-x.',
      tab: 'derivatives'
    },
    MC_NONE: {
      count: 0,
      name: 'Tidak Terdeteksi Miskonsepsi',
      description: 'Pemahaman siswa selaras dengan konsep matematika yang benar.',
      tab: 'vlt'
    }
  };

  for (const question of DIAGNOSTIC_QUESTIONS) {
    const studentResp = responses.find((r) => r.questionId === question.id);

    if (!studentResp || !studentResp.tier1SelectedOptionId || !studentResp.tier3SelectedReasonId) {
      detailedResults.push({
        questionId: question.id,
        conceptArea: question.conceptArea,
        category: 'LACK_OF_KNOWLEDGE',
        categoryLabel: 'Belum Dijawab Lengkap',
        tier1Correct: false,
        tier3Correct: false,
        tier2HighConfidence: false,
        tier4HighConfidence: false,
        pedagogicalAdvice: 'Siswa belum melengkapi respons empat tingkat untuk butir ini.',
        recommendedVisualizationTab: getRecommendedTabForConcept(question.conceptArea)
      });
      lackOfKnowledgeCount++;
      continue;
    }

    const selectedOpt = question.tier1.options.find((o) => o.id === studentResp.tier1SelectedOptionId);
    const selectedRsn = question.tier3.reasons.find((r) => r.id === studentResp.tier3SelectedReasonId);

    const t1Correct = !!selectedOpt?.isCorrect;
    const t3Correct = !!selectedRsn?.isCorrect;
    const t2HighConfidence = studentResp.tier2Confidence >= 4;
    const t4HighConfidence = studentResp.tier4Confidence >= 4;

    let category: UnderstandingCategory = 'LACK_OF_KNOWLEDGE';
    let categoryLabel = 'Belum Paham / Tebakan (Lack of Knowledge)';
    let diagnosedMisconception: MisconceptionCode | undefined = undefined;
    let pedagogicalAdvice = '';

    const detectedMc = selectedRsn?.misconceptionCode || selectedOpt?.misconceptionCode;

    // Four-Tier Rule Classification Matrix
    if (t1Correct && t3Correct) {
      if (t2HighConfidence && t4HighConfidence) {
        category = 'SOUND_UNDERSTANDING';
        categoryLabel = 'Paham Konsep Kuat (Sound Understanding)';
        soundUnderstandingCount++;
        pedagogicalAdvice = 'Luar biasa! Anda memahami konsep dengan tepat dan memiliki keyakinan kokoh pada jawaban maupun alasan matematis Anda.';
      } else {
        category = 'PARTIAL_UNDERSTANDING';
        categoryLabel = 'Paham tapi Kurang Yakin (Partial / Unconfident)';
        partialCount++;
        pedagogicalAdvice = 'Jawaban dan alasan Anda sudah benar, namun tingkat keyakinan masih rendah. Eksplorasi visualisasi interaktif akan memperkuat pemahaman intuitif Anda.';
      }
    } else if (!t1Correct && !t3Correct) {
      if (t2HighConfidence && t4HighConfidence && detectedMc) {
        category = 'MISCONCEPTION';
        categoryLabel = 'Miskonsepsi Kuat (Genuine Misconception)';
        misconceptionCount++;
        diagnosedMisconception = detectedMc;
        misconceptionCounts[detectedMc].count++;
        pedagogicalAdvice = `Terdeteksi miskonsepsi spesifik: ${misconceptionCounts[detectedMc].name}. Anda sangat yakin dengan pemikiran ini, namun ada kekeliruan prinsip dasar yang dapat diperbaiki melalui pengamatan grafik interaktif.`;
      } else if (!t2HighConfidence && !t4HighConfidence) {
        category = 'LACK_OF_KNOWLEDGE';
        categoryLabel = 'Belum Memahami / Menebak (Lack of Knowledge)';
        lackOfKnowledgeCount++;
        pedagogicalAdvice = 'Anda belum menguasai konsep ini dan menyadari ketidakyakinan Anda. Ini wajar dalam proses belajar, mari telaah visualisasinya bersama.';
      } else {
        category = 'PARTIAL_UNDERSTANDING';
        categoryLabel = 'Miskonsepsi / Kebingungan Awal';
        misconceptionCount++;
        if (detectedMc) {
          diagnosedMisconception = detectedMc;
          misconceptionCounts[detectedMc].count++;
        }
        pedagogicalAdvice = 'Terdapat kontradiksi antara keyakinan dan pilihan justifikasi Anda. Perhatikan bagaimana representasi simbolik terhubung dengan grafik.';
      }
    } else if (t1Correct && !t3Correct) {
      // False Positive (Right answer, wrong reason)
      if (t4HighConfidence && detectedMc) {
        category = 'MISCONCEPTION';
        categoryLabel = 'Miskonsepsi Tersembunyi (False Positive)';
        misconceptionCount++;
        diagnosedMisconception = detectedMc;
        misconceptionCounts[detectedMc].count++;
        pedagogicalAdvice = 'Jawaban Anda benar tetapi alasan yang mendasarinya keliru dengan keyakinan tinggi. Miskonsepsi terselubung ini perlu diluruskan.';
      } else {
        category = 'PARTIAL_UNDERSTANDING';
        categoryLabel = 'Paham Sebagian / Tebakan Beruntung';
        partialCount++;
        pedagogicalAdvice = 'Anda memilih jawaban yang benar namun alasan pendukungnya belum tepat. Perhatikan alasan formal di modul visualisasi.';
      }
    } else {
      // False Negative (!t1Correct && t3Correct)
      if (t2HighConfidence) {
        category = 'PARTIAL_UNDERSTANDING';
        categoryLabel = 'Paham Parsial (False Negative)';
        partialCount++;
        pedagogicalAdvice = 'Alasan teoritis Anda sudah tepat, namun terjadi kesalahan dalam menarik kesimpulan pada pilihan jawaban.';
      } else {
        category = 'LACK_OF_KNOWLEDGE';
        categoryLabel = 'Belum Memahami Konsep';
        lackOfKnowledgeCount++;
        pedagogicalAdvice = 'Tingkat pemahaman masih belum konsisten pada butir ini.';
      }
    }

    const recommendedTab = getRecommendedTabForConcept(question.conceptArea, diagnosedMisconception);

    detailedResults.push({
      questionId: question.id,
      conceptArea: question.conceptArea,
      category,
      categoryLabel,
      tier1Correct: t1Correct,
      tier3Correct: t3Correct,
      tier2HighConfidence: t2HighConfidence,
      tier4HighConfidence: t4HighConfidence,
      diagnosedMisconception,
      misconceptionDescription: diagnosedMisconception ? misconceptionCounts[diagnosedMisconception].description : undefined,
      pedagogicalAdvice,
      recommendedVisualizationTab: recommendedTab
    });
  }

  // Find top detected misconceptions
  const primaryMisconceptions = Object.entries(misconceptionCounts)
    .filter(([code, data]) => code !== 'MC_NONE' && data.count > 0)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([code, data]) => ({
      code: code as MisconceptionCode,
      name: data.name,
      count: data.count,
      description: data.description,
      recommendedTab: data.tab
    }));

  let recommendedStartingTab: VisualizationTabType = 'vlt';
  if (primaryMisconceptions.length > 0) {
    recommendedStartingTab = primaryMisconceptions[0].recommendedTab;
  } else {
    const firstNonSound = detailedResults.find((r) => r.category !== 'SOUND_UNDERSTANDING');
    if (firstNonSound) {
      recommendedStartingTab = firstNonSound.recommendedVisualizationTab;
    }
  }

  return {
    totalQuestions: DIAGNOSTIC_QUESTIONS.length,
    soundUnderstandingCount,
    misconceptionCount,
    partialCount,
    lackOfKnowledgeCount,
    primaryMisconceptions,
    detailedResults,
    recommendedStartingTab
  };
}

function getRecommendedTabForConcept(
  conceptArea: ConceptAreaType,
  misconception?: MisconceptionCode
): VisualizationTabType {
  if (misconception === 'MC_VERTICAL_LINE_FAILURE') return 'vlt';
  if (misconception === 'MC_DOMAIN_RANGE_INVERSION' || misconception === 'MC_DOMAIN_RESTRICTION_OMISSION') return 'domain-range';
  if (misconception === 'MC_HORIZONTAL_SHIFT_INVERSION') return 'parameters';
  if (misconception === 'MC_NOTATION_MULTIPLICATION') return 'notation';
  if (
    misconception === 'MC_DERIVATIVE_TANGENT_CONFUSION' ||
    misconception === 'MC_CONTINUITY_IMPLIES_DIFF' ||
    misconception === 'MC_DERIVATIVE_SIGN_VALUE_CONFUSION'
  ) {
    return 'derivatives';
  }

  switch (conceptArea) {
    case 'RELASI_FUNGSI':
      return 'vlt';
    case 'DOMAIN_RANGE':
      return 'domain-range';
    case 'TRANSFORMASI_PARAMETER':
      return 'parameters';
    case 'NOTASI_INTERPRETASI':
      return 'notation';
    case 'TURUNAN_FUNGSI':
      return 'derivatives';
    default:
      return 'vlt';
  }
}

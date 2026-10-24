/**
 * Types for Mathematical Function Misconception Analysis & Adaptive Visualization
 * Based on UPI FPMIPA Research Paper (Education 5.0)
 */

export type UnderstandingCategory = 
  | 'SOUND_UNDERSTANDING'    // Paham Konsep (SU)
  | 'MISCONCEPTION'          // Miskonsepsi (MC)
  | 'PARTIAL_UNDERSTANDING'  // Paham Sebagian / False Positive / False Negative
  | 'LACK_OF_KNOWLEDGE';     // Tidak / Belum Paham (LK)

export type MisconceptionCode =
  | 'MC_VERTICAL_LINE_FAILURE'          // Menganggap kurva multi-nilai sebagai fungsi
  | 'MC_DOMAIN_RANGE_INVERSION'         // Menukar sumbu-x (domain) dengan sumbu-y (range)
  | 'MC_DOMAIN_RESTRICTION_OMISSION'    // Mengabaikan syarat penyebut != 0 atau akar >= 0
  | 'MC_HORIZONTAL_SHIFT_INVERSION'     // Mengira (x-h) bergeser ke kiri untuk h positif
  | 'MC_NOTATION_MULTIPLICATION'        // Menganggap f(a) adalah f dikali a
  | 'MC_DERIVATIVE_TANGENT_CONFUSION'   // Menyamakan nilai turunan f'(a) dengan nilai fungsi f(a)
  | 'MC_CONTINUITY_IMPLIES_DIFF'        // Mengira semua fungsi kontinu pasti memiliki turunan (mengabaikan titik sudut/tajam)
  | 'MC_DERIVATIVE_SIGN_VALUE_CONFUSION'// Mengira tanda f'(x) mewakili posisi f(x) di atas sumbu-x
  | 'MC_NONE';

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionCode?: MisconceptionCode;
  explanation: string;
}

export interface DiagnosticReason {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionCode?: MisconceptionCode;
  explanation: string;
}

export type ConceptAreaType =
  | 'RELASI_FUNGSI'
  | 'DOMAIN_RANGE'
  | 'TRANSFORMASI_PARAMETER'
  | 'NOTASI_INTERPRETASI'
  | 'TURUNAN_FUNGSI';

export type VisualizationTabType = 'vlt' | 'domain-range' | 'parameters' | 'notation' | 'derivatives';

export interface DiagnosticQuestion {
  id: string;
  conceptArea: ConceptAreaType;
  title: string;
  tier1: {
    prompt: string;
    mathExpression?: string;
    graphType?: string;
    options: DiagnosticOption[];
  };
  tier3: {
    prompt: string;
    reasons: DiagnosticReason[];
  };
}

export interface StudentResponse {
  questionId: string;
  tier1SelectedOptionId: string | null;
  tier2Confidence: number; // 1 to 5
  tier3SelectedReasonId: string | null;
  tier4Confidence: number; // 1 to 5
}

export interface QuestionDiagnosisResult {
  questionId: string;
  conceptArea: ConceptAreaType;
  category: UnderstandingCategory;
  categoryLabel: string;
  tier1Correct: boolean;
  tier3Correct: boolean;
  tier2HighConfidence: boolean;
  tier4HighConfidence: boolean;
  diagnosedMisconception?: MisconceptionCode;
  misconceptionDescription?: string;
  pedagogicalAdvice: string;
  recommendedVisualizationTab: VisualizationTabType;
}

export interface OverallDiagnosticSummary {
  totalQuestions: number;
  soundUnderstandingCount: number;
  misconceptionCount: number;
  partialCount: number;
  lackOfKnowledgeCount: number;
  primaryMisconceptions: {
    code: MisconceptionCode;
    name: string;
    count: number;
    description: string;
    recommendedTab: VisualizationTabType;
  }[];
  detailedResults: QuestionDiagnosisResult[];
  recommendedStartingTab: VisualizationTabType;
}

export interface FunctionalTestCase {
  id: 'U-01' | 'U-02' | 'U-03' | 'U-04' | 'U-05' | 'U-06';
  name: string;
  inputDescription: string;
  expectedResult: string;
  status: 'Belum diuji' | 'Lulus (Passed)' | 'Gagal (Failed)';
  actualOutput?: string;
  testedAt?: string;
  testDetails: string;
}

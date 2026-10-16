export type UserPlan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
}

export type DiagnosisCategory =
  | 'appliances'
  | 'automotive'
  | 'electronics'
  | 'plumbing'
  | 'computers'
  | 'general';

export type DiagnosisStatus =
  | 'DRAFT'
  | 'ANALYZING'
  | 'COMPLETED'
  | 'FAILED'
  | 'FOLLOW_UP_REQUIRED';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DiagnosisImage {
  id: string;
  sessionId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface PossibleCause {
  title: string;
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  supportingEvidence: string;
}

export interface FollowUpQuestion {
  id: string;
  sessionId: string;
  questionText: string;
  questionType: 'TEXT' | 'CHOICE' | 'YES_NO';
  options?: string[];
  answerText?: string | null;
  answeredAt?: string | null;
  createdAt: string;
}

export interface AnalysisResult {
  id: string;
  sessionId: string;
  detectedObject: string;
  detectedCategory: string;
  visibleEvidence: string[];
  possibleCauses: PossibleCause[];
  safeNextSteps: string[];
  toolsNeeded: string[];
  partsNeeded: string[];
  professionalRecommended: boolean;
  urgencyLevel: UrgencyLevel;
  safetyWarnings: string[];
  confidenceAssessment: string;
  isEvidenceSufficient: boolean;
  modelUsed: string;
  promptVersion: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  userId: string;
  isUseful: boolean;
  problemResolved: boolean;
  actualOutcome?: string | null;
  userComment?: string | null;
  createdAt: string;
}

export interface DiagnosisSession {
  id: string;
  userId: string;
  title: string;
  category: DiagnosisCategory;
  description?: string | null;
  deviceModel?: string | null;
  symptoms: string[];
  status: DiagnosisStatus;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  images: DiagnosisImage[];
  analysis?: AnalysisResult | null;
  questions: FollowUpQuestion[];
  feedback?: Feedback | null;
  _count?: {
    images: number;
    questions: number;
  };
}

export interface BillingUsage {
  plan: UserPlan;
  planTitle: string;
  currentMonth: string;
  usedThisMonth: number;
  monthlyLimit: number;
  remainingThisMonth: number;
  totalDiagnosesAllTime: number;
  canDiagnose: boolean;
  isPaymentConfigured: boolean;
}

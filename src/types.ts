export type UserRole = 'Waka Kurikulum' | 'Koordinator Mapel' | 'Guru Pengampu' | 'Kepala Sekolah';

export interface User {
  id: string;
  name: string;
  title: string;
  nip: string;
  role: UserRole;
  subject: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  activeSection?: string;
}

export type PlanStatus = 'Draft' | 'Dalam Review' | 'Disetujui' | 'Revisi';

export interface AssessmentRubric {
  criterion: string;
  exemplary: string; // Sangat Baik
  proficient: string; // Mahir
  developing: string; // Berkembang
}

export interface DifferentiationStrategy {
  content: string; // Diferensiasi Konten
  process: string; // Diferensiasi Proses
  product: string; // Diferensiasi Produk
}

export interface CollaborativeComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  section: string;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface RevisionHistoryItem {
  id: string;
  version: string;
  modifiedBy: string;
  timestamp: string;
  summary: string;
}

export interface LessonPlan {
  id: string;
  code: string;
  title: string;
  curriculum: 'Kurikulum Merdeka' | 'Kurikulum 2013' | 'Cambridge / Hybrid';
  phase: string; // e.g., 'Fase D (Kelas 7-8)' | 'Fase E (Kelas 10)'
  grade: string;
  subject: string;
  topic: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  allocatedHours: number; // e.g. 4 JP (4x40 menit)
  authorId: string;
  authorName: string;
  status: PlanStatus;
  version: string;
  lastModified: string;
  encryptedHash: string;
  
  // Informasi Umum
  schoolName: string;
  initialCompetency: string;
  pancasilaProfiles: string[];
  facilities: string;
  targetStudents: string;
  learningModel: string; // e.g. Problem-Based Learning (PBL)

  // Komponen Inti
  learningObjectives: string[]; // TP
  meaningfulUnderstanding: string;
  triggeringQuestions: string[];
  
  activities: {
    introduction: { duration: number; steps: string[] };
    coreActivity: {
      duration: number;
      steps: string[];
      differentiation: DifferentiationStrategy;
    };
    closing: { duration: number; steps: string[] };
  };

  assessments: {
    diagnostic: string;
    formative: string;
    summative: string;
    rubrics: AssessmentRubric[];
  };

  reflection: {
    teacherNotes: string;
    studentQuestions: string;
  };

  // Lampiran
  attachments: {
    worksheetSummary: string;
    enrichmentRemedial: string;
    references: string[];
  };

  comments: CollaborativeComment[];
  history: RevisionHistoryItem[];
  collaborators: {
    userId: string;
    name: string;
    avatar: string;
    role: string;
    lastActive: string;
  }[];
}

export interface TeamNotification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'approval' | 'comment' | 'sync' | 'security';
  timestamp: string;
  read: boolean;
  authorName: string;
  authorAvatar?: string;
  planId?: string;
  planTitle?: string;
}

export interface StudentProgressMetric {
  classId: string;
  className: string;
  subject: string;
  teacherName: string;
  totalStudents: number;
  averageScore: number;
  masteryRate: number; // percentage %
  diagnosticAvg: number;
  formativeAvg: number;
  summativeAvg: number;
  completedModules: number;
  totalModules: number;
  tpBreakdown: {
    tpCode: string;
    description: string;
    masteryPercent: number;
    remedialCount: number;
  }[];
  pancasilaScores: {
    trait: string;
    score: number;
  }[];
  gradeDistribution: {
    range: string;
    count: number;
    color: string;
  }[];
}

export interface SecurityAuditItem {
  id: string;
  action: string;
  actor: string;
  ip: string;
  timestamp: string;
  status: 'VERIFIED' | 'ENCRYPTED' | 'WARNING';
  details: string;
}

export interface SecuritySession {
  sessionId: string;
  cipherAlgorithm: string;
  keyFingerprint: string;
  createdAt: string;
  expiresAt: string;
  activeTokensCount: number;
  zeroKnowledgeVaultActive: boolean;
  auditLogs: SecurityAuditItem[];
}

export interface ApiIntegrationConfig {
  id: string;
  name: string;
  provider: 'PMM Kemdikbud' | 'Google Classroom' | 'Moodle LMS' | 'Dapodik Kemdikbud';
  description: string;
  status: 'Terkoneksi' | 'Menunggu Kunci' | 'Perlu Pembaruan';
  lastSync: string;
  endpoint: string;
  apiKeyMasked: string;
  webhookUrl: string;
  syncedCount: number;
  autoSync: boolean;
  badgeColor: string;
}

export type ReportType = {
  seo?: number;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  backlinks?: number;
  recommendations?: { text: string; priority: string }[];
  analysis?: string;
  history?: { 
    date: string; 
    seo: number; 
    performance: number; 
    accessibility: number; 
    bestPractices: number 
  }[];
};

export type AuditFormProps = {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  loadingStep: string;
  setLoadingStep: (step: string) => void;
  auditDone: boolean;
  setAuditDone: (done: boolean) => void;
  showSampleReport: boolean;
  setShowSampleReport: (show: boolean) => void;
  report: ReportType | null;
  setReport: (report: ReportType | null) => void;
  auditCount: number;
  setAuditCount: (count: number) => void;
  isLoggedIn: boolean;
};

export type AuditReportProps = {
  report: ReportType;
  url: string;
  showSampleReport: boolean;
  auditDone: boolean;
};
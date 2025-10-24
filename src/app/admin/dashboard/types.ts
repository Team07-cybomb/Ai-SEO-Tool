export interface User {
  _id: string;
  email: string;
  name: string;
  plan: string;
  lastLogin: string;
  usage: number;
  mobile?: string;
  profilePicture?: string;
  createdAt: string;
  isVerified: boolean;
  loginMethod?: string;
}

export interface AuditLog {
  _id: string;
  userEmail?: string;
  email?: string; // Alternative field name
  userId?: string; // User ID instead of email
  user?: { // Nested user object
    email?: string;
    name?: string;
  };
  url?: string;
  path?: string; // Alternative field name
  endpoint?: string; // Alternative field name
  uri?: string; // Alternative field name
  action?: string;
  type?: string; // Alternative field name
  event?: string; // Alternative field name
  timestamp?: string;
  time?: string; // Alternative field name
  createdAt?: string; // Alternative field name
  date?: string; // Alternative field name
  tool?: string; // Added for tool identification
  userName?: string; // Added for display
}

// Base interface for all tool data
export interface ToolData {
  _id: string;
  tool: string;
  action: string;
  timestamp: string | Date;
  [key: string]: any; // Additional tool-specific properties
}

// Business Name Generator Data
export interface BusinessNameData extends ToolData {
  sessionId: string;
  industry: string;
  audience: string;
  stylePreference: string;
  nameCount: number;
  names: Array<{
    name: string;
    style: string;
    tagline: string;
  }>;
  userEmail?: string; // For user association
  userName?: string; // For user association
}

// Keyword Checker Data
export interface KeycheckData extends ToolData {
  reportId: string;
  mainUrl: string;
  totalScraped: number;
  keywordCount: number;
  status: string;
  analysisType: string;
  userEmail?: string; // For user association
  userName?: string; // For user association
}

// Keyword Scraper Data
export interface KeyScrapeData extends ToolData {
  reportId: string;
  mainUrl: string;
  domain: string;
  totalPagesScraped: number;
  totalKeywordsFound: number;
  primaryKeywords: number;
  analysisType: string;
  userEmail?: string; // For user association
  userName?: string; // For user association
}

// Keyword Generator Data
export interface KeywordData extends ToolData {
  sessionId: string;
  topic: string;
  industry: string;
  audience: string;
  keywordCount: number;
  totalSearchVolume: number;
  averageCPC: number;
  userEmail?: string; // For user association
  userName?: string; // For user association
}

// Extended Dashboard Data with all tools
export interface DashboardData {
  // Overall statistics
  totalActivities: number;
  uniqueUsers: number;
  activeUsers: number;
  premiumUsers: number;
  
  // Tool-specific statistics
  toolStats: {
    seo_audit: number;
    business_name_generator: number;
    keyword_checker: number;
    keyword_scraper: number;
    keyword_generator: number;
  };
  
  // Individual tool data arrays
  auditData: AuditLog[];
  businessNameData: BusinessNameData[];
  keycheckData: KeycheckData[];
  keyScrapeData: KeyScrapeData[];
  keywordData: KeywordData[];
  
  // Combined data for unified view
  allToolData: ToolData[];
  
  // User data
  users: User[];
  
  // Legacy fields for backward compatibility
  totalLogins?: number; // Deprecated, use totalActivities
}

// Tool filter options for the admin panel
export interface ToolFilter {
  value: string;
  label: string;
}

// Pagination interface for tool data endpoints
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Response interface for tool-specific data
export interface ToolDataResponse {
  data: any[];
  pagination: PaginationInfo;
}

// Activity summary for charts and analytics
export interface ActivitySummary {
  date: string;
  seo_audit: number;
  business_name_generator: number;
  keyword_checker: number;
  keyword_scraper: number;
  keyword_generator: number;
  total: number;
}

// User activity interface
export interface UserActivity {
  userId: string;
  email: string;
  name: string;
  totalActivities: number;
  lastActivity: string;
  toolsUsed: string[];
  activityBreakdown: {
    seo_audit: number;
    business_name_generator: number;
    keyword_checker: number;
    keyword_scraper: number;
    keyword_generator: number;
  };
}
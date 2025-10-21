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
}

export interface DashboardData {
  totalLogins: number;
  uniqueUsers: number;
  activeUsers: number;
  premiumUsers: number;
  auditData: AuditLog[];
  users: User[];
}
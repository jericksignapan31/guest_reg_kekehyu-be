import { UserRole } from './auth.model';

export interface DashboardStats {
  today: number;
  week: number;
  month: number;
  total: number;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  reservationNumber?: string;
}

export interface TransactionResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface FrontDeskUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive';
}

export interface UserStatistics {
  userId: string;
  registrations: number;
  transactions: number;
  lastLogin: Date;
  recentActivity: Transaction[];
}

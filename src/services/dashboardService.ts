import api from './api';
import { ENDPOINTS } from '../config/api';

interface DashboardStats {
  totalClients: number;
  totalCases: number;
  activeCases: number;
  upcomingHearings: number;
}

interface Hearing {
  id: string;
  caseId: string;
  caseName: string;
  clientId: string;
  clientName: string;
  courtName: string;
  date: string;
  time: string;
  status: string;
}

interface CaseOverview {
  id: string;
  caseId: string;
  clientName: string;
  courtName: string;
  nextHearingDate: string | null;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  upcomingHearings: Hearing[];
  recentCases: CaseOverview[];
}

const getDashboardData = async (): Promise<DashboardData> => {
  return api.get(ENDPOINTS.DASHBOARD);
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;
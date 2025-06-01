import api from './api';
import { ENDPOINTS } from '../config/api';

interface DashboardStats {
  totalClients: number;
  totalCases: number;
  activeCases: number;
  upcomingHearings: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingHearings: any[]; // Type from calendar service
  recentCases: any[]; // Type from case service
}

const getDashboardData = async (): Promise<DashboardData> => {
  const [stats, calendar, cases] = await Promise.all([
    api.get(ENDPOINTS.DASHBOARD_STATS),
    api.get(ENDPOINTS.CALENDAR_UPCOMING, { params: { days: 7 } }),
    api.get(ENDPOINTS.CASES, { params: { status: 'active', limit: 5 } })
  ]);

  return {
    stats,
    recentActivities: [], // To be implemented when API is available
    upcomingHearings: calendar.data,
    recentCases: cases.data
  };
};

const dashboardService = {
  getDashboardData
};

export default dashboardService;
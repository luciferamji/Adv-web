// Mock data for the dashboard
// In a real application, this would fetch data from your API

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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    stats: {
      totalClients: 24,
      totalCases: 48,
      activeCases: 32,
      upcomingHearings: 12,
    },
    upcomingHearings: [
      {
        id: '1',
        caseId: 'C-2023-001',
        caseName: 'Smith v. Anderson',
        clientId: '101',
        clientName: 'John Smith',
        courtName: 'District Court',
        date: '2025-06-15',
        time: '10:00 AM',
        status: 'Scheduled',
      },
      {
        id: '2',
        caseId: 'C-2023-005',
        caseName: 'Williams Property Dispute',
        clientId: '103',
        clientName: 'Sarah Williams',
        courtName: 'Civil Court',
        date: '2025-06-18',
        time: '11:30 AM',
        status: 'Scheduled',
      },
      {
        id: '3',
        caseId: 'C-2023-012',
        caseName: 'Johnson Bankruptcy',
        clientId: '105',
        clientName: 'Robert Johnson',
        courtName: 'Bankruptcy Court',
        date: '2025-06-20',
        time: '9:15 AM',
        status: 'Scheduled',
      },
    ],
    recentCases: [
      {
        id: '101',
        caseId: 'C-2023-001',
        clientName: 'John Smith',
        courtName: 'District Court',
        nextHearingDate: '2025-06-15',
        status: 'Active',
      },
      {
        id: '102',
        caseId: 'C-2023-005',
        clientName: 'Sarah Williams',
        courtName: 'Civil Court',
        nextHearingDate: '2025-06-18',
        status: 'Active',
      },
      {
        id: '103',
        caseId: 'C-2023-012',
        clientName: 'Robert Johnson',
        courtName: 'Bankruptcy Court',
        nextHearingDate: '2025-06-20',
        status: 'Active',
      },
      {
        id: '104',
        caseId: 'C-2023-014',
        clientName: 'Emily Davis',
        courtName: 'Family Court',
        nextHearingDate: null,
        status: 'Pending',
      },
    ],
  };
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;
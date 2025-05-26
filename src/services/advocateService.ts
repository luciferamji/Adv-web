import type { Case } from '../pages/cases/CaseList';

interface Advocate {
  id: string;
  name: string;
  email: string;
  phone: string;
  barNumber: string;
  specialization?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  caseCount: number;
  advocateId?: string;
}

interface GetAdvocatesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface GetAdvocatesResponse {
  advocates: Advocate[];
  total: number;
}

// Mock data for advocates - aligned with case data
const mockAdvocates: Advocate[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    barNumber: 'BAR123456',
    specialization: 'Corporate Law',
    status: 'active',
    joinDate: '2025-01-01',
    caseCount: 15
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 234-5678',
    barNumber: 'BAR234567',
    specialization: 'Civil Litigation',
    status: 'active',
    joinDate: '2025-01-15',
    caseCount: 8
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 345-6789',
    barNumber: 'BAR345678',
    specialization: 'Family Law',
    status: 'active',
    joinDate: '2025-02-01',
    caseCount: 12
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 456-7890',
    barNumber: 'BAR456789',
    specialization: 'Criminal Law',
    status: 'inactive',
    joinDate: '2025-02-15',
    caseCount: 5
  }
];

export const getAdvocates = async (params: GetAdvocatesParams = {}): Promise<GetAdvocatesResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  let filteredAdvocates = [...mockAdvocates];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredAdvocates = filteredAdvocates.filter(advocate =>
      advocate.name.toLowerCase().includes(searchLower) ||
      advocate.email.toLowerCase().includes(searchLower) ||
      advocate.barNumber.toLowerCase().includes(searchLower) ||
      advocate.phone.includes(params.search)
    );
  }

  // Apply status filter
  if (params.status) {
    filteredAdvocates = filteredAdvocates.filter(advocate =>
      advocate.status === params.status
    );
  }

  // Get total before pagination
  const total = filteredAdvocates.length;

  // Apply pagination
  if (params.page !== undefined && params.limit !== undefined) {
    const start = params.page * params.limit;
    const end = start + params.limit;
    filteredAdvocates = filteredAdvocates.slice(start, end);
  }

  return {
    advocates: filteredAdvocates,
    total
  };
};

export const getAdvocate = async (id: string): Promise<Advocate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const advocate = mockAdvocates.find(a => a.id === id);
  if (!advocate) throw new Error('Advocate not found');
  return advocate;
};

export const createAdvocate = async (advocateData: Omit<Advocate, 'id' | 'status' | 'joinDate' | 'caseCount'>): Promise<Advocate> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newAdvocate: Advocate = {
    ...advocateData,
    id: Math.random().toString(36).substr(2, 9),
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    caseCount: 0
  };
  
  mockAdvocates.push(newAdvocate);
  return newAdvocate;
};

export const updateAdvocate = async (id: string, advocateData: Partial<Advocate>): Promise<Advocate> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockAdvocates.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Advocate not found');
  
  mockAdvocates[index] = {
    ...mockAdvocates[index],
    ...advocateData
  };
  
  return mockAdvocates[index];
};

export const deleteAdvocate = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockAdvocates.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Advocate not found');
  mockAdvocates.splice(index, 1);
};

const advocateService = {
  getAdvocates,
  getAdvocate,
  createAdvocate,
  updateAdvocate,
  deleteAdvocate
};

export default advocateService;
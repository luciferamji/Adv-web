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
}

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
  }
];

export const getAdvocates = async (): Promise<Advocate[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAdvocates;
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

const advocateService ={
  getAdvocates,
  getAdvocate,
  createAdvocate,
  updateAdvocate,
  deleteAdvocate
}

export default advocateService;
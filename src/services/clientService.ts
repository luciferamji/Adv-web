// Mock client service
// In a real application, this would fetch data from your API

import { getCases } from './caseService';

interface Client {
  id: string;
  name: string;
  clientId: string;
  email: string;
  phone: string;
  address: string;
  caseCount: number;
  createdAt: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    clientId: 'CLT-001',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    caseCount: 1,
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    id: '2',
    name: 'Tech Corp Inc.',
    clientId: 'CLT-002',
    email: 'legal@techcorp.com',
    phone: '+1 (555) 234-5678',
    address: '456 Innovation Way, San Francisco, CA 94105',
    caseCount: 1,
    createdAt: '2025-01-03T09:00:00Z'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    clientId: 'CLT-003',
    email: 'sarah.williams@example.com',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Blvd, Chicago, IL 60007',
    caseCount: 1,
    createdAt: '2025-01-05T10:15:00Z'
  },
  {
    id: '4',
    name: 'Emily Johnson',
    clientId: 'CLT-004',
    email: 'emily.johnson@example.com',
    phone: '+1 (555) 456-7890',
    address: '1011 Cedar Ln, Houston, TX 77001',
    caseCount: 1,
    createdAt: '2025-01-07T14:30:00Z'
  }
];

const getClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockClients;
};

const getClientById = async (id: string): Promise<Client | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const client = mockClients.find(c => c.id === id);
  if (!client) return null;

  // Get cases for this client from case service
  const cases = await getCases();
  const clientCases = cases.filter(c => c.clientId === id);
  
  return {
    ...client,
    caseCount: clientCases.length
  };
};

const createClient = async (client: Omit<Client, 'id' | 'clientId' | 'caseCount' | 'createdAt'>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newClient: Client = {
    id: `${mockClients.length + 1}`,
    clientId: `CLT-${String(mockClients.length + 1).padStart(3, '0')}`,
    ...client,
    caseCount: 0,
    createdAt: new Date().toISOString()
  };
  
  return newClient;
};

const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const existingClient = mockClients.find(c => c.id === id);
  if (!existingClient) {
    throw new Error('Client not found');
  }
  
  return {
    ...existingClient,
    ...client,
  };
};

const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
};

export default clientService;
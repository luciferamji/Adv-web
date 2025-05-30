import api from './api';
import { ENDPOINTS } from '../config/api';

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

const getClients = async (): Promise<Client[]> => {
  return api.get(ENDPOINTS.CLIENTS);
};

const getClientById = async (id: string): Promise<Client | null> => {
  return api.get(`${ENDPOINTS.CLIENTS}/${id}`);
};

const createClient = async (client: Omit<Client, 'id' | 'clientId' | 'caseCount' | 'createdAt'>): Promise<Client> => {
  return api.post(ENDPOINTS.CLIENTS, client);
};

const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  return api.put(`${ENDPOINTS.CLIENTS}/${id}`, client);
};

const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
};

export default clientService;
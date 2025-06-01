import api from './api';
import { ENDPOINTS } from '../config/api';

interface Client {
  id: number;
  name: string;
  clientId: string;
  email: string;
  phone: string;
  address: string;
  cases?: Case[];
}

interface Case {
  id: number;
  caseId: string;
  courtDetails: string;
  status: string;
}

const getClients = async (): Promise<{ count: number; data: Client[] }> => {
  return api.get(ENDPOINTS.CLIENTS);
};

const getClientById = async (id: string): Promise<Client> => {
  return api.get(ENDPOINTS.CLIENT(id));
};

const createClient = async (data: Omit<Client, 'id' | 'cases'>): Promise<Client> => {
  return api.post(ENDPOINTS.CLIENTS, data);
};

const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
  return api.put(ENDPOINTS.CLIENT(id), data);
};

const deleteClient = async (id: string): Promise<void> => {
  return api.delete(ENDPOINTS.CLIENT(id));
};

const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};

export default clientService;
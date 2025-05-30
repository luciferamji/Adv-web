import api from './api';
import { ENDPOINTS } from '../config/api';

interface Advocate {
  id: string;
  name: string;
  email: string;
  phone: string;
  barNumber: string;
  specialization?: string;
  status: 'active' | 'inactive';
  joinDate?: string;
  caseCount?: number;
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

export const getAdvocates = async (params: GetAdvocatesParams = {}): Promise<GetAdvocatesResponse> => {
  return api.get(ENDPOINTS.ADVOCATES, { params });
};

export const getAdvocate = async (id: string): Promise<Advocate> => {
  return api.get(`${ENDPOINTS.ADVOCATES}/${id}`);
};

export const createAdvocate = async (advocateData: Omit<Advocate, 'id' | 'status' | 'joinDate' | 'caseCount'>): Promise<Advocate> => {
  console.log(advocateData)
  return api.post(ENDPOINTS.USERS, advocateData);
};

export const updateAdvocate = async (id: string, advocateData: Partial<Advocate>): Promise<Advocate> => {
  return api.put(`${ENDPOINTS.ADVOCATES}/${id}`, advocateData);
};

export const deleteAdvocate = async (id: string): Promise<void> => {
  return api.delete(`${ENDPOINTS.ADVOCATES}/${id}`);
};

const advocateService = {
  getAdvocates,
  getAdvocate,
  createAdvocate,
  updateAdvocate,
  deleteAdvocate
};

export default advocateService;
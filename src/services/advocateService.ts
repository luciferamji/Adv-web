import api from './api';
import { ENDPOINTS } from '../config/api';

interface Advocate {
  id: number;
  name: string;
  email: string;
  barNumber: string;
  specialization?: string;
  yearsOfExperience: number;
  status: 'active' | 'inactive';
}

interface GetAdvocatesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface GetAdvocatesResponse {
  count: number;
  data: Advocate[];
}

const getAdvocates = async (params: GetAdvocatesParams = {}): Promise<GetAdvocatesResponse> => {
  return api.get(ENDPOINTS.ADVOCATES, { params });
};

const getAdvocate = async (id: string): Promise<Advocate> => {
  return api.get(ENDPOINTS.ADVOCATE(id));
};

const updateAdvocate = async (id: string, data: Partial<Advocate>): Promise<Advocate> => {
  return api.put(ENDPOINTS.ADVOCATE(id), data);
};

const advocateService = {
  getAdvocates,
  getAdvocate,
  updateAdvocate
};

export default advocateService;
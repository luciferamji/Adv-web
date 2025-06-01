import api from './api';
import { ENDPOINTS } from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UpdateDetailsData {
  name?: string;
  email?: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  advocate?: {
    id: number;
    barNumber: string;
    specialization: string;
    yearsOfExperience: number;
  };
}

const login = async (credentials: LoginCredentials): Promise<{ user: User }> => {
  const response = await api.post(ENDPOINTS.LOGIN, credentials);
  return response;
};

const register = async (data: RegisterData): Promise<{ user: User }> => {
  const response = await api.post(ENDPOINTS.REGISTER, data);
  return response;
};

const logout = async (): Promise<void> => {
  await api.get(ENDPOINTS.LOGOUT);
};

const getCurrentUser = async (): Promise<User> => {
  const response = await api.get(ENDPOINTS.ME);
  return response;
};

const updateDetails = async (data: UpdateDetailsData): Promise<User> => {
  const response = await api.put(ENDPOINTS.UPDATE_DETAILS, data);
  return response;
};

const updatePassword = async (data: UpdatePasswordData): Promise<{ user: User }> => {
  const response = await api.put(ENDPOINTS.UPDATE_PASSWORD, data);
  return response;
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  updateDetails,
  updatePassword
};

export default authService;
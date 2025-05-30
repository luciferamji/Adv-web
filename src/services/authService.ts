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
  console.log(credentials)
  return api.post(ENDPOINTS.LOGIN, credentials,{ withCredentials: true });
};

const register = async (data: RegisterData): Promise<{ user: User }> => {
  return api.post(ENDPOINTS.REGISTER, data);
};

const logout = async (): Promise<void> => {
  return api.get(ENDPOINTS.LOGOUT);
};

const getCurrentUser = async (): Promise<User> => {
  return api.get(ENDPOINTS.ME);
};

const updateDetails = async (data: UpdateDetailsData): Promise<User> => {
  return api.put(ENDPOINTS.UPDATE_DETAILS, data);
};

const updatePassword = async (data: UpdatePasswordData): Promise<{ user: User }> => {
  return api.put(ENDPOINTS.UPDATE_PASSWORD, data);
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
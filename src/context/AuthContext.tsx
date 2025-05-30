import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'super-admin' | 'advocate';
// }

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

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      } catch (error) {
        // Not authenticated or session expired
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setUserRole(userData.role);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        user,
        userRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

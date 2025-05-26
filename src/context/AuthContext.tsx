import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'advocate';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verify token validity
          try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp && decoded.exp < currentTime) {
              // Token expired
              localStorage.removeItem('token');
              setIsAuthenticated(false);
              setUser(null);
              setUserRole(null);
            } else {
              // Token valid
              const userData = {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role
              };
              
              setIsAuthenticated(true);
              setUser(userData);
              setUserRole(decoded.role);
            }
          } catch (error) {
            // Invalid token
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { token } = response;
      
      localStorage.setItem('token', token);
      
      const decoded: any = jwtDecode(token);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      setUserRole(decoded.role);
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        user,
        userRole,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
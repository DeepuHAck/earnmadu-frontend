import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  wallet: {
    balance: number;
    totalEarned: number;
    pendingWithdrawal: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('AuthProvider Init');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('Checking auth status...');
    try {
      const { data } = await api.get('/api/v1/auth/me');
      console.log('Auth check response:', data);
      setUser(data.data);
    } catch (err: any) {
      console.log('Auth check failed:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={{
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async (email, password) => {
      try {
        const { data } = await api.post('/api/v1/auth/login', { email, password });
        setUser(data.data);
      } catch (err: any) {
        console.error('Login failed:', err.response?.data);
        throw err;
      }
    },
    register: async (name, email, password) => {
      try {
        console.log('Attempting registration with:', { name, email });
        const { data } = await api.post('/api/v1/auth/register', { name, email, password });
        console.log('Registration response:', data);
        setUser(data.data);
      } catch (err: any) {
        console.error('Registration failed:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        throw err;
      }
    },
    logout: async () => {
      try {
        await api.post('/api/v1/auth/logout');
        setUser(null);
      } catch (err: any) {
        console.error('Logout failed:', err.response?.data);
        throw err;
      }
    },
    updateUser: (data) => setUser(prev => prev ? { ...prev, ...data } : null)
  }}>{children}</AuthContext.Provider>;
}; 
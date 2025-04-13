import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post(`/api/auth/reset-password/${token}`, { password }),
};

// Video API
export const videoApi = {
  getNextVideo: () => api.get('/api/videos/next'),
  completeVideo: (videoId: string) =>
    api.post(`/api/videos/${videoId}/complete`),
  getVideoStats: (videoId: string) =>
    api.get(`/api/videos/${videoId}/stats`),
};

// Wallet API
export const walletApi = {
  getBalance: () => api.get('/api/wallet/balance'),
  getTransactions: () => api.get('/api/wallet/transactions'),
  requestWithdrawal: (amount: number, paymentDetails: any) =>
    api.post('/api/wallet/withdraw', { amount, paymentDetails }),
  getWithdrawals: () => api.get('/api/wallet/withdrawals'),
};

// Admin API
export const adminApi = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: () => api.get('/api/admin/users'),
  getVideos: () => api.get('/api/admin/videos'),
  addVideo: (videoData: any) => api.post('/api/admin/videos', videoData),
  updateVideo: (videoId: string, videoData: any) =>
    api.put(`/api/admin/videos/${videoId}`, videoData),
  deleteVideo: (videoId: string) =>
    api.delete(`/api/admin/videos/${videoId}`),
  getWithdrawals: () => api.get('/api/admin/withdrawals'),
  updateWithdrawalStatus: (withdrawalId: string, status: string) =>
    api.put(`/api/admin/withdrawals/${withdrawalId}`, { status }),
};

export default api; 
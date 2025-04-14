import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { AuthProvider } from './store/auth-context';
import ErrorBoundary from './components/ErrorBoundary';

// Debug: Log environment variables (excluding sensitive data)
console.log('App Init:', {
  nodeEnv: import.meta.env.MODE,
  baseUrl: import.meta.env.VITE_API_URL,
  hasYoutubeKey: !!import.meta.env.VITE_YOUTUBE_API_KEY
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log('App Render Start');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App; 
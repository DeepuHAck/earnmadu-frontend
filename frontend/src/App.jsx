import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Earnings from './pages/Earnings';
import { AuthProvider } from './store/auth-context';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  useEffect(() => {
    console.log('App component mounted');
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      BASE_URL: import.meta.env.VITE_API_URL
    });
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/earnings"
                  element={
                    <PrivateRoute>
                      <Earnings />
                    </PrivateRoute>
                  }
                />

                {/* Catch-all route */}
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                }
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 
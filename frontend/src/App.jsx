import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Earnings from './pages/Earnings';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:videoId" element={<VideoPlayer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/earnings" element={<Earnings />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </Provider>
  );
}

export default App; 
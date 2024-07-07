// src/Routes.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import FeedPage from './pages/FeedPage';
import MyPostsPage from './pages/MyPostsPage';
import SavedPostsPage from './pages/SavedPostsPage';
import { useAuth } from './contexts/AuthContext';

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/myposts" element={currentUser ? <MyPostsPage /> : <Navigate to="/login" />} />
        <Route path="/savedposts" element={currentUser ? <SavedPostsPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<FeedPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import FeedPage from './pages/FeedPage';
import MyPostsPage from './pages/MyPostsPage';
import CreatePostPage from './pages/CreatePostPage';
import AppBar from './components/AppBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SavedPostsPage from './pages/SavedPostsPage';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
    <Route path="/myposts" element={<PrivateRoute><MyPostsPage /></PrivateRoute>} />
    <Route path="/createpost" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
    <Route path="/savedposts" element={<PrivateRoute><SavedPostsPage /></PrivateRoute>} />
    </Routes>
);

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppBar />
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;

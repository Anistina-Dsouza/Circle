import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login/LoginPage';
import Signup from './features/auth/Signup/SignupPage';
import ForgotPassword from './features/auth/ForgotPassword/ForgotPasswordPage';
import Landing from './features/landingPage/pages/Landing';
import Feed from './features/feed/FeedPage';
import Messages from './features/messages/MessagesPage';
import AdminDashboard from './features/admin/pages/AdminDashboard';

import ManageUsers from './features/admin/pages/ManageUsers';
import ManageCommunities from './features/admin/pages/ManageCommunities';
import Announcements from './features/admin/pages/Announcements';

import ProfilePage from './features/profile/ProfilePage';
import EditProfilePage from './features/profile/EditProfilePage';
import ExploreUsersPage from './features/profile/ExploreUsersPage';
import StoryViewer from './features/stories/pages/StoryViewerPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

import Circles from './features/circles/pages/CirclesPage';
import CreateCircle from './features/circles/pages/CreateCirclePage';
import JoinCommunity from './features/circles/pages/JoinCommunityPage';


function App() {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && error.response?.data?.error === 'Token expired') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/feed" element={<Feed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/communities" element={<ManageCommunities />} />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/circles" element={<ProtectedRoute><Circles /></ProtectedRoute>} />
            <Route path="/circles/create" element={<ProtectedRoute><CreateCircle /></ProtectedRoute>} />
            <Route path="/circles/:slug/join" element={<ProtectedRoute><JoinCommunity /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ExploreUsersPage /></ProtectedRoute>} />
            <Route path="/stories/:username" element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

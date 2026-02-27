import React from 'react';
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

function App() {
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/communities" element={<ManageCommunities />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

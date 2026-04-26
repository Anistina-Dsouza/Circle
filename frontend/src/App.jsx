import React, { useEffect, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import ScrollToTop from './components/ScrollToTop';
const Login = React.lazy(() => import('./features/auth/Login/LoginPage'));
const Signup = React.lazy(() => import('./features/auth/signup/SignupPage'));
const ForgotPassword = React.lazy(() => import('./features/auth/ForgotPassword/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./features/auth/ForgotPassword/ResetPasswordPage'));
const Landing = React.lazy(() => import('./features/landingPage/pages/Landing'));
const Feed = React.lazy(() => import('./features/feed/FeedPage'));
const Messages = React.lazy(() => import('./features/messages/MessagesPage'));
const AdminDashboard = React.lazy(() => import('./features/admin/pages/AdminDashboard'));

const ManageUsers = React.lazy(() => import('./features/admin/pages/ManageUsers'));
const ManageCommunities = React.lazy(() => import('./features/admin/pages/ManageCommunities'));
const Announcements = React.lazy(() => import('./features/admin/pages/Announcements'));
const LegalPage = React.lazy(() => import('./features/landingPage/pages/LegalPage'));

const AdminReports =React.lazy(() => import('./features/admin/pages/AdminReports'));

const ProfilePage = React.lazy(() => import('./features/profile/ProfilePage'));
const EditProfilePage = React.lazy(() => import('./features/profile/EditProfilePage'));
const ExploreUsersPage = React.lazy(() => import('./features/profile/ExploreUsersPage'));
const StoryViewer = React.lazy(() => import('./features/stories/pages/StoryViewerPage'));
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AdminRoute from './features/auth/components/AdminRoute';

const Circles = React.lazy(() => import('./features/circles/pages/CirclesPage'));
const CreateCircle = React.lazy(() => import('./features/circles/pages/CreateCirclePage'));
const JoinCommunity = React.lazy(() => import('./features/circles/pages/JoinCommunityPage'));
const CircleDetails = React.lazy(() => import('./features/circles/pages/CircleDetailsPage'));
const HostDashboard = React.lazy(() => import('./features/circles/pages/HostDashboardPage'));
const ManageParticipants = React.lazy(() => import('./features/circles/pages/ManageParticipantsPage'));
const CommunitySettings = React.lazy(() => import('./features/circles/pages/CommunitySettingsPage'));
const CircleMembers = React.lazy(() => import('./features/circles/pages/CircleMembersPage'));
const NotificationsPage = React.lazy(() => import('./features/notifications/pages/NotificationsPage'));
const MeetingsPage = React.lazy(() => import('./features/meetings/pages/MeetingsPage'));
const UpcomingMeetingsPage = React.lazy(() => import('./features/meetings/pages/UpcomingMeetingsPage'));
const ScheduleMeetingPage = React.lazy(() => import('./features/meetings/pages/ScheduleMeetingPage'));
const MeetingHistoryPage = React.lazy(() => import('./features/meetings/pages/MeetingHistoryPage'));
const ManageMeetingsPage = React.lazy(() => import('./features/meetings/pages/ManageMeetingsPage'));

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    let socket;
    
    if (token) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      socket = io(backendUrl, {
        auth: { token }
      });
      
      socket.on('connect', () => {
        // Automatically handled by backend to join personal room and mark online
        console.log('Global presence socket connected');
        window.dispatchEvent(new Event('socketConnected'));
      });
      
      socket.on('disconnect', () => {
        console.log('Global presence socket disconnected');
        window.dispatchEvent(new Event('socketDisconnected'));
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#0F0529]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              
              {/* Legal / Footer Pages */}
              <Route path="/privacy" element={<LegalPage type="privacy" />} />
              <Route path="/terms" element={<LegalPage type="terms" />} />
              <Route path="/cookies" element={<LegalPage type="cookies" />} />
              <Route path="/contact" element={<LegalPage type="contact" />} />

              <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
              <Route path="/meetings/upcoming" element={<ProtectedRoute><UpcomingMeetingsPage /></ProtectedRoute>} />
              <Route path="/meetings/schedule" element={<ProtectedRoute><ScheduleMeetingPage /></ProtectedRoute>} />
              <Route path="/meetings/history" element={<ProtectedRoute><MeetingHistoryPage /></ProtectedRoute>} />
              <Route path="/meetings/manage" element={<ProtectedRoute><ManageMeetingsPage /></ProtectedRoute>} />
              <Route path="/circles" element={<ProtectedRoute><Circles /></ProtectedRoute>} />
              <Route path="/circles/create" element={<ProtectedRoute><CreateCircle /></ProtectedRoute>} />
              <Route path="/circles/:slug/join" element={<ProtectedRoute><JoinCommunity /></ProtectedRoute>} />
              <Route path="/circles/:slug" element={<ProtectedRoute><CircleDetails /></ProtectedRoute>} />
              <Route path="/circles/:slug/manage" element={<ProtectedRoute><HostDashboard /></ProtectedRoute>} />
              <Route path="/circles/:slug/manage/participants" element={<ProtectedRoute><ManageParticipants /></ProtectedRoute>} />
              <Route path="/circles/:slug/members" element={<ProtectedRoute><CircleMembers /></ProtectedRoute>} />
              <Route path="/circles/:slug/manage/settings" element={<ProtectedRoute><CommunitySettings /></ProtectedRoute>} />

              <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><ExploreUsersPage /></ProtectedRoute>} />
              <Route path="/stories/:username" element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />
              
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
              <Route path="/admin/communities" element={<AdminRoute><ManageCommunities /></AdminRoute>} />
              <Route path="/admin/announcements" element={<AdminRoute><Announcements /></AdminRoute>} />
              <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />

            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api`;

const axiosInstance = axios.create();

// Add a request interceptor to attach the auth token
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

const meetingService = {
    // Fetch meeting dashboard (hosted, upcoming, past)
    getDashboard: async () => {
        const response = await axiosInstance.get(`${API_URL}/meetings/dashboard`);
        return response.data;
    },

    // Fetch all upcoming meetings or for a specific circle
    getUpcomingMeetings: async (circleId = null) => {
        const url = circleId ? `${API_URL}/meetings/upcoming?circleId=${circleId}` : `${API_URL}/meetings/upcoming`;
        const response = await axiosInstance.get(url);
        return response.data;
    },

    // Fetch upcoming meetings specifically for a circle
    getCircleMeetings: async (circleId) => {
        const response = await axiosInstance.get(`${API_URL}/meetings/circle/${circleId}`);
        return response.data;
    },

    // Fetch meetings hosted by the current user
    getMyHostedMeetings: async () => {
        const response = await axiosInstance.get(`${API_URL}/meetings/my`);
        return response.data;
    },

    // Create a new meeting (Integrated with Zoom on Backend)
    createMeeting: async (meetingData) => {
        const response = await axiosInstance.post(`${API_URL}/meetings/schedule`, meetingData);
        return response.data;
    },

    // Get historical meetings
    getMeetingHistory: async () => {
        const response = await axiosInstance.get(`${API_URL}/meetings/history`);
        return response.data;
    },

    // Update meeting details
    updateMeeting: async (id, meetingData) => {
        const response = await axiosInstance.put(`${API_URL}/meetings/${id}`, meetingData);
        return response.data;
    },

    // Host starts a meeting (changes status to live)
    startMeeting: async (id) => {
        const response = await axiosInstance.put(`${API_URL}/meetings/${id}/start`);
        return response.data;
    },

    // Delete a meeting
    deleteMeeting: async (id) => {
        const response = await axiosInstance.delete(`${API_URL}/meetings/${id}`);
        return response.data;
    },

    // Update RSVP Status
    updateRSVP: async (id, status) => {
        const response = await axiosInstance.put(`${API_URL}/meetings/${id}/rsvp`, { status });
        return response.data;
    }
};

export default meetingService;

import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api`;

const meetingService = {
    // Fetch meeting dashboard (hosted, upcoming, past)
    getDashboard: async () => {
        const response = await axios.get(`${API_URL}/meetings/dashboard`);
        return response.data;
    },

    // Fetch all upcoming meetings
    getUpcomingMeetings: async () => {
        const response = await axios.get(`${API_URL}/meetings/upcoming`);
        return response.data;
    },

    // Fetch meetings hosted by the current user
    getMyHostedMeetings: async () => {
        const response = await axios.get(`${API_URL}/meetings/my`);
        return response.data;
    },

    // Create a new meeting (Integrated with Zoom on Backend)
    createMeeting: async (meetingData) => {
        const response = await axios.post(`${API_URL}/meetings/schedule`, meetingData);
        return response.data;
    },

    // Get historical meetings
    getMeetingHistory: async () => {
        const response = await axios.get(`${API_URL}/meetings/history`);
        return response.data;
    },

    // Update meeting details
    updateMeeting: async (id, meetingData) => {
        const response = await axios.put(`${API_URL}/meetings/${id}`, meetingData);
        return response.data;
    },

    // Delete a meeting
    deleteMeeting: async (id) => {
        const response = await axios.delete(`${API_URL}/meetings/${id}`);
        return response.data;
    }
};

export default meetingService;

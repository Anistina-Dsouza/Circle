const dotenv = require('dotenv');
dotenv.config();

/**
 * Get a Server-to-Server OAuth access token from Zoom
 * @returns {Promise<string>} Access token
 */
const getZoomAccessToken = async () => {
    try {
        const accountId = process.env.ZOOM_ACCOUNT_ID;
        const clientId = process.env.ZOOM_CLIENT_ID;
        const clientSecret = process.env.ZOOM_CLIENT_SECRET;

        if (!accountId || !clientId || !clientSecret) {
            throw new Error('Zoom API credentials are not fully configured in environment variables.');
        }

        const basicAuthTag = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuthTag}`
            }
        });

        if (!response.ok) {
            const errorResult = await response.text();
            throw new Error(`Failed to to get Zoom access token: ${errorResult}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching Zoom access token:', error.message);
        throw error;
    }
};

/**
 * Creates a meeting via Zoom API
 * @param {Object} meetingOptions Meeting details (topic, start_time, duration, etc.)
 * @returns {Promise<Object>} The full Zoom meeting data (including join_url)
 */
const createZoomMeeting = async (meetingOptions) => {
    try {
        const token = await getZoomAccessToken();

        const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: meetingOptions.topic || 'New Circle Meeting',
                type: 2, // 2 = Scheduled meeting
                start_time: meetingOptions.startTime, // Format: 'YYYY-MM-DDTHH:MM:SSZ'
                duration: meetingOptions.duration || 60,
                agenda: meetingOptions.agenda,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true,
                    mute_upon_entry: true,
                    watermark: false,
                    use_pmi: false,
                    approval_type: 0, // Automatically approve
                    audio: 'both',
                    auto_recording: meetingOptions.allowRecording ? 'cloud' : 'none',
                    waiting_room: true
                }
            })
        });

        if (!response.ok) {
            const errorResult = await response.text();
            throw new Error(`Failed to create Zoom meeting: ${errorResult}`);
        }

        const meetingData = await response.json();
        return meetingData;
    } catch (error) {
        console.error('Error creating Zoom meeting:', error.message);
        throw error;
    }
};

module.exports = {
    getZoomAccessToken,
    createZoomMeeting
};

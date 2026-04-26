const axios = require('axios');

class ZoomService {
  constructor() {
    this.accountId = process.env.ZOOM_ACCOUNT_ID;
    this.clientId = process.env.ZOOM_CLIENT_ID;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiration = null;
  }

  /**
   * Generates a Server-to-Server OAuth Access Token.
   * Reuses the token if it has not expired yet.
   */
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiration && Date.now() < this.tokenExpiration - 5 * 60 * 1000) {
      return this.accessToken;
    }

    try {
      if (!this.accountId || !this.clientId || !this.clientSecret) {
        throw new Error("Zoom credentials missing in environment variables.");
      }

      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
        null,
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error generating Zoom Access Token:', error.response?.data || error.message);
      throw new Error('Failed to generate Zoom Access Token');
    }
  }

  /**
   * Creates a Zoom meeting.
   */
  async createMeeting(meetingDetails) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: meetingDetails.title,
          type: 2,
          start_time: meetingDetails.startTime,
          duration: meetingDetails.duration || 60,
          password: meetingDetails.password || undefined,
          agenda: meetingDetails.description || '',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            approval_type: 0
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        id: response.data.id.toString(),
        joinUrl: response.data.join_url,
        startUrl: response.data.start_url,
        password: response.data.password
      };
    } catch (error) {
      console.error('Error creating Zoom Meeting:', error.response?.data || error.message);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  /**
   * Deletes a Zoom meeting by ID.
   */
  async deleteMeeting(meetingId) {
    try {
      const token = await this.getAccessToken();

      await axios.delete(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`Zoom meeting ${meetingId} not found, it might already be deleted.`);
        return true;
      }
      console.error(`Error deleting Zoom Meeting ${meetingId}:`, error.response?.data || error.message);
      throw new Error('Failed to delete Zoom meeting');
    }
  }
}

module.exports = new ZoomService();

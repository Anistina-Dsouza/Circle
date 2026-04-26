/**
 * Opens a Jitsi Meet room in a new tab with the correct identity.
 * @param {string} meetingId - The _id of the meeting (unused here but kept for signature)
 * @param {Object} meetingData - Should contain meetingLink or roomId
 */
export async function joinMeeting(meetingId, meetingData) {
    try {
        // Fallback for meetingLink if not provided in meetingData
        const baseUrl = meetingData?.meetingLink || `https://meet.jit.si/${meetingData?.roomId}`;
        
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const displayName = user?.profile?.displayName || user?.username || 'Participant';
        
        // Jitsi allows passing config via URL hash
        // userInfo.displayName sets the name automatically
        const jitsiUrl = `${baseUrl}#config.prejoinPageEnabled=false&userInfo.displayName="${encodeURIComponent(displayName)}"`;
        
        window.open(jitsiUrl, '_blank');
    } catch (err) {
        console.error('Failed to join Jitsi meeting:', err);
        alert('Could not join meeting. Please try again.');
    }
}

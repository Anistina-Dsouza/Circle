# Circle Platform: Automated Audit Test Cases

This document outlines the elaborate test cases implemented within the `run_automation.js` modular testing suite.

---

## 1. Authentication & Lifecycle (Auth Module)

### TC1.1: Multi-Scenario Signup Validation
**Aim**  
Validate robust user registration with boundary handling.  
**Prerequisite**  
Database is reachable; Port 5173 (Frontend) and 3000 (Backend) are active.  
**Test Data Input**  
Humanized identity (e.g., "Sym Gaming"), dynamic email, 8+ char password.  
**Actions**  
1. Submit empty signup form.  
2. Submit invalid email format.  
3. Submit short password (< 8 chars).  
4. Perform valid registration with interest tags (Technology, Design, Mindfulness).  
**Expected Outcome**  
System rejects invalid inputs with specific error messages; valid registration redirects to `/feed`.  
**Technical Details**  
Uses `clearAndType` helper for React buffer management.

### TC1.2: Boundary Login Testing
**Aim**  
Validate secure authentication and session persistence.  
**Prerequisite**  
User exists in the database.  
**Test Data Input**  
Registered credentials from TC1.1.  
**Actions**  
1. Attempt login with empty fields.  
2. Attempt login with non-existent email.  
3. Attempt login with incorrect password.  
4. Perform valid login with correct credentials.  
**Expected Outcome**  
System displays appropriate error toasts; successful login redirects to `/feed`.  
**Technical Details**  
Uses 5-second synchronization delays to clear loading states.

---

## 2. Social Interaction & Profiles (Social Module)

### TC2.1: Humanized Profile Discovery
**Aim**  
Validate navigation and data loading on external user profiles.  
**Prerequisite**  
User is logged in.  
**Test Data Input**  
URL: `/profile/maryam` (or any existing username).  
**Actions**  
1. Navigate directly to a specific user's profile URL.  
2. Wait for Bio, Followers count, and Post grid to load.  
**Expected Outcome**  
Profile loads successfully; elements like "Follow" button are interactable.  
**Technical Details**  
Navigation handled via React Router v6.

### TC2.2: Profile Customization Audit
**Aim**  
Verify user's ability to update their identity.  
**Prerequisite**  
User is on their own profile page.  
**Test Data Input**  
New Bio: "Audit confirmed: System is stable.", Profile Picture URL.  
**Actions**  
1. Click "Edit Profile".  
2. Update bio and profile picture URL.  
3. Submit "Save Changes".  
**Expected Outcome**  
Changes reflect immediately in the UI without page reload.  
**Technical Details**  
Uses `driver.executeScript` for reliable scroll-to-element.

---

## 3. Circle Management (Circles Module)

### TC3.1: Circle Creation & Navigation
**Aim**  
Validate the end-to-end community creation workflow.  
**Prerequisite**  
User is logged in.  
**Test Data Input**  
Name: "Testing Club", Description: "Modular Audit Group", Type: "Public".  
**Actions**  
1. Fill creation form with name, description, and icon.  
2. Submit and wait for redirect to Circle Profile.  
3. Navigate to Home Feed and enter the circle via Sidebar.  
**Expected Outcome**  
Circle is created; user is redirected; Circle appears in "My Circles" sidebar.  
**Technical Details**  
Verified via slug-based URL redirection.

### TC3.2: Community Chat Sync
**Aim**  
Validate real-time communication within a circle.  
**Prerequisite**  
User is inside a circle profile.  
**Test Data Input**  
Message: "Fixed audit message for [Circle Name]".  
**Actions**  
1. Type message into chat area.  
2. Press Enter or click Send.  
**Expected Outcome**  
Message appears in the chat bubble list with "Just now" timestamp.  
**Technical Details**  
Integrated with Socket.io backend events.

---

## 4. Meeting Lifecycle (Meetings Module)

### TC4.1: Zoom-Integrated Meeting Scheduling
**Aim**  
Validate scheduling of community syncs.  
**Prerequisite**  
User has "Host" privileges (Admin/Mod).  
**Test Data Input**  
Future date/time, Topic, Description.  
**Actions**  
1. Navigate to `/meetings/schedule`.  
2. Select "Testing Club" from dropdown.  
3. Set date/time and submit.  
**Expected Outcome**  
Success toast appears; user redirected to Meetings Dashboard.  
**Technical Details**  
Backfilled with 5-minute buffer to ensure immediate reflection in grid.

### TC4.2: Dashboard Reflection & Refresh
**Aim**  
Ensure new sessions are immediately visible to the user.  
**Prerequisite**  
Meeting successfully scheduled.  
**Test Data Input**  
N/A.  
**Actions**  
1. Navigate to `/meetings`.  
2. Verify "Upcoming Sessions" grid contains the new meeting.  
3. Trigger "Manual Refresh" via UI button.  
**Expected Outcome**  
Meeting is visible immediately; Refresh button triggers loader animation.  
**Technical Details**  
Uses a unified query for hosted and participant meetings.

---

## 5. Administrative Controls (Admin Module)

### TC5.1: Platform KPI Audit
**Aim**  
Verify system-wide health metrics for administrators.  
**Prerequisite**  
Logged in as `admin@gmail.com`.  
**Test Data Input**  
N/A.  
**Actions**  
1. Access `/admin`.  
2. Verify "Total Users", "Active Circles", and "Total Messages" cards.  
**Expected Outcome**  
Numeric metrics are loaded and displayed.  
**Technical Details**  
Uses specialized selectors for KPI containers.

### TC5.2: User & Community Moderation
**Aim**  
Validate administrative power to manage platform safety.  
**Prerequisite**  
Admin is on User/Community Management pages.  
**Test Data Input**  
Target User/Circle ID.  
**Actions**  
1. Suspend a test user and then restore.  
2. Disable a community and then restore.  
**Expected Outcome**  
Status badges update from "Active" to "Suspended/Disabled" and back.  
**Technical Details**  
Actions verified via presence of "Restore" button toggle.

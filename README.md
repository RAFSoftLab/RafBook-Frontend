# RafBook-Frontend

A web and desktop application for students to communicate via text, images, videos, and audio messages. The app features organized channels for different courses, departments, and academic years, as well as notifications and optional video/audio calling capabilities. The frontend is built with **React** for the web, and **Electron** enables it to function as a cross-platform desktop app. It connects to a Java Spring backend.

---

## Features
- **Real-Time Messaging**: Send and receive text, image, and video messages.
- **Organized Channels**: Communication channels organized for specific courses, departments, and academic years.
- **Notifications**: Broadcast notifications for important updates.
- **User Management**: Role-based access control with roles for admin, professor, and student.
- **Optional Video/Audio Calls**: Supports video and audio calls between users.
- **JWT Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **MAC Address Verification**: Required for user registration to verify the device identity.

---

## Technologies
- **React** (Frontend)
- **Electron** (Desktop Application)
- **Redux** (State Management)
- **Socket.IO** or **WebSocket API** (Real-time Messaging)
- **Firebase** (for push notifications)
- **HTML5** & **CSS3**
- **FFmpeg** or **MediaRecorder API** (for video/audio capabilities)
- **IndexedDB / LocalStorage** (for local data caching if needed)

## Requirements
- **Web**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **Desktop**: Node.js 14+ and npm (for building the Electron app)

---

## Features and Usage

### 1. **Authentication**
   - **Register**: Users register with a username, password, and MAC address (for device-specific verification).
   - **Login**: Authenticate using a username and password to obtain a JWT token for secure access.

### 2. **User Interface**
   - **Channels Screen**: Displays all channels available to the user, organized based on user roles (e.g., courses, departments).
   - **Chat Screen**: Shows real-time messages in the selected channel, with options to send text, images, and videos.
   - **Notification Screen**: Lists broadcast notifications sent to the user for important updates.

### 3. **Messaging**
   - **Send Messages**: Allows users to send text, image, and video messages in real time to specific channels.
   - **Receive Messages**: Provides real-time updates in the active channel via WebSocket.
   - **Caching**: Locally caches recent messages for offline viewing, allowing users to access conversation history even without internet.

### 4. **Notifications**
   - **View Notifications**: Displays all system-wide notifications broadcasted to the user.
   - **Push Notifications**: Enables users to receive updates via push notifications, even when the app is in the background.

### 5. **Optional Video/Audio Communication**
   - **Initiate Call**: Allows users to start a video or audio call with other users (if supported).
   - **Receive Call**: Accept incoming calls with video and audio options.

### 6. **Settings**
   - **User Profile**: Allows users to update profile information.
   - **Logout**: Clears the JWT token and logs the user out, ensuring secure access.

## Security

- **JWT Authentication**: Ensures secure access to API endpoints, requiring users to authenticate and obtain a JWT token.
- **Role-Based Access Control**:
   - **Admin**: Full access, including managing users and channels.
   - **Professor**: Access to manage channels related to their courses.
   - **Student**: Access to view and interact within allowed channels.
- **MAC Address Verification**: Required during registration to verify the device, adding an additional layer of security.

---

## Testing

### Unit Tests
- **Testing Framework**: Jest and React Testing Library.
- Tests for individual components, such as network requests, reducers, and components to ensure isolated functionality works as expected.

### Integration Tests
- **Testing Framework**: Cypress.
- Automated end-to-end testing for essential user flows, including login, sending messages, and receiving notifications, to ensure a smooth user experience.

### Desktop-Specific Testing
- **Testing Framework**: Spectron.
- Used for testing Electron-specific functionalities, such as window rendering, menu interactions, and desktop-specific features.


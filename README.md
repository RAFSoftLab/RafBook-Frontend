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

=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation Prerequisites
Before you begin, ensure you have met the following requirements:

    Node.js: Ensure that you have Node.js installed. You can download it from the Node.js official website. It's recommended to use the LTS version.

    Package Manager: You can use npm (comes with Node.js) or yarn. Ensure you have one installed:

        To install yarn, run:

    npm install --global yarn

Git: Make sure you have Git installed to manage version control. Download it from the Git official website.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```



---

## Using Git with Forks and Creating Pull Requests

### 1. Forking a Repository
1. Go to the repository you want to fork on GitHub.
2. Click the `Fork` button at the top right of the repository page.
3. This will create a copy of the repository under your GitHub account.

### 2. Cloning the Forked Repository
1. Navigate to your forked repository on GitHub.
2. Click the `Code` button and copy the URL.
3. Open your terminal and run the following command to clone the repository:

```bash
git clone <your-forked-repo-url>
```

4. Navigate into the cloned repository:

```bash
cd <repository-name>
```

### 3. Setting Up the Upstream Remote
1. Add the original repository as an upstream remote:

```bash
git remote add upstream <original-repo-url>
```

2. Verify the new upstream remote:

```bash
git remote -v
```

### 4. Creating a New Branch
1. Create a new branch for your changes:

```bash
git checkout -b <new-branch-name>
```

### 5. Making Changes and Committing
1. Make your changes to the code.
2. Stage the changes:

```bash
git add .
```

3. Commit the changes:

```bash
git commit -m "Description of the changes"
```

### 6. Pushing Changes to Your Fork
1. Push the changes to your forked repository:

```bash
git push origin <new-branch-name>
```

### 7. Creating a Pull Request
1. Go to your forked repository on GitHub.
2. Click the `Compare & pull request` button.
3. Ensure the base repository is the original repository and the base branch is the branch you want to merge into.
4. Provide a title and description for your pull request.
5. Click `Create pull request`.

### 8. Keeping Your Fork Updated
1. Fetch the latest changes from the upstream repository:

```bash
git fetch upstream
```

2. Merge the changes into your local branch:

```bash
git checkout <branch-name>
git merge upstream/<branch-name>
```

3. Push the updated branch to your fork:

```bash
git push origin <branch-name>
```

This tutorial covers the basic workflow for using Git with forks and creating pull requests.

---

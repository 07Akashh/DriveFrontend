# Cloud Drive Frontend

A modern, responsive cloud storage frontend built with React. Features a Google Drive-like interface with file upload, sharing, and preview capabilities.

## 🚀 Features

- **File Management**: Upload, view, download, and delete files
- **Real-time Uploads**: Chunked uploads with progress tracking via Socket.IO
- **File Preview**: In-app preview for images, videos, audio, and PDFs
- **File Sharing**: Share files with specific users or via public links
- **Trash System**: Soft delete with restore functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Search**: Filter files by name

## 🛠️ Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Authentication**: Firebase Auth
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Notifications**: Sonner

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EmptyState/       # Empty state displays
│   ├── FileList/         # File grid/list view
│   ├── FilePreview/      # File preview modal
│   ├── FileUpload/       # Upload dialog
│   ├── Loading/          # Loading spinners
│   ├── Pagination/       # Pagination controls
│   └── ShareDialog/      # File sharing modal
├── config/               # Firebase configuration
├── constant/             # API endpoints and constants
├── context/              # React contexts (Auth, Theme)
├── hooks/                # Custom React hooks
├── layout/               # Layout components
│   ├── AuthLayout.jsx    # Unauthenticated layout
│   └── MainLayout.jsx    # Authenticated layout with sidebar
├── routes/               # Route definitions
├── services/             # API and Socket services
├── TanstackQuery/        # Query configuration
├── utils/                # Utility functions
└── views/                # Page-level components
    ├── Home/             # Landing page
    ├── MyFiles/          # User's files view
    ├── Shared/           # Shared with me view
    ├── SharedView/       # Public file viewer
    └── Trash/            # Trashed files view
```

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/07Akashh/DriveFrontend
   cd DriveFrontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

   ```env
   # Environment (LOCAL, DEV, PROD)
   REACT_APP_ENV=LOCAL

   # Basic Auth Credentials (for API access)
   REACT_APP_BASIC_AUTH_USERNAME=your_username
   REACT_APP_BASIC_AUTH_PASSWORD=your_password

   # Firebase Configuration
   # Get these from Firebase Console > Project Settings > General
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view in browser.

## 📱 Routes

| Route            | Description          |
| ---------------- | -------------------- |
| `/`              | Landing page (login) |
| `/drive/files`   | My files             |
| `/drive/shared`  | Files shared with me |
| `/drive/trash`   | Trashed files        |
| `/file/:id/view` | Public file viewer   |

## 🎨 Components

### Reusable Components

- **EmptyState**: Display when no items exist
- **Loading**: Loading spinner with message
- **Pagination**: Page navigation controls
- **FileList**: Grid display of files with actions
- **FilePreviewModal**: Full-screen file preview
- **ShareDialog**: Share settings modal

### Usage Example

```jsx
import { Loading, EmptyState, Pagination } from "./components";

// Loading state
<Loading message="Loading files..." size="lg" />

// Empty state
<EmptyState
  icon={EmptyState.Icons.FILE}
  title="No files"
  message="Upload your first file"
  action={<button>Upload</button>}
/>

// Pagination
<Pagination
  page={0}
  limit={12}
  total={100}
  onPageChange={(page) => setPage(page)}
  onLimitChange={(limit) => setLimit(limit)}
/>
```

## 🔐 Authentication

The app uses Firebase Authentication with Google Sign-In:

```jsx
import { useAuth } from "./context/AuthContext";

const { user, isLoggedIn, login, logout } = useAuth();

// Login with Google
await login();

// Logout
await logout();
```

## 📡 API Integration

API calls are made using TanStack Query:

```jsx
import { useCustomQuery, useCustomMutation } from "./TanstackQuery/QueryHooks";
import API_ENDPOINTS from "./constant/apiEndpoints";

// Query
const { data, isLoading } = useCustomQuery({
  queryProps: { queryKey: ["files"] },
  payload: { url: API_ENDPOINTS.MEDIA.LIST },
});

// Mutation
const { mutation } = useCustomMutation();
await mutation.mutateAsync({
  url: API_ENDPOINTS.MEDIA.DELETE(fileId),
  method: "DELETE",
});
```

## 🎯 Key Features

### File Upload

- Drag & drop or click to upload
- Multiple file selection
- Progress tracking per file
- Image compression before upload

### File Preview

- Images: Full view with zoom
- Videos: Built-in player
- Audio: Audio player
- PDFs: Embedded viewer (toolbar hidden)

### File Sharing

- Share with specific email addresses
- Permission levels (View/Edit)
- Public link generation
- Link expiry dates

## 📄 License

MIT

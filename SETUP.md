# Setup Guide

Quick setup guide for the Cloud Drive Frontend application.

## Prerequisites

- Node.js 16+ and npm
- Firebase project with Authentication enabled
- Backend API server running

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start development server
npm start
```

## Environment Variables

| Variable                                 | Description                            | Required |
| ---------------------------------------- | -------------------------------------- | -------- |
| `REACT_APP_ENV`                          | Environment: `LOCAL`, `DEV`, or `PROD` | Yes      |
| `REACT_APP_BASIC_AUTH_USERNAME`          | Basic auth username for API            | Yes      |
| `REACT_APP_BASIC_AUTH_PASSWORD`          | Basic auth password for API            | Yes      |
| `REACT_APP_FIREBASE_API_KEY`             | Firebase API key                       | Yes      |
| `REACT_APP_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain                   | Yes      |
| `REACT_APP_FIREBASE_PROJECT_ID`          | Firebase project ID                    | Yes      |
| `REACT_APP_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket                | Yes      |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID           | Yes      |
| `REACT_APP_FIREBASE_APP_ID`              | Firebase app ID                        | Yes      |

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** > **Sign-in method** > **Google**
4. Go to **Project Settings** > **General**
5. Under "Your apps", add a web app
6. Copy the config values to your `.env` file

## Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm start`     | Start dev server on port 3000 |
| `npm run build` | Build for production          |
| `npm test`      | Run tests                     |

## Troubleshooting

### CORS Errors

Ensure the backend server allows requests from `http://localhost:3000`.

### Firebase Auth Issues

- Verify all Firebase env variables are set correctly
- Check that Google Sign-in is enabled in Firebase Console
- Ensure authorized domains include `localhost`

### Connection Refused

Make sure the backend API server is running before starting the frontend.

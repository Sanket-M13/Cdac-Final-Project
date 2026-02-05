# Google OAuth Setup Instructions

## Create New OAuth Client ID

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create new project or select existing project
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 Client ID:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     * http://localhost:3000
     * http://localhost:5173
     * http://localhost:5000
   - Add Authorized redirect URIs:
     * http://localhost:3000
     * http://localhost:5173
     * http://localhost:5000
5. Copy the Client ID and update your .env file

## Update Environment Variables

Replace VITE_GOOGLE_CLIENT_ID in .env with your new client ID.

## Test Configuration

Use the google-test.html file to verify OAuth is working before testing in main app.
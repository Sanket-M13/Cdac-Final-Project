# Fix Google OAuth "invalid_request" Error

## The Problem
Error 400: invalid_request means your OAuth consent screen isn't properly configured.

## Solution Steps

### 1. Configure OAuth Consent Screen
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "OAuth consent screen"
3. Choose "External" user type (for testing)
4. Fill required fields:
   - **App name**: EV Charger Finder
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **App domain**: Leave blank for testing
   - **Authorized domains**: Leave blank for testing
5. Click "Save and Continue"

### 2. Add Scopes (Optional)
- Skip this step for basic authentication
- Click "Save and Continue"

### 3. Add Test Users
1. Click "Add Users"
2. Add your email: redgear673@gmail.com
3. Add any other test emails you need
4. Click "Save and Continue"

### 4. Review and Submit
- Review your settings
- Click "Back to Dashboard"

### 5. Verify OAuth Client Settings
1. Go to "APIs & Services" > "Credentials"
2. Click on your OAuth 2.0 Client ID
3. Ensure these origins are added:
   - http://localhost:3000
   - http://localhost:5173
   - http://localhost:5000
   - file:// (for testing HTML files directly)

## Alternative: Use Test Mode
If you're still having issues, your app is in "Testing" mode which only allows test users.
Either add your email as a test user OR publish the app (not recommended for development).

## Quick Test
After making these changes, wait 5-10 minutes then test again with google-test.html
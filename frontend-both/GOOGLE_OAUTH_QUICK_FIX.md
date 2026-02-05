# Quick Fix for Google OAuth Origin Error

## The Problem
Error: "The given origin is not allowed for the given client ID"
This means http://localhost:5000 is not in your authorized origins.

## Quick Solution
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Navigate to "APIs & Services" > "Credentials"
3. Click on your OAuth 2.0 Client ID: 1034895935284-kvjte5supe07rd3pqlehhmknjrj2oqko.apps.googleusercontent.com
4. In "Authorized JavaScript origins", ADD:
   - http://localhost:5000
   - http://localhost:5173
   - http://localhost:3000
5. Save changes
6. Wait 5-10 minutes for changes to take effect

## Alternative: Use Different Port
If you can't modify Google Console, run your frontend on port 3000 or 5173 instead of 5000.

## Test
After making changes, test with google-test.html first before trying main app.
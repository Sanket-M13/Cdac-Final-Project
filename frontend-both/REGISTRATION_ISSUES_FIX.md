# Registration Issues - Quick Fix Guide

## Issue 1: Google OAuth Origin Error
**Error**: "The given origin is not allowed for the given client ID"

### IMMEDIATE FIX REQUIRED:
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID: `1034895935284-kvjte5supe07rd3pqlehhmknjrj2oqko.apps.googleusercontent.com`
4. Click "Edit" on this client ID
5. In "Authorized JavaScript origins" section, ADD these URLs:
   - `http://localhost:5000`
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Click "Save"
7. Wait 5-10 minutes for changes to propagate

### Alternative Solution:
If you can't access Google Console, run your app on port 3000 or 5173 instead of 5000.

## Issue 2: EmailJS 422 Error (FIXED)
**Error**: EmailJS API returning 422 status

### What was fixed:
- Reverted EmailJS parameters to original working format
- Changed `actionTitle` from "Email Verification" to "Account Verification"
- Using correct template parameter names that match your EmailJS template

### Current working parameters:
```javascript
{
  email: formData.email,
  userName: userName,
  OTP: otp,
  actionTitle: 'Account Verification',
  actionMessage: 'Welcome message...',
  expiryMinutes: '10',
  year: new Date().getFullYear()
}
```

## Testing Steps:
1. **First**: Fix Google OAuth origins in Google Console
2. **Then**: Test regular email registration (should work now)
3. **Finally**: Test Google OAuth registration (after origin fix)

## Expected Behavior After Fixes:
- ✅ Regular registration with OTP email should work
- ✅ Email should say "Account Verification" instead of "Reset Password"
- ✅ Google OAuth should work without origin errors
- ✅ All registration flows should complete successfully

## If Issues Persist:
1. Check browser console for detailed error messages
2. Verify EmailJS service and template IDs are correct
3. Ensure Google OAuth client ID is active and properly configured
4. Check network tab for actual API response details
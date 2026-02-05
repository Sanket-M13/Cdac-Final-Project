# Quick Fix: Change Frontend Port to Bypass Google OAuth Error

## Option 1: Run Frontend on Port 3000

### If using Vite:
```bash
cd frontend
npm run dev -- --port 3000
```

### If using Create React App:
```bash
cd frontend
PORT=3000 npm start
```

### If using Next.js:
```bash
cd frontend
npm run dev -p 3000
```

## Option 2: Update Package.json
Add to your package.json scripts:
```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "start": "vite --port 3000"
  }
}
```

## Option 3: Create .env file in frontend
```
PORT=3000
VITE_PORT=3000
```

## After changing port:
1. Access your app at `http://localhost:3000`
2. Google OAuth should work since 3000 is likely already authorized
3. Update your backend CORS if needed to allow port 3000

## If still not working:
The issue might be with the Google OAuth client ID itself. You may need to:
1. Create a new OAuth client ID
2. Or contact the original creator for access to modify the existing one
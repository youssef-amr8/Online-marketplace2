# Quick Start Guide - Fix Port Issues

## The Problem
- **Backend** runs on port **3000**
- **Buyer App** (React) tries to use port **3000** by default → **CONFLICT!**
- **Seller App** (Vite) uses port **5175** ✅ (no conflict)

## Solution: Set Buyer App to Port 3001

### Method 1: Run Setup Script (Easiest - Recommended)

**Windows:**
```bash
setup-ports.bat
```

**Linux/Mac:**
```bash
chmod +x setup-ports.sh
./setup-ports.sh
```

This will automatically create the `.env` files with correct port configuration.

### Method 2: Create .env file Manually

Create a file named `.env` in `frontend/buyer-app/` folder with this content:

```
PORT=3001
REACT_APP_API_URL=http://localhost:3000/api
```

Then run:
```bash
cd frontend/buyer-app
npm start
```

### Method 3: Windows PowerShell
```powershell
cd frontend/buyer-app
$env:PORT=3001
npm start
```

### Method 4: Windows CMD
```cmd
cd frontend/buyer-app
set PORT=3001
npm start
```

### Method 5: Linux/Mac
```bash
cd frontend/buyer-app
PORT=3001 npm start
```

## Running All Services

### Terminal 1: Backend (Port 3000)
```bash
cd online-marketplace/backend/server
npm install
npm run dev
```

**⚠️ IMPORTANT:** Make sure you're in the `backend/server/` directory, NOT just `backend/`!

### Terminal 2: Buyer App (Port 3001)
```bash
cd online-marketplace/frontend/buyer-app
# Use one of the methods above to set PORT=3001
npm start
```

### Terminal 3: Seller App (Port 5175)
```bash
cd online-marketplace/frontend/seller-app
npm run dev
```

## Verify Ports Are Correct

After starting, you should see:
- ✅ Backend: `Backend running on http://localhost:3000`
- ✅ Buyer App: `webpack compiled` and opens on `http://localhost:3001`
- ✅ Seller App: `Local: http://localhost:5175`

## If Port 3001 is Also Busy

If port 3001 is busy, use any other port (3002, 3003, etc.) and update:
1. The PORT in buyer app
2. Add the port to CORS in `backend/server/app.js` allowedOrigins array

## Troubleshooting

**Error: "Port 3000 is already in use"**
- Backend is already running, or another app is using port 3000
- Solution: Kill the process or use a different port for backend

**Error: "Cannot connect to server"**
- Backend is not running
- Solution: Start backend first on port 3000

**CORS Errors**
- Frontend origin not in backend's allowed list
- Solution: Backend already allows all origins in dev mode, but check `backend/server/app.js`


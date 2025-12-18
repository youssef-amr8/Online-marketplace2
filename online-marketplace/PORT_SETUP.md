# Port Configuration Guide

## Port Assignment

To avoid port conflicts, use these ports:

- **Backend Server**: Port **3000**
- **Buyer App (React)**: Port **3001** 
- **Seller App (Vite)**: Port **5175** (already configured)

## Setup Instructions

### 1. Buyer App Port Configuration

The buyer app (React) defaults to port 3000, which conflicts with the backend. 

**Option A: Use Environment Variable (Recommended)**

Create a `.env` file in `frontend/buyer-app/`:
```
PORT=3001
REACT_APP_API_URL=http://localhost:3000/api
```

**Option B: Set Port in package.json**

Add to `package.json` scripts:
```json
"start": "PORT=3001 react-scripts start"
```

**Option C: Windows PowerShell**
```powershell
$env:PORT=3001; npm start
```

**Option D: Windows CMD**
```cmd
set PORT=3001 && npm start
```

### 2. Seller App Configuration

The seller app is already configured to use port 5175 in `vite.config.js`.

To set a custom API URL, create `.env` in `frontend/seller-app/`:
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Backend Configuration

The backend runs on port 3000 (default). CORS is configured to allow:
- http://localhost:3001 (Buyer App)
- http://localhost:5175 (Seller App)
- http://localhost:5173 (Vite default, if needed)

## Running the Project

### Terminal 1: Backend
```bash
cd online-marketplace/backend/server
npm install
npm run dev
```
Backend will run on: http://localhost:3000

### Terminal 2: Buyer App
```bash
cd online-marketplace/frontend/buyer-app
npm install
# Set port (choose one method above)
npm start
```
Buyer app will run on: http://localhost:3001

### Terminal 3: Seller App
```bash
cd online-marketplace/frontend/seller-app
npm install
npm run dev
```
Seller app will run on: http://localhost:5175

## Troubleshooting

### Port Already in Use Error

If you get "Port 3000 is already in use":
1. Check what's using the port: `netstat -ano | findstr :3000` (Windows)
2. Kill the process or change the port
3. For backend, set `PORT=3000` in `.env` file

### CORS Errors

If you see CORS errors:
1. Make sure backend is running
2. Check that your frontend origin is in the allowedOrigins array in `backend/server/app.js`
3. Backend currently allows all origins in development mode

### Connection Refused

If you see "Cannot connect to server":
1. Make sure backend is running on port 3000
2. Check the API URL in frontend apps matches backend URL
3. Verify MongoDB is running and connected


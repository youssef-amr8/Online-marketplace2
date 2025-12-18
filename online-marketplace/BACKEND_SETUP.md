# Backend Setup Instructions

## ⚠️ IMPORTANT: Correct Directory

The backend `package.json` is located in:
```
online-marketplace/backend/server/
```

**NOT** in:
```
online-marketplace/backend/
```

## Setup Steps

### 1. Navigate to the Correct Directory

**Windows PowerShell:**
```powershell
cd "D:\ASU needs\WebDevelopment\Project\online-marketplace\backend\server"
```

**Or from the backend folder:**
```powershell
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File (if needed)

Create a `.env` file in `backend/server/` with:

```
PORT=3000
DB_URI=mongodb://localhost:27017/marketPlace
# Or use MongoDB Atlas:
# DB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketPlace
```

### 4. Start the Backend

```bash
npm run dev
```

You should see:
```
Connected to MongoDB: mongodb://localhost:27017/marketPlace
Backend running on http://localhost:3000
```

## Troubleshooting

### Error: "Could not read package.json"
- **Problem:** You're in the wrong directory
- **Solution:** Make sure you're in `backend/server/` not `backend/`

### Error: "MongoDB connection error"
- **Problem:** MongoDB is not running
- **Solution:** 
  - Start MongoDB locally, OR
  - Use MongoDB Atlas and update `DB_URI` in `.env`

### Error: "Port 3000 is already in use"
- **Problem:** Another application is using port 3000
- **Solution:** 
  - Kill the process using port 3000, OR
  - Change PORT in `.env` file to a different port (e.g., 3001)

## Quick Command Reference

```bash
# Navigate to backend
cd online-marketplace/backend/server

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Seed database (optional)
npm run seed
```


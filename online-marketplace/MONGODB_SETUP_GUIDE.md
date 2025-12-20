# MongoDB Atlas Setup Guide

## Step 1: Get Your Connection String

1. In MongoDB Atlas, click **"Connect"** on your Cluster0
2. Choose **"Connect your application"**
3. Select **Driver: Node.js** and **Version: 5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add database name after `.net/`: change to `.net/marketPlace?retryWrites=true&w=majority`

**Final format should look like:**
```
mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/marketPlace?retryWrites=true&w=majority
```

## Step 2: Create .env File

Create a file named `.env` in `backend/server/` directory with:

```
MONGO_URI=your_connection_string_here
JWT_SECRET=your_secret_key_here
PORT=3000
```

## Step 3: Run the Services

### Terminal 1 - Backend
```bash
cd online-marketplace/backend/server
npm install
npm run dev
```

### Terminal 2 - Buyer App
```bash
cd online-marketplace/frontend/buyer-app
npm start
```

### Terminal 3 - Seller App
```bash
cd online-marketplace/frontend/seller-app
npm run dev
```

## Verify

- Backend: http://localhost:3000
- Buyer App: http://localhost:3001
- Seller App: http://localhost:5175

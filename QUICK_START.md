# Quick Start Guide - MongoDB Migration

## 🚀 Quick Setup (5 minutes)

### 1. Install MongoDB

**Option A: Local MongoDB**
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account and cluster
- Get connection string

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/financial_recovery
JWT_SECRET=your-secret-key-here
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup Frontend

Create `.env` in project root:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Start Everything

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## ✅ What's Changed

- ✅ Removed Supabase dependency
- ✅ Added MongoDB backend API
- ✅ JWT authentication
- ✅ All database operations via REST API
- ✅ Real-time replaced with polling (5s intervals)

## 📝 First Time Setup

1. Start MongoDB (local or Atlas)
2. Configure backend `.env`
3. Configure frontend `.env`
4. Install backend dependencies: `cd backend && npm install`
5. Start backend: `npm run dev` (in backend folder)
6. Start frontend: `npm run dev` (in root folder)
7. Sign up a new account
8. Start using the app!

## 🔧 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 3001 is not in use

**Frontend can't connect:**
- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for CORS errors

**Authentication issues:**
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify user exists in MongoDB

For detailed setup, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)


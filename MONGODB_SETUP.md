# MongoDB Migration Guide

This guide will help you set up MongoDB for your Financial Recovery System, replacing Supabase.

## Prerequisites

1. **MongoDB Installation**
   - Option 1: Install MongoDB locally
     - Download from: https://www.mongodb.com/try/download/community
     - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
   
   - Option 2: Use MongoDB Atlas (Cloud)
     - Sign up at: https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get your connection string

2. **Node.js** (v18 or higher)
   - Required for the backend API

## Setup Instructions

### Step 1: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your MongoDB connection details:

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/financial_recovery
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=your uri
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   ```

   **Important:** 
   - Replace `username` and `password` with your MongoDB Atlas credentials
   - Replace `cluster` with your actual cluster name
   - Generate a strong JWT_SECRET (you can use: `openssl rand -base64 32`)

### Step 3: Configure Frontend Environment

Create a `.env` file in the root directory (same level as `package.json`):

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

The server should start on `http://localhost:3001`

### Step 5: Start the Frontend

In a new terminal, navigate to the project root and start the frontend:

```bash
npm run dev
```

## Database Collections

The following collections will be automatically created when you first use the application:

1. **users** - User accounts and authentication
2. **transactions** - Financial transactions (income/expense)
3. **invoices** - Invoice records
4. **loans** - Loan information
5. **financial_records** - Detailed financial records from CSV uploads

## API Endpoints

The backend provides the following REST API endpoints:

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan
- `DELETE /api/loans/:id` - Delete loan

### Financial Records
- `GET /api/financial-records` - Get all financial records
- `POST /api/financial-records` - Save financial records (replaces existing)
- `DELETE /api/financial-records` - Delete all financial records for user

## Migration from Supabase

### What Changed:

1. **Authentication**: Now uses JWT tokens stored in localStorage instead of Supabase sessions
2. **Database**: MongoDB replaces PostgreSQL (Supabase)
3. **Real-time**: Replaced with polling every 5 seconds (can be upgraded to WebSockets if needed)
4. **API**: All database operations now go through REST API instead of direct Supabase client

### Removed Dependencies:
- `@supabase/supabase-js` - No longer needed

### New Backend:
- Express.js server with MongoDB driver
- JWT-based authentication
- RESTful API endpoints

## Troubleshooting

### Connection Issues

1. **MongoDB not connecting:**
   - Check if MongoDB is running: `mongosh` or check Docker container
   - Verify connection string in `.env`
   - For Atlas: Check IP whitelist and credentials

2. **CORS errors:**
   - Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
   - Default is `http://localhost:5173` for Vite

3. **Authentication errors:**
   - Clear browser localStorage: `localStorage.clear()`
   - Check JWT_SECRET is set correctly
   - Verify token is being sent in Authorization header

### Database Issues

1. **Collections not created:**
   - They are created automatically on first use
   - Check MongoDB connection is working

2. **Data not persisting:**
   - Check MongoDB connection
   - Verify user_id is being set correctly
   - Check backend logs for errors

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT_SECRET** in production
3. **Enable MongoDB authentication** in production
4. **Use HTTPS** in production
5. **Implement rate limiting** for production API

## Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or managed MongoDB
3. Set strong `JWT_SECRET`
4. Configure proper CORS origins
5. Use environment variables for all secrets
6. Enable MongoDB authentication
7. Set up SSL/TLS for MongoDB connection
8. Consider adding rate limiting and request validation

## Support

If you encounter issues:
1. Check backend server logs
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Ensure all environment variables are set correctly


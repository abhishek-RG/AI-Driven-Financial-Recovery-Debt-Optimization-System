import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_recovery';
const DB_NAME = process.env.DB_NAME || 'financial_recovery';

let client = null;
let db = null;

export const connectToDatabase = async () => {
  try {
    if (client && db) {
      return { client, db };
    }

    client = new MongoClient(MONGODB_URI);

    await client.connect();
    db = client.db(DB_NAME);
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Create indexes for better performance
    await createIndexes(db);
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const createIndexes = async (db) => {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Transactions collection indexes
    await db.collection('transactions').createIndex({ user_id: 1, date: -1 });
    
    // Invoices collection indexes
    await db.collection('invoices').createIndex({ user_id: 1, date: -1 });
    
    // Loans collection indexes
    await db.collection('loans').createIndex({ user_id: 1, start_date: -1 });
    
    // Financial records collection indexes
    await db.collection('financial_records').createIndex({ user_id: 1, date: 1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};


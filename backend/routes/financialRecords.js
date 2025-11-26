import express from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Save financial records (replaces all existing records for user)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Records must be an array' });
    }

    const db = getDatabase();
    const financialRecordsCollection = db.collection('financial_records');

    // Delete existing records for this user
    await financialRecordsCollection.deleteMany({ user_id: req.user.userId });

    // Insert new records
    const recordsToInsert = records.map(record => ({
      ...record,
      user_id: req.user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (recordsToInsert.length > 0) {
      await financialRecordsCollection.insertMany(recordsToInsert);
    }

    res.status(201).json({ message: 'Financial records saved successfully' });
  } catch (error) {
    console.error('Save financial records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get financial records for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const financialRecordsCollection = db.collection('financial_records');
    
    const records = await financialRecordsCollection
      .find({ user_id: req.user.userId })
      .sort({ date: 1 })
      .toArray();

    res.json(records);
  } catch (error) {
    console.error('Get financial records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete financial records for user
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const financialRecordsCollection = db.collection('financial_records');

    const result = await financialRecordsCollection.deleteMany({ user_id: req.user.userId });

    res.json({ message: 'Financial records deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete financial records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


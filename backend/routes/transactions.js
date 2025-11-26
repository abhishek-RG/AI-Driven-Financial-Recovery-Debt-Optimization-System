import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all transactions for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const transactionsCollection = db.collection('transactions');
    
    const transactions = await transactionsCollection
      .find({ user_id: req.user.userId })
      .sort({ date: -1 })
      .toArray();

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, description, category, amount, type } = req.body;

    if (!date || !description || !category || amount === undefined || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDatabase();
    const transactionsCollection = db.collection('transactions');

    const transaction = {
      user_id: req.user.userId,
      date,
      description,
      category,
      amount: parseFloat(amount),
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await transactionsCollection.insertOne(transaction);
    const insertedTransaction = await transactionsCollection.findOne({ _id: result.insertedId });

    res.status(201).json(insertedTransaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID format' });
    }

    const db = getDatabase();
    const transactionsCollection = db.collection('transactions');

    const result = await transactionsCollection.deleteOne({
      _id: new ObjectId(id),
      user_id: req.user.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


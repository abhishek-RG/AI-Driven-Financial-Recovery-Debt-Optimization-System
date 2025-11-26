import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all loans for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const loansCollection = db.collection('loans');
    
    const loans = await loansCollection
      .find({ user_id: req.user.userId })
      .sort({ start_date: -1 })
      .toArray();

    res.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create loan
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { loan_name, principal_amount, interest_rate, start_date, end_date, monthly_payment, status } = req.body;

    if (!loan_name || principal_amount === undefined || interest_rate === undefined || !start_date || !end_date || monthly_payment === undefined || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDatabase();
    const loansCollection = db.collection('loans');

    const loan = {
      user_id: req.user.userId,
      loan_name,
      principal_amount: parseFloat(principal_amount),
      interest_rate: parseFloat(interest_rate),
      start_date,
      end_date,
      monthly_payment: parseFloat(monthly_payment),
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await loansCollection.insertOne(loan);
    const insertedLoan = await loansCollection.findOne({ _id: result.insertedId });

    res.status(201).json(insertedLoan);
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete loan
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid loan ID format' });
    }

    const db = getDatabase();
    const loansCollection = db.collection('loans');

    const result = await loansCollection.deleteOne({
      _id: new ObjectId(id),
      user_id: req.user.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


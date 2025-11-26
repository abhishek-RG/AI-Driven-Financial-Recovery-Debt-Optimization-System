import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all invoices for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const invoicesCollection = db.collection('invoices');
    
    const invoices = await invoicesCollection
      .find({ user_id: req.user.userId })
      .sort({ date: -1 })
      .toArray();

    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { invoice_number, client_name, date, due_date, amount, status } = req.body;

    if (!invoice_number || !client_name || !date || !due_date || amount === undefined || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDatabase();
    const invoicesCollection = db.collection('invoices');

    const invoice = {
      user_id: req.user.userId,
      invoice_number,
      client_name,
      date,
      due_date,
      amount: parseFloat(amount),
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await invoicesCollection.insertOne(invoice);
    const insertedInvoice = await invoicesCollection.findOne({ _id: result.insertedId });

    res.status(201).json(insertedInvoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete invoice
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid invoice ID format' });
    }

    const db = getDatabase();
    const invoicesCollection = db.collection('invoices');

    const result = await invoicesCollection.deleteOne({
      _id: new ObjectId(id),
      user_id: req.user.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


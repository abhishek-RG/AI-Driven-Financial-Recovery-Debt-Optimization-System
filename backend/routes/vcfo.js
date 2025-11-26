import express from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Fetch stored VCFO conversation for the authenticated user
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const messagesCollection = db.collection('vcfo_messages');

    const messages = await messagesCollection
      .find({ user_id: req.user.userId })
      .sort({ createdAt: 1 })
      .toArray();

    res.json(messages);
  } catch (error) {
    console.error('Get VCFO messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Persist a single VCFO message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { role, content, image_url, secondary_image_url, meta } = req.body;

    if (!role || !content) {
      return res.status(400).json({ error: 'Role and content are required' });
    }

    const db = getDatabase();
    const messagesCollection = db.collection('vcfo_messages');

    const message = {
      user_id: req.user.userId,
      role,
      content,
      image_url: image_url || null,
      secondary_image_url: secondary_image_url || null,
      meta: meta || null,
      createdAt: new Date(),
    };

    const result = await messagesCollection.insertOne(message);
    const insertedMessage = await messagesCollection.findOne({ _id: result.insertedId });

    res.status(201).json(insertedMessage);
  } catch (error) {
    console.error('Create VCFO message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear VCFO conversation for the authenticated user
router.delete('/messages', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const messagesCollection = db.collection('vcfo_messages');

    await messagesCollection.deleteMany({ user_id: req.user.userId });

    res.json({ message: 'Conversation cleared successfully' });
  } catch (error) {
    console.error('Delete VCFO messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch uploaded CSV metadata for VCFO
router.get('/uploads', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const uploadsCollection = db.collection('vcfo_uploads');

    const uploads = await uploadsCollection
      .find({ user_id: req.user.userId })
      .sort({ uploadedAt: 1 })
      .toArray();

    res.json(uploads);
  } catch (error) {
    console.error('Get VCFO uploads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Persist CSV upload metadata for VCFO
router.post('/uploads', authenticateToken, async (req, res) => {
  try {
    const { originalName, storedPath, size, mimeType } = req.body;

    if (!originalName) {
      return res.status(400).json({ error: 'originalName is required' });
    }

    const db = getDatabase();
    const uploadsCollection = db.collection('vcfo_uploads');

    const upload = {
      user_id: req.user.userId,
      originalName,
      storedPath: storedPath || null,
      size: typeof size === 'number' ? size : null,
      mimeType: mimeType || null,
      uploadedAt: new Date(),
    };

    const result = await uploadsCollection.insertOne(upload);
    const insertedUpload = await uploadsCollection.findOne({ _id: result.insertedId });

    res.status(201).json(insertedUpload);
  } catch (error) {
    console.error('Create VCFO upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


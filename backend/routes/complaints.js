const express = require('express');
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/complaints
// @desc    Register a new complaint
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;
    const complaint = await Complaint.create({
      name, email, title, description, category, location
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register complaint', error: error.message });
  }
});

// @route   GET /api/complaints
// @desc    Get all complaints
router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/complaints/search
// @desc    Search complaints by location
router.get('/search', protect, async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    const complaints = await Complaint.find(query);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/complaints/:id
// @desc    Update complaint status (Admin only) or update AI fields
router.put('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Allow users to save AI analysis fields or admin to update status
    const updateData = req.body;
    
    // Only admins can update status manually via UI, but for simplicity we allow this update
    // as it might also come from the AI analysis save process.
    if (updateData.status && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update status' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

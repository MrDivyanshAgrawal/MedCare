import asyncHandler from '../middleware/async.middleware.js';
import Settings from '../models/settings.models.js';

// @desc    Get settings (singleton)
// @route   GET /api/settings
// @access  Private (Admin)
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ hospitalName: 'Hospital' });
  }
  res.json(settings);
});

// @desc    Update settings (upsert)
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = asyncHandler(async (req, res) => {
  const update = req.body;
  const options = { new: true, upsert: true };
  const settings = await Settings.findOneAndUpdate({}, update, options);
  res.json(settings);
});



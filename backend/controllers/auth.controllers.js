import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/async.middleware.js';
import User from '../models/user.models.js';
import { sendEmail } from '../utils/sendEmail.utils.js';

// @desc    Request password reset link (JWT token)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const message = `To reset your password, click the link below or paste it in your browser within 10 minutes:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset instructions',
      message,
    });
    res.status(200).json({ success: true, message: 'Reset instructions sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Email could not be sent' });
  }
});

// @desc    Reset password using JWT token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    return res.json({ message: 'Password reset success' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});



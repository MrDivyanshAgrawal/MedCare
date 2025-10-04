import User from '../models/user.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';
import { cloudinary } from '../utils/cloudinary.utils.js'
import { sendEmail } from '../utils/sendEmail.utils.js';
// removed crypto usage; password reset handled via auth controller with JWT

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
  });

  // Send welcome email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Hospital Management System',
      message: `Hi ${user.name}, thank you for registering with our hospital management system.`,
    });
  } catch (err) {
    console.log('Email could not be sent', err);
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
      token: user.generateAuthToken(),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profilePicture: user.profilePicture,
    token: user.generateAuthToken(),
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  // Upload profile picture if provided
  if (req.body.profilePicture && req.body.profilePicture !== user.profilePicture) {
    // Delete old profile picture from cloudinary if it's not the default one
    if (user.profilePicture && !user.profilePicture.includes('default-avatar')) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    user.profilePicture = req.body.profilePicture;
  }

  const updatedUser = await user.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'user',
    user._id,
    { fields: Object.keys(req.body) }
  );

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    profilePicture: updatedUser.profilePicture,
    token: updatedUser.generateAuthToken(),
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.emailVerified = req.body.emailVerified !== undefined ? req.body.emailVerified : user.emailVerified;

  const updatedUser = await user.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'user',
    user._id,
    { fields: Object.keys(req.body) }
  );

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    emailVerified: updatedUser.emailVerified,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Delete user's profile picture if it's not the default one
  if (user.profilePicture && !user.profilePicture.includes('default-avatar')) {
    const publicId = user.profilePicture.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  }

  await user.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'user',
    user._id,
    { userId: user._id }
  );

  res.json({ message: 'User removed' });
});

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
// password reset handlers moved to auth controller
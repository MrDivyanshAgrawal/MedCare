import Doctor from '../models/doctor.models.js';
import User from '../models/user.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';
import { sendEmail } from '../utils/sendEmail.utils.js';

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private (Doctor, Admin)
export const createDoctor = asyncHandler(async (req, res) => {
  const {
    specialization,
    licenseNumber,
    experience,
    qualification,
    clinicAddress,
    consultationFee,
    availability,
    about,
    documents
  } = req.body;

  // Check if user is doctor or admin
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to create doctor profile' });
  }

  // Check if user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if doctor profile already exists for the user
  const existingDoctor = await Doctor.findOne({ user: req.user._id });
  if (existingDoctor) {
    return res.status(400).json({ message: 'Doctor profile already exists for this user' });
  }

  // If admin is creating, auto-approve the doctor
  const isApproved = req.user.role === 'admin';

  // Create doctor profile
  const doctor = await Doctor.create({
    user: req.user._id,
    specialization,
    licenseNumber,
    experience,
    qualification,
    clinicAddress,
    consultationFee,
    availability,
    about,
    documents,
    isApproved
  });

  // Create audit log
  await createAuditLog(
    req,
    'create',
    'doctor',
    doctor._id,
    { doctorId: doctor._id, isApproved }
  );

  res.status(201).json(doctor);
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = asyncHandler(async (req, res) => {
  const filter = {};
  if (!req.user || req.user.role !== 'admin') {
    filter.isApproved = true;
  }

  let query = Doctor.find(filter).populate('user', 'name email phone profilePicture');

  // Optional: limit and sort support for homepage
  const { limit, sort } = req.query;
  if (sort === 'rating') {
    query = query.sort({ rating: -1 });
  }
  if (limit) {
    const parsed = parseInt(limit, 10);
    if (!Number.isNaN(parsed)) {
      query = query.limit(parsed);
    }
  }

  const doctors = await query;
  res.json(doctors);
});

// @desc    Get doctor profile by ID
// @route   GET /api/doctors/:id
// @access  Public (Limited info) / Private (Full info)
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone profilePicture');

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Only show approved doctors to the public
  if (!req.user && !doctor.isApproved) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // If the user is not the doctor or admin, and the doctor is not approved, don't show
  if (
    req.user &&
    req.user.role !== 'admin' &&
    doctor.user._id.toString() !== req.user._id.toString() &&
    !doctor.isApproved
  ) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  res.json(doctor);
});

// @desc    Get doctor profile for current user
// @route   GET /api/doctors/me
// @access  Private (Doctor)
export const getMyDoctorProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can access their own profile' });
  }

  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone profilePicture');

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor profile not found' });
  }

  res.json(doctor);
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private
export const updateDoctor = asyncHandler(async (req, res) => {
  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Restrict access based on role
  if (
    req.user.role === 'doctor' && 
    doctor.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Not authorized to update this doctor profile' });
  }

  // Update fields
  const {
    specialization,
    licenseNumber,
    experience,
    qualification,
    clinicAddress,
    consultationFee,
    availability,
    about,
    documents
  } = req.body;

  // Update fields if provided
  if (specialization) doctor.specialization = specialization;
  if (licenseNumber) doctor.licenseNumber = licenseNumber;
  if (experience) doctor.experience = experience;
  if (qualification) doctor.qualification = qualification;
  if (clinicAddress) doctor.clinicAddress = clinicAddress;
  if (consultationFee) doctor.consultationFee = consultationFee;
  if (availability) doctor.availability = availability;
  if (about !== undefined) doctor.about = about;
  if (documents) doctor.documents = documents;

  // Only admin can approve doctors
  if (req.user.role === 'admin' && req.body.isApproved !== undefined) {
    doctor.isApproved = req.body.isApproved;
  }

  const updatedDoctor = await doctor.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'doctor',
    doctor._id,
    { fields: Object.keys(req.body) }
  );

  res.json(updatedDoctor);
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
export const deleteDoctor = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete doctor profiles' });
  }

  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  await doctor.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'doctor',
    req.params.id,
    { doctorId: req.params.id }
  );

  res.json({ message: 'Doctor removed' });
});

// @desc    Approve or reject doctor
// @route   PUT /api/doctors/:id/approve
// @access  Private (Admin)
export const approveDoctor = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can approve or reject doctors' });
  }

  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Get the approval status from request body
  const isApproved = req.body.isApproved === true;
  doctor.isApproved = isApproved;

  const updatedDoctor = await doctor.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'doctor',
    doctor._id,
    { field: 'isApproved', value: isApproved }
  );

  // Send notification email to the doctor
  try {
    // Get doctor's user details to send email
    const doctorUser = await User.findById(doctor.user);
    if (doctorUser && doctorUser.email) {
      const emailSubject = isApproved 
        ? 'Your Doctor Profile Has Been Approved'
        : 'Your Doctor Profile Approval Status';
      
      const emailMessage = isApproved
        ? `Dear Dr. ${doctorUser.name},\n\nCongratulations! Your doctor profile has been approved. You can now start accepting appointments through our platform.\n\nThank you for joining our healthcare network.`
        : `Dear Dr. ${doctorUser.name},\n\nWe regret to inform you that your doctor profile has not been approved at this time. Please contact our administrator for more information.\n\nThank you for your interest in joining our healthcare network.`;
      
      await sendEmail({
        email: doctorUser.email,
        subject: emailSubject,
        message: emailMessage
      });
    }
  } catch (error) {
    console.error('Error sending doctor approval email:', error);
    // Continue with the response even if email fails
  }

  res.json(updatedDoctor);
});

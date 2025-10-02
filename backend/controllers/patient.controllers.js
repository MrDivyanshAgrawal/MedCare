import Patient from '../models/patient.models.js';
import User from '../models/user.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';

// @desc    Create patient profile
// @route   POST /api/patients
// @access  Private (Patient, Admin)
export const createPatient = asyncHandler(async (req, res) => {
  const {
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    allergies,
    chronicConditions,
    medicalHistory,
    insurance
  } = req.body;

  // Check if user is patient or admin
  if (req.user.role !== 'patient' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to create patient profile' });
  }

  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if patient profile already exists for the user
  const existingPatient = await Patient.findOne({ user: req.user._id });
  if (existingPatient) {
    return res.status(400).json({ message: 'Patient profile already exists for this user' });
  }

  // Create patient profile
  const patient = await Patient.create({
    user: req.user._id,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    allergies,
    chronicConditions,
    medicalHistory,
    insurance
  });

  // Create audit log
  await createAuditLog(
    req,
    'create',
    'patient',
    patient._id,
    { patientId: patient._id }
  );

  res.status(201).json(patient);
});

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin, Doctor)
export const getPatients = asyncHandler(async (req, res) => {
  // Only admin and doctor can see all patients
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Not authorized to access all patient records' });
  }

  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const patients = await Patient.find({}).populate('user', 'name email phone profilePicture');
  res.json(patients);
});

// @desc    Get patient profile by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = asyncHandler(async (req, res) => {
  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const patient = await Patient.findById(req.params.id).populate('user', 'name email phone profilePicture');

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Restrict access based on role
  if (
    req.user.role === 'patient' && 
    patient.user._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Not authorized to access this patient profile' });
  }

  res.json(patient);
});

// @desc    Get patient profile for current user
// @route   GET /api/patients/me
// @access  Private (Patient)
export const getMyPatientProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Only patients can access their own profile' });
  }

  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const patient = await Patient.findOne({ user: req.user._id }).populate('user', 'name email phone profilePicture');

  if (!patient) {
    return res.status(404).json({ message: 'Patient profile not found' });
  }

  res.json(patient);
});

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = asyncHandler(async (req, res) => {
  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Restrict access based on role
  if (
    req.user.role === 'patient' && 
    patient.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Not authorized to update this patient profile' });
  }

  // Update fields
  const {
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    allergies,
    chronicConditions,
    medicalHistory,
    insurance
  } = req.body;

  patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
  patient.gender = gender || patient.gender;
  patient.bloodGroup = bloodGroup || patient.bloodGroup;
  patient.address = address || patient.address;
  patient.emergencyContact = emergencyContact || patient.emergencyContact;
  patient.allergies = allergies || patient.allergies;
  patient.chronicConditions = chronicConditions || patient.chronicConditions;
  patient.medicalHistory = medicalHistory !== undefined ? medicalHistory : patient.medicalHistory;
  patient.insurance = insurance || patient.insurance;

  const updatedPatient = await patient.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'patient',
    patient._id,
    { fields: Object.keys(req.body) }
  );

  res.json(updatedPatient);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
export const deletePatient = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete patient profiles' });
  }

  // Verify user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  await patient.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'patient',
    req.params.id,
    { patientId: req.params.id }
  );

  res.json({ message: 'Patient removed' });
});

import Prescription from '../models/prescription.models.js';
import MedicalRecord from '../models/medicalRecord.models.js';
import Patient from '../models/patient.models.js';
import Doctor from '../models/doctor.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';
import { sendEmail } from '../utils/sendEmail.utils.js';

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor, Admin)
export const createPrescription = asyncHandler(async (req, res) => {
  const {
    medicalRecordId,
    medications,
    instructions,
    expiryDate
  } = req.body;

  // Verify medical record exists
  const medicalRecord = await MedicalRecord.findById(medicalRecordId);
  if (!medicalRecord) {
    return res.status(404).json({ message: 'Medical record not found' });
  }

  const patientId = medicalRecord.patient;
  
  // Get doctor ID based on role
  let doctorId;

  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    doctorId = doctor._id;

    // Verify that this doctor is the one who created the medical record
    if (medicalRecord.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: 'You can only create prescriptions for your own medical records' });
    }
  } else if (req.user.role === 'admin') {
    doctorId = medicalRecord.doctor;
  } else {
    return res.status(403).json({ message: 'Only doctors and admins can create prescriptions' });
  }

  // Create prescription
  const prescription = await Prescription.create({
    patient: patientId,
    doctor: doctorId,
    medicalRecord: medicalRecordId,
    medications,
    instructions,
    expiryDate,
    status: 'active'
  });

  // Create audit log
  await createAuditLog(
    req,
    'create',
    'prescription',
    prescription._id,
    { 
      prescriptionId: prescription._id, 
      patientId, 
      doctorId, 
      medicalRecordId 
    }
  );

  // Send notification to patient
  try {
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      });

    const patientEmail = populatedPrescription.patient.user.email;
    
    await sendEmail({
      email: patientEmail,
      subject: 'New Prescription Available',
      message: `Dr. ${populatedPrescription.doctor.user.name} has issued a new prescription for you. Please check your account for details.`,
    });
  } catch (err) {
    console.log('Email notification could not be sent', err);
  }

  res.status(201).json(prescription);
});

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = asyncHandler(async (req, res) => {
  let prescriptions;

  // Filter prescriptions based on user role
  if (req.user.role === 'admin') {
    // Admin can see all prescriptions
    prescriptions = await Prescription.find()
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate('medicalRecord');
  } else if (req.user.role === 'doctor') {
    // Doctors can only see prescriptions they created
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate('medicalRecord');
  } else if (req.user.role === 'patient') {
    // Patients can only see their own prescriptions
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    prescriptions = await Prescription.find({ patient: patient._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate('medicalRecord');
  } else {
    return res.status(403).json({ message: 'Not authorized to view prescriptions' });
  }

  res.json(prescriptions);
});

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone profilePicture' }
    })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone profilePicture' }
    })
    .populate('medicalRecord');

  if (!prescription) {
    return res.status(404).json({ message: 'Prescription not found' });
  }

  // Check if the user is authorized to view this prescription
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || patient._id.toString() !== prescription.patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || doctor._id.toString() !== prescription.doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this prescription' });
  }

  res.json(prescription);
});

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor who created it, Admin)
export const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    return res.status(404).json({ message: 'Prescription not found' });
  }

  // Check permissions
  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || doctor._id.toString() !== prescription.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this prescription' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update prescriptions' });
  }

  // Update fields
  const {
    medications,
    instructions,
    expiryDate,
    status
  } = req.body;

  if (medications) prescription.medications = medications;
  if (instructions !== undefined) prescription.instructions = instructions;
  if (expiryDate) prescription.expiryDate = expiryDate;
  if (status) prescription.status = status;

  const updatedPrescription = await prescription.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'prescription',
    prescription._id,
    { 
      prescriptionId: prescription._id,
      fields: Object.keys(req.body) 
    }
  );

  res.json(updatedPrescription);
});

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private (Admin only)
export const deletePrescription = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete prescriptions' });
  }

  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    return res.status(404).json({ message: 'Prescription not found' });
  }

  await prescription.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'prescription',
    req.params.id,
    { prescriptionId: req.params.id }
  );

  res.json({ message: 'Prescription removed' });
});

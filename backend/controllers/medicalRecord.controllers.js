import MedicalRecord from '../models/medicalRecord.models.js';
import Appointment from '../models/appointment.models.js';
import Patient from '../models/patient.models.js';
import Doctor from '../models/doctor.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';

// @desc    Create medical record
// @route   POST /api/medical-records
// @access  Private (Doctor, Admin)
export const createMedicalRecord = asyncHandler(async (req, res) => {
  const {
    patientId,
    appointmentId,
    diagnosis,
    symptoms,
    treatment,
    medications,
    labResults,
    vitalSigns,
    notes,
    attachments
  } = req.body;

  // Verify appointment exists
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Verify patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Get doctor ID based on role
  let doctorId;

  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    doctorId = doctor._id;

    // Verify that this doctor is the one assigned to the appointment
    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: 'You can only create medical records for your own appointments' });
    }
  } else if (req.user.role === 'admin') {
    if (!req.body.doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }
    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    doctorId = doctor._id;
  } else {
    return res.status(403).json({ message: 'Only doctors and admins can create medical records' });
  }

  // Create medical record
  const medicalRecord = await MedicalRecord.create({
    patient: patientId,
    doctor: doctorId,
    appointment: appointmentId,
    diagnosis,
    symptoms,
    treatment,
    medications,
    labResults,
    vitalSigns,
    notes,
    attachments
  });

  // Update appointment status to 'completed'
  appointment.status = 'completed';
  await appointment.save();

  // Create audit log
  await createAuditLog(
    req,
    'create',
    'medicalRecord',
    medicalRecord._id,
    { 
      medicalRecordId: medicalRecord._id, 
      patientId, 
      doctorId, 
      appointmentId 
    }
  );

  res.status(201).json(medicalRecord);
});

// @desc    Get all medical records
// @route   GET /api/medical-records
// @access  Private
export const getMedicalRecords = asyncHandler(async (req, res) => {
  let records;

  // Filter records based on user role
  if (req.user.role === 'admin') {
    // Admin can see all medical records
    records = await MedicalRecord.find()
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate('appointment');
  } else if (req.user.role === 'doctor') {
    // Doctors can only see records they created
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    records = await MedicalRecord.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate('appointment');
  } else if (req.user.role === 'patient') {
    // Patients can only see their own records
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    records = await MedicalRecord.find({ patient: patient._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate('appointment');
  } else {
    return res.status(403).json({ message: 'Not authorized to view medical records' });
  }

  res.json(records);
});

// @desc    Get medical record by ID
// @route   GET /api/medical-records/:id
// @access  Private
export const getMedicalRecordById = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone profilePicture' }
    })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone profilePicture' }
    })
    .populate('appointment');

  if (!medicalRecord) {
    return res.status(404).json({ message: 'Medical record not found' });
  }

  // Check if the user is authorized to view this medical record
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || patient._id.toString() !== medicalRecord.patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this medical record' });
    }
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || doctor._id.toString() !== medicalRecord.doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this medical record' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this medical record' });
  }

  res.json(medicalRecord);
});

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor who created it, Admin)
export const updateMedicalRecord = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    return res.status(404).json({ message: 'Medical record not found' });
  }

  // Check permissions
  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || doctor._id.toString() !== medicalRecord.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this medical record' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update medical records' });
  }

  // Update fields
  const {
    diagnosis,
    symptoms,
    treatment,
    medications,
    labResults,
    vitalSigns,
    notes,
    attachments
  } = req.body;

  if (diagnosis) medicalRecord.diagnosis = diagnosis;
  if (symptoms) medicalRecord.symptoms = symptoms;
  if (treatment) medicalRecord.treatment = treatment;
  if (medications) medicalRecord.medications = medications;
  if (labResults) medicalRecord.labResults = labResults;
  if (vitalSigns) medicalRecord.vitalSigns = vitalSigns;
  if (notes !== undefined) medicalRecord.notes = notes;
  if (attachments) medicalRecord.attachments = attachments;

  const updatedMedicalRecord = await medicalRecord.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'medicalRecord',
    medicalRecord._id,
    { 
      medicalRecordId: medicalRecord._id,
      fields: Object.keys(req.body) 
    }
  );

  res.json(updatedMedicalRecord);
});

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private (Admin only)
export const deleteMedicalRecord = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete medical records' });
  }

  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    return res.status(404).json({ message: 'Medical record not found' });
  }

  await medicalRecord.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'medicalRecord',
    req.params.id,
    { medicalRecordId: req.params.id }
  );

  res.json({ message: 'Medical record removed' });
});

import Appointment from '../models/appointment.models.js';
import Patient from '../models/patient.models.js';
import Doctor from '../models/doctor.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';
import { sendEmail } from '../utils/sendEmail.utils.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  const {
    doctorId,
    date,
    timeSlot,
    reasonForVisit
  } = req.body;

  // Find the doctor
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Check if doctor is approved
  if (!doctor.isApproved) {
    return res.status(400).json({ message: 'Doctor is not available for appointments' });
  }

  // Find patient profile
  let patientId;

  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found. Please complete your profile first.' });
    }
    patientId = patient._id;
  } else if (req.user.role === 'admin' || req.user.role === 'doctor') {
    if (!req.body.patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    const patient = await Patient.findById(req.body.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    patientId = patient._id;
  } else {
    return res.status(403).json({ message: 'Not authorized to create appointments' });
  }

  // Check if the time slot is available
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date: new Date(date),
    timeSlot,
    status: { $ne: 'cancelled' }
  });

  if (existingAppointment) {
    return res.status(400).json({ message: 'This time slot is already booked' });
  }

  // Create appointment
  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date,
    timeSlot,
    reasonForVisit,
    status: 'scheduled',
    paymentStatus: 'pending'
  });

  // Create audit log
  await createAuditLog(
    req,
    'create',
    'appointment',
    appointment._id,
    { 
      appointmentId: appointment._id, 
      doctor: doctorId, 
      patient: patientId, 
      date, 
      timeSlot 
    }
  );

  // Send email notifications
  try {
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'user')
      .populate('doctor', 'user')
      .populate('patient.user', 'name email')
      .populate('doctor.user', 'name email');

    const patientEmail = populatedAppointment.patient.user.email;
    const doctorEmail = populatedAppointment.doctor.user.email;
    const formattedDate = new Date(date).toLocaleDateString();

    // Notify patient
    await sendEmail({
      email: patientEmail,
      subject: 'Appointment Confirmation',
      message: `Your appointment with Dr. ${populatedAppointment.doctor.user.name} is scheduled for ${formattedDate} at ${timeSlot}.`,
    });

    // Notify doctor
    await sendEmail({
      email: doctorEmail,
      subject: 'New Appointment',
      message: `You have a new appointment with ${populatedAppointment.patient.user.name} scheduled for ${formattedDate} at ${timeSlot}.`,
    });
  } catch (err) {
    console.log('Email notification could not be sent', err);
  }

  res.status(201).json(appointment);
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  let appointments;

  // Filter appointments based on user role
  if (req.user.role === 'admin') {
    // Admin can see all appointments
    appointments = await Appointment.find()
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      });
  } else if (req.user.role === 'doctor') {
    // Doctors can only see their own appointments
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    appointments = await Appointment.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      });
  } else if (req.user.role === 'patient') {
    // Patients can only see their own appointments
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    appointments = await Appointment.find({ patient: patient._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone profilePicture' }
      });
  } else {
    return res.status(403).json({ message: 'Not authorized to view appointments' });
  }

  res.json(appointments);
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone profilePicture' }
    })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone profilePicture' }
    });

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Check if the user is authorized to view this appointment
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || patient._id.toString() !== appointment.patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || doctor._id.toString() !== appointment.doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this appointment' });
  }

  res.json(appointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Check permissions
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || patient._id.toString() !== appointment.patient.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Patients can only cancel appointments, not modify other fields
    if (req.body.status && req.body.status !== 'cancelled') {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || doctor._id.toString() !== appointment.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update appointments' });
  }

  // Update fields
  const { status, notes, followUp } = req.body;

  if (status) appointment.status = status;
  if (notes !== undefined) appointment.notes = notes;
  if (followUp) appointment.followUp = followUp;

  const updatedAppointment = await appointment.save();

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'appointment',
    appointment._id,
    { 
      appointmentId: appointment._id,
      fields: Object.keys(req.body)
    }
  );

  // Send notifications if status is changed
  if (status && status !== appointment.status) {
    try {
      const populatedAppointment = await Appointment.findById(updatedAppointment._id)
        .populate({
          path: 'patient',
          populate: { path: 'user', select: 'name email' }
        })
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'name email' }
        });

      const patientEmail = populatedAppointment.patient.user.email;
      const doctorEmail = populatedAppointment.doctor.user.email;
      const formattedDate = new Date(populatedAppointment.date).toLocaleDateString();

      if (status === 'cancelled') {
        // Notify patient
        await sendEmail({
          email: patientEmail,
          subject: 'Appointment Cancelled',
          message: `Your appointment with Dr. ${populatedAppointment.doctor.user.name} scheduled for ${formattedDate} at ${appointment.timeSlot} has been cancelled.`,
        });

        // Notify doctor
        await sendEmail({
          email: doctorEmail,
          subject: 'Appointment Cancelled',
          message: `Your appointment with ${populatedAppointment.patient.user.name} scheduled for ${formattedDate} at ${appointment.timeSlot} has been cancelled.`,
        });
      } else if (status === 'completed') {
        // Notify patient
        await sendEmail({
          email: patientEmail,
          subject: 'Appointment Completed',
          message: `Your appointment with Dr. ${populatedAppointment.doctor.user.name} has been completed. Please check your health records for updates.`,
        });
      }
    } catch (err) {
      console.log('Email notification could not be sent', err);
    }
  }

  res.json(updatedAppointment);
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin only)
export const deleteAppointment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete appointments' });
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  await appointment.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'appointment',
    req.params.id,
    { appointmentId: req.params.id }
  );

  res.json({ message: 'Appointment removed' });
});

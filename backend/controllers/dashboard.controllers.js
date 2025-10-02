import asyncHandler from '../middleware/async.middleware.js';
import Patient from '../models/patient.models.js';
import Doctor from '../models/doctor.models.js';
import Appointment from '../models/appointment.models.js';
import MedicalRecord from '../models/medicalRecord.models.js';
import Prescription from '../models/prescription.models.js';
import Invoice from '../models/invoice.models.js';
import User from '../models/user.models.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
export const getAdminDashboard = asyncHandler(async (req, res) => {
  // Get counts for various entities
  const patientCount = await Patient.countDocuments();
  const doctorCount = await Doctor.countDocuments();
  const appointmentCount = await Appointment.countDocuments();
  const pendingDoctorApprovals = await Doctor.countDocuments({ isApproved: false });
  
  // Appointment stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await Appointment.countDocuments({
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });

  const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
  const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
  
  // Revenue calculations
  const allInvoices = await Invoice.find();
  const totalRevenue = allInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = await Invoice.find({ paymentStatus: 'paid' });
  const collectedRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  // Recent registrations
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');
  
  // Recent appointments
  const recentAppointments = await Appointment.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name' }
    })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name' }
    })
    .select('date timeSlot status');

  const stats = {
    counts: {
      patients: patientCount,
      doctors: doctorCount,
      appointments: appointmentCount,
      pendingDoctorApprovals
    },
    appointments: {
      today: todayAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments
    },
    revenue: {
      total: totalRevenue,
      collected: collectedRevenue,
      pending: totalRevenue - collectedRevenue
    },
    recentUsers,
    recentAppointments
  };

  res.json(stats);
});

// @desc    Get doctor dashboard stats
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
export const getDoctorDashboard = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor profile not found' });
  }
  
  // Today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Appointment stats
  const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
  const todayAppointments = await Appointment.find({
    doctor: doctor._id,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  }).populate({
    path: 'patient',
    populate: { path: 'user', select: 'name' }
  }).sort({ date: 1 });

  const upcomingAppointments = await Appointment.find({
    doctor: doctor._id,
    date: { $gt: today },
    status: 'scheduled'
  }).countDocuments();
  
  const completedAppointments = await Appointment.countDocuments({ 
    doctor: doctor._id, 
    status: 'completed' 
  });

  // Patient stats
  const patientIds = await Appointment.distinct('patient', { doctor: doctor._id });
  const totalPatients = patientIds.length;
  
  // Medical records created
  const totalMedicalRecords = await MedicalRecord.countDocuments({ doctor: doctor._id });
  
  // Recent patients
  const recentPatients = await Appointment.find({ doctor: doctor._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email profilePicture' }
    })
    .select('patient');

  // Remove duplicate patients
  const uniquePatients = [];
  const patientMap = new Map();
  
  recentPatients.forEach(appointment => {
    if (!patientMap.has(appointment.patient._id.toString())) {
      patientMap.set(appointment.patient._id.toString(), true);
      uniquePatients.push(appointment.patient);
    }
  });

  const stats = {
    appointments: {
      total: totalAppointments,
      today: todayAppointments,
      upcoming: upcomingAppointments,
      completed: completedAppointments
    },
    patients: totalPatients,
    medicalRecords: totalMedicalRecords,
    recentPatients: uniquePatients.slice(0, 5) // Ensure we only return up to 5
  };

  res.json(stats);
});

// @desc    Get patient dashboard stats
// @route   GET /api/dashboard/patient
// @access  Private (Patient)
export const getPatientDashboard = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient profile not found' });
  }

  // Appointment stats
  const totalAppointments = await Appointment.countDocuments({ patient: patient._id });
  const upcomingAppointments = await Appointment.find({
    patient: patient._id,
    date: { $gte: new Date() },
    status: 'scheduled'
  }).populate({
    path: 'doctor',
    populate: { path: 'user', select: 'name' }
  }).sort({ date: 1 });

  const completedAppointments = await Appointment.countDocuments({ 
    patient: patient._id, 
    status: 'completed' 
  });

  // Medical records
  const totalMedicalRecords = await MedicalRecord.countDocuments({ patient: patient._id });
  const recentMedicalRecords = await MedicalRecord.find({ patient: patient._id })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name' }
    });

  // Prescriptions
  const totalPrescriptions = await Prescription.countDocuments({ patient: patient._id });
  const activePrescriptions = await Prescription.countDocuments({ 
    patient: patient._id, 
    status: 'active',
    expiryDate: { $gte: new Date() }
  });

  // Billing
  const unpaidInvoices = await Invoice.find({ 
    patient: patient._id, 
    paymentStatus: 'pending' 
  }).countDocuments();

  const stats = {
    appointments: {
      total: totalAppointments,
      upcoming: upcomingAppointments,
      completed: completedAppointments
    },
    medicalRecords: {
      total: totalMedicalRecords,
      recent: recentMedicalRecords
    },
    prescriptions: {
      total: totalPrescriptions,
      active: activePrescriptions
    },
    billing: {
      unpaidInvoices
    }
  };

  res.json(stats);
});

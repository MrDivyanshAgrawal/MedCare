import express from 'express';
import { 
  createPatient,
  getPatients,
  getPatientById,
  getMyPatientProfile,
  updatePatient,
  deletePatient
} from '../controllers/patient.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all patients - Admin and Doctor only
router.get('/', protect, authorize('admin', 'doctor'), getPatients);

// Create patient profile - Patient and Admin only
router.post('/', protect, authorize('patient', 'admin'), createPatient);

// Get patient's own profile - Patient only
router.get('/me', protect, authorize('patient'), getMyPatientProfile);

// Get, update, delete patient by ID
router.get('/:id', protect, getPatientById); // Different access levels handled in controller
router.put('/:id', protect, updatePatient); // Different access levels handled in controller
router.delete('/:id', protect, authorize('admin'), deletePatient); // Admin only

export default router;

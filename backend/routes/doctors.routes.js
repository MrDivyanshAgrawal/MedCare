import express from 'express';
import { 
  createDoctor,
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctor,
  deleteDoctor,
  approveDoctor
} from '../controllers/doctor.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all doctors - Public route (filtered in controller)
router.get('/', getDoctors);

// Create doctor profile - Doctor and Admin only
router.post('/', protect, authorize('doctor', 'admin'), createDoctor);

// Get doctor's own profile - Doctor only
router.get('/me', protect, authorize('doctor'), getMyDoctorProfile);

// Get doctor by ID - Public route (filtered in controller)
router.get('/:id', getDoctorById);

// Update, delete doctor by ID
router.put('/:id', protect, updateDoctor); // Different access levels handled in controller
router.delete('/:id', protect, authorize('admin'), deleteDoctor); // Admin only

// Approve doctor - Admin only
router.put('/:id/approve', protect, authorize('admin'), approveDoctor);

export default router;

import express from 'express';
import { 
  getAdminDashboard,
  getDoctorDashboard,
  getPatientDashboard
} from '../controllers/dashboard.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

// Get doctor dashboard stats
router.get('/doctor', protect, authorize('doctor'), getDoctorDashboard);

// Get patient dashboard stats
router.get('/patient', protect, authorize('patient'), getPatientDashboard);

export default router;

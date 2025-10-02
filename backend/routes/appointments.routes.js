import express from 'express';
import { 
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointment.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all appointments - Protected for all roles (filtered in controller)
router.get('/', protect, getAppointments);

// Create appointment - All authenticated users (validated in controller)
router.post('/', protect, createAppointment);

// Get, update, delete appointment by ID
router.get('/:id', protect, getAppointmentById); // Access controlled in controller
router.put('/:id', protect, updateAppointment); // Access controlled in controller
router.delete('/:id', protect, authorize('admin'), deleteAppointment); // Admin only

export default router;

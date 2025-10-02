import express from 'express';
import { 
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from '../controllers/prescription.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all prescriptions - Protected for all roles (filtered in controller)
router.get('/', protect, getPrescriptions);

// Create prescription - Doctor and Admin only
router.post('/', protect, authorize('doctor', 'admin'), createPrescription);

// Get, update, delete prescription by ID
router.get('/:id', protect, getPrescriptionById); // Access controlled in controller
router.put('/:id', protect, updatePrescription); // Access controlled in controller
router.delete('/:id', protect, authorize('admin'), deletePrescription); // Admin only

export default router;

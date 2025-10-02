import express from 'express';
import { 
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../controllers/medicalRecord.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all medical records - Protected for all roles (filtered in controller)
router.get('/', protect, getMedicalRecords);

// Create medical record - Doctor and Admin only
router.post('/', protect, authorize('doctor', 'admin'), createMedicalRecord);

// Get, update, delete medical record by ID
router.get('/:id', protect, getMedicalRecordById); // Access controlled in controller
router.put('/:id', protect, updateMedicalRecord); // Access controlled in controller
router.delete('/:id', protect, authorize('admin'), deleteMedicalRecord); // Admin only

export default router;

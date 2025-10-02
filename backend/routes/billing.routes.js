import express from 'express';
import { 
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  processPayment
} from '../controllers/billing.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all invoices - Protected for all roles (filtered in controller)
router.get('/', protect, getInvoices);

// Create invoice - Admin only
router.post('/', protect, authorize('admin'), createInvoice);

// Get, update, delete invoice by ID
router.get('/:id', protect, getInvoiceById); // Access controlled in controller
router.put('/:id', protect, authorize('admin'), updateInvoice); // Admin only
router.delete('/:id', protect, authorize('admin'), deleteInvoice); // Admin only

// Process payment for an invoice
router.post('/:id/pay', protect, processPayment); // Access controlled in controller

export default router;

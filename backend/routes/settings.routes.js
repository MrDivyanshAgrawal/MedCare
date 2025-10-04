import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controllers.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getSettings);
router.put('/', protect, authorize('admin'), updateSettings);

export default router;



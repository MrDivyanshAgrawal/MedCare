import express from 'express';
import { 
  uploadFile,
  deleteFile
} from '../controllers/upload.controllers.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../utils/cloudinary.utils.js';

const router = express.Router();

// Upload a file
router.post('/', protect, upload.single('file'), uploadFile);

// Delete a file
router.delete('/:id', protect, deleteFile);

export default router;

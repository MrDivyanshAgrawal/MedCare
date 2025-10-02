import asyncHandler from '../middleware/async.middleware.js';
import { cloudinary } from '../utils/cloudinary.utils.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';

// @desc    Upload a file to cloudinary
// @route   POST /api/upload
// @access  Private
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  // File is uploaded to Cloudinary via the middleware
  // Return the file details
  const fileDetails = {
    url: req.file.path,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    publicId: req.file.filename
  };

  // Create audit log
  await createAuditLog(
    req,
    'upload',
    'file',
    req.file.filename,
    { 
      fileUrl: req.file.path,
      fileType: req.file.mimetype
    }
  );

  res.status(200).json({
    success: true,
    data: fileDetails
  });
});

// @desc    Delete a file from cloudinary
// @route   DELETE /api/upload/:id
// @access  Private
export const deleteFile = asyncHandler(async (req, res) => {
  const publicId = req.params.id;

  if (!publicId) {
    return res.status(400).json({ message: 'Please provide a file ID' });
  }

  // Delete file from Cloudinary
  await cloudinary.uploader.destroy(publicId);

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'file',
    publicId,
    { publicId }
  );

  res.status(200).json({
    success: true,
    message: 'File deleted successfully'
  });
});

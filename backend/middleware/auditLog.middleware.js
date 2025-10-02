import AuditLog from '../models/auditLog.models.js';
import asyncHandler from './async.middleware.js';

export const createAuditLog = asyncHandler(async (req, action, resourceType, resourceId, details = {}) => {
  await AuditLog.create({
    user: req.user.id,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });
});

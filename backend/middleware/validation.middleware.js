import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  };
};

// User validation rules
export const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

// Patient validation rules
export const validatePatient = [
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'])
    .withMessage('Invalid blood group')
];

// Doctor validation rules
export const validateDoctor = [
  body('specialization')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialization must be between 2 and 100 characters'),
  body('licenseNumber')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('License number must be between 5 and 50 characters'),
  body('experience')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('qualification')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Qualification must be between 2 and 200 characters'),
  body('consultationFee')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number')
];

// Appointment validation rules
export const validateAppointment = [
  body('doctorId')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('timeSlot')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide a time slot'),
  body('reasonForVisit')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason for visit must be between 5 and 500 characters')
];

// Medical record validation rules
export const validateMedicalRecord = [
  body('patientId')
    .isMongoId()
    .withMessage('Please provide a valid patient ID'),
  body('appointmentId')
    .isMongoId()
    .withMessage('Please provide a valid appointment ID'),
  body('diagnosis')
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Diagnosis must be between 2 and 500 characters'),
  body('treatment')
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Treatment must be between 2 and 1000 characters')
];

// Prescription validation rules
export const validatePrescription = [
  body('medicalRecordId')
    .isMongoId()
    .withMessage('Please provide a valid medical record ID'),
  body('medications')
    .isArray({ min: 1 })
    .withMessage('At least one medication is required'),
  body('medications.*.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Medication name is required'),
  body('medications.*.dosage')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Medication dosage is required'),
  body('medications.*.frequency')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Medication frequency is required'),
  body('expiryDate')
    .isISO8601()
    .withMessage('Please provide a valid expiry date')
];

// Invoice validation rules
export const validateInvoice = [
  body('patientId')
    .isMongoId()
    .withMessage('Please provide a valid patient ID'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Item description is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  body('dueDate')
    .isISO8601()
    .withMessage('Please provide a valid due date')
];

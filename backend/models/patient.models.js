import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'],
      default: 'Unknown',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    allergies: [String],
    chronicConditions: [String],
    medicalHistory: {
      type: String,
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient;

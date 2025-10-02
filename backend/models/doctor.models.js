import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    experience: {
      type: Number, // in years
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    clinicAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
        startTime: String,
        endTime: String,
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    about: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', DoctorSchema);

export default Doctor;

import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'missed'],
      default: 'scheduled',
    },
    reasonForVisit: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
    followUp: {
      required: {
        type: Boolean,
        default: false,
      },
      date: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;

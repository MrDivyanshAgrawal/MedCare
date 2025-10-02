import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: [String],
    treatment: {
      type: String,
      required: true,
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        notes: String,
      },
    ],
    labResults: [
      {
        test: String,
        result: String,
        date: Date,
        notes: String,
        attachments: [
          {
            name: String,
            url: String,
          },
        ],
      },
    ],
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: Number, // in kg
      height: Number, // in cm
      bmi: Number,
    },
    notes: {
      type: String,
    },
    attachments: [
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

const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);

export default MedicalRecord;

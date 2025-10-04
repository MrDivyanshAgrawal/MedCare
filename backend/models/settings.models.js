import mongoose from 'mongoose';

const WorkingHoursSchema = new mongoose.Schema({
  start: { type: String, default: '09:00' },
  end: { type: String, default: '17:00' },
  isOpen: { type: Boolean, default: true }
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true, default: "Arogya Hospital" },
  address: { type: String, default: "123 MG Road" },
  city: { type: String, default: "Mumbai" },
  state: { type: String, default: "Maharashtra" },
  zipCode: { type: String, default: "400001" },
  country: { type: String, default: "India" },
  phone: { type: String, default: "+91-22-12345678" },
  email: { type: String, default: "info@arogyahospital.com" },
  website: { type: String, default: "https://arogyahospital.com" },
  taxRate: { type: Number, default: 18 },
  currency: { type: String, default: 'Indian Rupee (₹)' },
  workingHours: {
    monday: { type: WorkingHoursSchema, default: () => ({}) },
    tuesday: { type: WorkingHoursSchema, default: () => ({}) },
    wednesday: { type: WorkingHoursSchema, default: () => ({}) },
    thursday: { type: WorkingHoursSchema, default: () => ({}) },
    friday: { type: WorkingHoursSchema, default: () => ({}) },
    saturday: { type: WorkingHoursSchema, default: () => ({ start: '10:00', end: '15:00' }) },
    sunday: { type: WorkingHoursSchema, default: () => ({ isOpen: false, start: '00:00', end: '00:00' }) }
  },
  logo: { type: String, default: null },
  theme: {
    primaryColor: { type: String, default: '#3b82f6' },
    secondaryColor: { type: String, default: '#4f46e5' }
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;



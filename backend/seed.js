import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db/index.db.js';
import User from './models/user.models.js';
import Doctor from './models/doctor.models.js';
import Patient from './models/patient.models.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const indianDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@hospital.com",
    phone: "+91-9876543210",
    specialization: "Cardiology",
    licenseNumber: "MH-12345",
    experience: 15,
    qualification: "MBBS, MD (Cardiology), DM (Cardiology)",
    consultationFee: 1500,
    about: "Senior Cardiologist with 15 years of experience in treating heart diseases and performing cardiac procedures.",
    availability: [
      { day: "monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "friday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "saturday", startTime: "10:00", endTime: "14:00", isAvailable: true },
      { day: "sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ],
    clinicAddress: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    }
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@hospital.com",
    phone: "+91-9876543211",
    specialization: "Pediatrics",
    licenseNumber: "DL-67890",
    experience: 12,
    qualification: "MBBS, MD (Pediatrics), DCH",
    consultationFee: 1200,
    about: "Expert Pediatrician specializing in child healthcare, vaccination, and developmental disorders.",
    availability: [
      { day: "monday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "tuesday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "wednesday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "thursday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "friday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "saturday", startTime: "09:00", endTime: "13:00", isAvailable: true },
      { day: "sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ],
    clinicAddress: {
      street: "456 Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "India"
    }
  },
  {
    name: "Dr. Amit Patel",
    email: "amit.patel@hospital.com",
    phone: "+91-9876543212",
    specialization: "Orthopedics",
    licenseNumber: "GJ-54321",
    experience: 18,
    qualification: "MBBS, MS (Orthopedics), MCh (Orthopedics)",
    consultationFee: 1800,
    about: "Senior Orthopedic Surgeon specializing in joint replacements, sports injuries, and spine surgery.",
    availability: [
      { day: "monday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "tuesday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "wednesday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "thursday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "friday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "saturday", startTime: "09:00", endTime: "12:00", isAvailable: true },
      { day: "sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ],
    clinicAddress: {
      street: "789 C.G. Road",
      city: "Ahmedabad",
      state: "Gujarat",
      zipCode: "380006",
      country: "India"
    }
  },
  {
    name: "Dr. Sunita Reddy",
    email: "sunita.reddy@hospital.com",
    phone: "+91-9876543213",
    specialization: "Gynecology",
    licenseNumber: "TS-98765",
    experience: 14,
    qualification: "MBBS, MD (Gynecology), DGO",
    consultationFee: 1300,
    about: "Senior Gynecologist with expertise in women's health, pregnancy care, and reproductive medicine.",
    availability: [
      { day: "monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "friday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "saturday", startTime: "10:00", endTime: "15:00", isAvailable: true },
      { day: "sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ],
    clinicAddress: {
      street: "321 Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500034",
      country: "India"
    }
  },
  {
    name: "Dr. Vikram Singh",
    email: "vikram.singh@hospital.com",
    phone: "+91-9876543214",
    specialization: "Neurology",
    licenseNumber: "UP-13579",
    experience: 16,
    qualification: "MBBS, MD (Medicine), DM (Neurology)",
    consultationFee: 2000,
    about: "Senior Neurologist specializing in brain disorders, stroke treatment, and epilepsy management.",
    availability: [
      { day: "monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "friday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "saturday", startTime: "10:00", endTime: "14:00", isAvailable: true },
      { day: "sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ],
    clinicAddress: {
      street: "654 Gomti Nagar",
      city: "Lucknow",
      state: "Uttar Pradesh",
      zipCode: "226010",
      country: "India"
    }
  },
  {
    name: "Dr. Anjali Gupta",
    email: "anjali.gupta@hospital.com",
    phone: "+91-9876543215",
    specialization: "Dermatology",
    licenseNumber: "WB-24680",
    experience: 11,
    qualification: "MBBS, MD (Dermatology), DVD",
    consultationFee: 1100,
    about: "Expert Dermatologist specializing in skin diseases, cosmetic dermatology, and hair disorders.",
    availability: [
      { day: "monday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "tuesday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "wednesday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "thursday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "friday", startTime: "10:00", endTime: "18:00", isAvailable: true },
      { day: "saturday", startTime: "09:00", endTime: "13:00", isAvailable: true },
      { day: "sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ],
    clinicAddress: {
      street: "987 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      zipCode: "700016",
      country: "India"
    }
  }
];

const indianServices = [
  { id: 'cardiology', name: 'Cardiology', featured: true, description: 'Heart care and cardiovascular treatments' },
  { id: 'pediatrics', name: 'Pediatrics', featured: true, description: 'Child healthcare and development' },
  { id: 'orthopedics', name: 'Orthopedics', featured: true, description: 'Bone and joint treatments' },
  { id: 'gynecology', name: 'Gynecology', featured: true, description: 'Women\'s health and reproductive care' },
  { id: 'neurology', name: 'Neurology', featured: true, description: 'Brain and nervous system disorders' },
  { id: 'dermatology', name: 'Dermatology', featured: true, description: 'Skin, hair, and nail treatments' },
  { id: 'emergency', name: 'Emergency Care', featured: true, description: '24/7 emergency medical services' },
  { id: 'general', name: 'General Medicine', featured: true, description: 'Primary healthcare services' },
  { id: 'oncology', name: 'Oncology', featured: false, description: 'Cancer treatment and care' },
  { id: 'psychiatry', name: 'Psychiatry', featured: false, description: 'Mental health and behavioral disorders' },
  { id: 'ophthalmology', name: 'Ophthalmology', featured: false, description: 'Eye care and vision treatments' },
  { id: 'ent', name: 'ENT', featured: false, description: 'Ear, nose, and throat treatments' }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@hospital.com",
      password: "admin123",
      role: "admin",
      phone: "+91-9876543210",
      emailVerified: true
    });
    
    console.log('👤 Created admin user');
    
    // Create doctors and their user accounts
    for (const doctorData of indianDoctors) {
      const { name, email, phone, ...doctorProfile } = doctorData;
      
      // Create user account for doctor
      const doctorUser = await User.create({
        name,
        email,
        password: "doctor123",
        role: "doctor",
        phone,
        emailVerified: true
      });
      
      // Create doctor profile
      await Doctor.create({
        user: doctorUser._id,
        ...doctorProfile,
        isApproved: true
      });
      
      console.log(`👨‍⚕️  Created doctor: ${name}`);
    }
    
    // Create sample patients
    const samplePatients = [
      {
        name: "Ravi Kumar",
        email: "ravi.kumar@email.com",
        phone: "+91-9876543220",
        role: "patient",
        dateOfBirth: new Date('1985-06-15'),
        gender: "male",
        bloodGroup: "B+",
        address: {
          street: "123 Sector 15",
          city: "Noida",
          state: "Uttar Pradesh",
          zipCode: "201301",
          country: "India"
        }
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91-9876543221",
        role: "patient",
        dateOfBirth: new Date('1990-03-22'),
        gender: "female",
        bloodGroup: "O+",
        address: {
          street: "456 Koramangala",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560034",
          country: "India"
        }
      },
      {
        name: "Amit Patel",
        email: "amit.patel@email.com",
        phone: "+91-9876543222",
        role: "patient",
        dateOfBirth: new Date('1988-11-08'),
        gender: "male",
        bloodGroup: "A+",
        address: {
          street: "789 Anna Nagar",
          city: "Chennai",
          state: "Tamil Nadu",
          zipCode: "600040",
          country: "India"
        }
      }
    ];
    
    for (const patientData of samplePatients) {
      const { name, email, phone, role, ...patientProfile } = patientData;
      
      // Create user account for patient
      const patientUser = await User.create({
        name,
        email,
        password: "patient123",
        role,
        phone,
        emailVerified: true
      });
      
      // Create patient profile
      await Patient.create({
        user: patientUser._id,
        ...patientProfile
      });
      
      console.log(`👤 Created patient: ${name}`);
    }
    
    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@hospital.com / admin123');
    console.log('Doctors: [doctor-email] / doctor123');
    console.log('Patients: [patient-email] / patient123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

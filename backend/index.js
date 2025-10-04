import express from 'express';
import connectDB from './db/index.db.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import userRoutes from './routes/user.routes.js';
import patientRoutes from './routes/patients.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import servicesRoutes from './routes/services.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import medicalRecordRoutes from './routes/medicalRecords.routes.js';
import prescriptionRoutes from './routes/prescriptions.routes.js';
import billingRoutes from './routes/billing.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
app.use('/api', limiter);

// Simple test route
app.get('/', (req, res) => {
    res.send('Hospital Management API is running');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // Calculate the correct path to frontend build
  const frontendBuildPath = path.resolve(__dirname, '../../frontend/dist');
  
  console.log(`Serving static files from: ${frontendBuildPath}`);
  
  // Serve static files
  app.use(express.static(frontendBuildPath));

  // Only handle /:path routes with the frontend app
  app.get("/:path", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
  
  // Also handle the root route for the frontend
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// 404 handler (Express v5: avoid '*' path; use no-path middleware)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Define port and start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    const frontendBuildPath = path.resolve(__dirname, '../../frontend/dist');
    console.log(`Serving static files from: ${frontendBuildPath}`);
  }
  connectDB();
});

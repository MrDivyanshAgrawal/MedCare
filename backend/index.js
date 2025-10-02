import express from 'express';
import connectDB from './db/index.db.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import userRoutes from './routes/user.routes.js';
import patientRoutes from './routes/patients.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import medicalRecordRoutes from './routes/medicalRecords.routes.js';
import prescriptionRoutes from './routes/prescriptions.routes.js';
import billingRoutes from './routes/billing.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});

app.use('/api', limiter);

// Simple test route
app.get('/', (req, res) => {
    res.send('Hospital Management API is running');
});

app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// Define port and start server
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});


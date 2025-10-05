# MedCare - Comprehensive Hospital Management System 🏥

MedCare is a modern, full-stack hospital management platform that streamlines healthcare operations with secure electronic health records, appointment scheduling, and comprehensive patient care management built with the MERN stack (MongoDB, Express, React, Node.js).

## 🌐 Live Demo

**🚀 [MedCare Live Application](https://medcare-fwo8.onrender.com/)**

*Experience the full MedCare flow with Appointment Bookings and payments using Stripe's test card: `4242 4242 4242 4242`*

---

Experience the full MedCare platform with the following test accounts:
- **Admin**: admin@medcare.com | Password: admin123
- **Doctor**: doctor@medcare.com | Password: doctor123
- **Patient**: patient@medcare.com | Password: patient123

## ✨ Core Features

### 👨‍⚕️ For Healthcare Providers
- **Digital Health Records** - Secure, comprehensive EHR system
- **Appointment Management** - Intuitive scheduling with real-time availability
- **Prescription Management** - Digital prescription creation and tracking
- **Patient History Access** - Complete medical history at your fingertips
- **Billing & Invoicing** - Streamlined payment processing

### 👨‍👩‍👧‍👦 For Patients
- **Online Appointments** - Book and manage appointments 24/7
- **Medical Records Access** - View your complete health history
- **Digital Prescriptions** - Access prescriptions digitally
- **Secure Communication** - Message healthcare providers securely
- **Payment History** - Track all medical expenses

### 🔒 For Administrators
- **Staff Management** - Oversee doctors, nurses and staff
- **Resource Allocation** - Optimize hospital resources efficiently
- **Analytics Dashboard** - Data-driven insights for better decision making
- **Compliance Management** - Maintain regulatory standards
- **Financial Oversight** - Complete billing and revenue tracking

## 🛠️ Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React 18** - Modern React with Hooks
- ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) **Vite** - Fast build tool
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) **React Router DOM** - Client-side routing
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first CSS framework
- ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white) **Stripe React** - Secure payment forms
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) **Axios** - HTTP client

### Backend
- ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) **Node.js & Express.js** - Server framework
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB & Mongoose** - Database and ODM
- ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white) **Stripe** - Payment processing
- ![JWT](https://img.shields.io/badge/JSON%20Web%20Tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink) **JWT** - Token-based authentication
- ![Bcrypt](https://img.shields.io/badge/Bcrypt-B56B00?style=for-the-badge&logo=lock&logoColor=white) **Bcryptjs** - Password security
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white) **Cloudinary** - Image management
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-0F9DCE?style=for-the-badge&logo=nodemailer&logoColor=white) **Nodemailer** - Email notifications

### Deployment
- ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white) **Render** - Cloud hosting
- ![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB Atlas** - Database hosting

### Development Tools
- ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) **Git** - Version control
- ![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white) **GitHub** - Code repository
- ![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white) **VS Code** - Code editor
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) **Postman** - API testing

## 📁 Project Structure

```
MedCare/
├── 📂 backend/
│   ├── 📂 controllers/          # Business logic
│   │   ├── auth.controllers.js
│   │   ├── user.controllers.js
│   │   ├── patient.controllers.js
│   │   ├── doctor.controllers.js
│   │   ├── appointment.controllers.js
│   │   ├── medicalRecord.controllers.js
│   │   ├── dashboard.controllers.js
│   │   ├── upload.controllers.js
│   │   ├── settings.controllers.js
│   │   ├── prescription.controllers.js
│   │   ├── services.controllers.js
│   │   └── billing.controllers.js
│   ├── 📂 db/
│   │   └── index.db.js          # Database connection
│   ├── 📂 middleware/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── async.middleware.js
│   │   ├── validation.middleware.js
│   │   └── auditLog.middleware.js 
│   ├── 📂 models/               # Database schemas
│   │   ├── user.models.js
│   │   ├── patient.models.js
│   │   ├── doctor.models.js
│   │   ├── appointment.models.js
│   │   ├── medicalRecord.models.js
│   │   ├── prescription.models.js
│   │   ├── auditLog.models.js
│   │   ├── invoice.models.js
│   │   └── billing.models.js
│   ├── 📂 routes/               # API endpoints
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── patients.routes.js
│   │   ├── doctors.routes.js
│   │   ├── appointments.routes.js
│   │   ├── medicalRecords.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── upload.routes.js
│   │   ├── settings.routes.js
│   │   ├── prescription.routes.js
│   │   ├── services.routes.js
│   │   └── billing.routes.js
│   ├── 📂 utils/
│   │   ├── sendEmail.utils.js
│   │   ├── cloudinary.utils.js
│   │   └── jwtGenerator.utils.js
│   ├── constants.js
│   └── index.js                 # Main server file
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/       # Reusable components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layput.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── 📂 pages/            # Page components
│   │   │   ├── 📂 admin/        # Admin portal
│   │   │   ├── 📂 doctor/       # Doctor portal
│   │   │   ├── 📂 patient/      # Patient portal
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Services.jsx
│   │   │   └── And many more...
│   │   ├── 📂 services/         # API services
│   │   ├── 📂 context/          # React context
│   │   ├── 📂 hooks/            # Custom hooks
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account (for file uploads)
- Stripe account (for payment processing)

### 1. Clone Repository
```bash
git clone https://github.com/MrDivyanshAgrawal/MedCare.git
cd MedCare
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medcare

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=expire_days

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=noreply@hospital.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Production Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://medcare-fwo8.onrender.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medcare
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=expire_days
EMAIL_SERVICE=gmail
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASSWORD=your_production_email_app_password
EMAIL_FROM=noreply@hospital.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
```

### Frontend (.env)
```
VITE_API_URL=https://medcare-fwo8.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

## 🎯 Key API Endpoints

### Authentication
```
POST   /api/users/register       # User registration
POST   /api/users/login          # User login
GET    /api/users/profile        # Get user profile
PUT    /api/users/profile        # Update user profile
POST   /api/auth/forgot-password # Request password reset
PUT    /api/auth/reset-password/:token # Reset password
```

### Patients
```
GET    /api/patients             # Get all patients (admin/doctor)
POST   /api/patients             # Create patient
GET    /api/patients/me          # Get own patient profile
GET    /api/patients/:id         # Get patient details
PUT    /api/patients/:id         # Update patient
DELETE /api/patients/:id         # Delete patient (admin)
```

### Doctors
```
GET    /api/doctors              # Get all doctors
POST   /api/doctors              # Create doctor profile
GET    /api/doctors/me           # Get own doctor profile
GET    /api/doctors/:id          # Get doctor details
PUT    /api/doctors/:id          # Update doctor
DELETE /api/doctors/:id          # Delete doctor (admin)
PUT    /api/doctors/:id/approve  # Approve doctor (admin)
```

### Appointments
```
GET    /api/appointments         # Get all appointments
POST   /api/appointments         # Create appointment
GET    /api/appointments/:id     # Get appointment details
PUT    /api/appointments/:id     # Update appointment
DELETE /api/appointments/:id     # Cancel appointment (admin)
```

### Medical Records
```
GET    /api/medical-records      # Get all records
POST   /api/medical-records      # Create medical record (doctor/admin)
GET    /api/medical-records/:id  # Get specific record
PUT    /api/medical-records/:id  # Update medical record
DELETE /api/medical-records/:id  # Delete record (admin)
```

### Prescriptions
```
GET    /api/prescriptions        # Get all prescriptions
POST   /api/prescriptions        # Create prescription (doctor/admin)
GET    /api/prescriptions/:id    # Get specific prescription
PUT    /api/prescriptions/:id    # Update prescription
DELETE /api/prescriptions/:id    # Delete prescription (admin)
```

### Billing
```
GET    /api/billing              # Get all invoices
POST   /api/billing              # Create invoice (admin)
GET    /api/billing/:id          # Get specific invoice
PUT    /api/billing/:id          # Update invoice (admin)
DELETE /api/billing/:id          # Delete invoice (admin)
POST   /api/billing/:id/pay      # Process payment
```

### Dashboard
```
GET    /api/dashboard/admin      # Get admin dashboard data
GET    /api/dashboard/doctor     # Get doctor dashboard data
GET    /api/dashboard/patient    # Get patient dashboard data
```

## 🔒 Security Features

- **Role-Based Access Control**: Different permissions for patients, doctors, and administrators
- **JWT Authentication**: Secure token-based user authentication
- **Password Hashing**: Bcrypt protection for user credentials
- **Data Encryption**: Secured medical records storage
- **CORS Protection**: Controlled cross-origin resource sharing
- **Input Validation**: Request validation to prevent injection attacks
- **Audit Logging**: Track all data access and modifications
- **HTTPS Enforcement**: Secure communication throughout the application

## 📊 Project Metrics

- **30+** API Endpoints
- **35+** React Components
- **15+** Database Collections
- **20,000+** Lines of Code
- **3** User Roles (Admin, Doctor, Patient)
- **50+** Unique Features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 👨‍💻 Developer

**Divyansh Agrawal**
- GitHub: [@MrDivyanshAgrawal](https://github.com/MrDivyanshAgrawal)
- LinkedIn: [Divyansh Agrawal](https://www.linkedin.com/in/divyanshagrawal/)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

** ⭐ Star this repository if you found it helpful! **

** 🚀 [Live Demo](https://medcare-fwo8.onrender.com) | 📚 Documentation | 🐛 Report Bug **

** Built with ❤️ using the MERN Stack **

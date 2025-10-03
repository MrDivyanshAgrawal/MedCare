import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import DoctorsList from './pages/DoctorsList';
import Services from './pages/Services';
import Contact from './pages/Contact';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';

import PatientDashboard from './pages/patient/Dashboard';
import PatientProfile from './pages/patient/Profile';
import PatientAppointments from './pages/patient/Appointments';
import PatientMedicalRecords from './pages/patient/MedicalRecords';
import PatientPrescriptions from './pages/patient/Prescriptions';
import PatientBilling from './pages/patient/Billing';
import BookAppointment from './pages/patient/BookAppointment';
import MedicalRecordDetail from './pages/patient/MedicalRecordDetail';

import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';
import DoctorMedicalRecords from './pages/doctor/MedicalRecords';
import CreateMedicalRecord from './pages/doctor/CreateMedicalRecord';
import DoctorPrescriptions from './pages/doctor/Prescriptions';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile'; // Add this import
import AdminPatients from './pages/admin/Patients';
import AdminDoctors from './pages/admin/Doctors';
import AdminAppointments from './pages/admin/Appointments';
import AdminUsers from './pages/admin/Users';
import AdminBilling from './pages/admin/Billing';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Not Found Page
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner'; // Import the LoadingSpinner component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/appointments" element={<PatientAppointments />} />
            <Route path="/patient/medical-records" element={<PatientMedicalRecords />} />
            <Route path="/patient/medical-records/:id" element={<MedicalRecordDetail />} />
            <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
            <Route path="/patient/billing" element={<PatientBilling />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
          </Route>


          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/medical-records" element={<DoctorMedicalRecords />} />
            <Route path="/doctor/medical-records/create/:appointmentId" element={<CreateMedicalRecord />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/billing" element={<AdminBilling />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" />
      </Router>
    </AuthProvider>
  );
};

export default App;

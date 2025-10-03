import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, FaSignOutAlt, FaTachometerAlt, FaCalendarAlt, 
  FaUserMd, FaFileMedical, FaPrescription, FaFileInvoiceDollar, 
  FaUsers, FaCog, FaChartBar, FaBars, FaTimes,
  FaUserInjured
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (currentUser.role === 'patient') {
      return [
        { to: '/patient/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
        { to: '/patient/profile', icon: <FaUser />, text: 'My Profile' },
        { to: '/patient/appointments', icon: <FaCalendarAlt />, text: 'Appointments' },
        { to: '/patient/medical-records', icon: <FaFileMedical />, text: 'Medical Records' },
        { to: '/patient/prescriptions', icon: <FaPrescription />, text: 'Prescriptions' },
        { to: '/patient/billing', icon: <FaFileInvoiceDollar />, text: 'Billing' }
      ];
    } else if (currentUser.role === 'doctor') {
      return [
        { to: '/doctor/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
        { to: '/doctor/profile', icon: <FaUser />, text: 'My Profile' },
        { to: '/doctor/appointments', icon: <FaCalendarAlt />, text: 'Appointments' },
        { to: '/doctor/patients', icon: <FaUsers />, text: 'Patients' },
        { to: '/doctor/medical-records', icon: <FaFileMedical />, text: 'Medical Records' },
        { to: '/doctor/prescriptions', icon: <FaPrescription />, text: 'Prescriptions' }
      ];
    } else if (currentUser.role === 'admin') {
      return [
        { to: '/admin/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
        { to: '/admin/profile', icon: <FaUser />, text: 'My Profile' },
        { to: '/admin/patients', icon: <FaUsers />, text: 'Patients' },
        { to: '/admin/doctors', icon: <FaUserInjured />, text: 'Doctors' },
        { to: '/admin/appointments', icon: <FaCalendarAlt />, text: 'Appointments' },
        { to: '/admin/users', icon: <FaUser />, text: 'User Management' },
        { to: '/admin/billing', icon: <FaFileInvoiceDollar />, text: 'Billing' },
        { to: '/admin/reports', icon: <FaChartBar />, text: 'Reports' },
        { to: '/admin/settings', icon: <FaCog />, text: 'Settings' }
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold text-blue-600">HMS Portal</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 ${
                    location.pathname === link.to ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.text}
                </Link>
              ))}
            </nav>
            <div className="pt-4 mt-auto border-t">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
              <span className="text-xl font-bold text-white">HMS Portal</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === link.to
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-xl">{link.icon}</span>
                    {link.text}
                  </Link>
                ))}
              </nav>
              <div className="flex-shrink-0 p-4 border-t">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={currentUser.profilePicture || "https://via.placeholder.com/40"}
                      alt="User avatar"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center mt-4 w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold text-blue-600">HMS Portal</span>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={currentUser.profilePicture || "https://via.placeholder.com/32"}
                alt="User avatar"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

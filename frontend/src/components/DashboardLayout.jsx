import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, FaSignOutAlt, FaTachometerAlt, FaCalendarAlt, 
  FaUserMd, FaFileMedical, FaPrescription, FaFileInvoiceDollar, 
  FaUsers, FaCog, FaChartBar, FaBars, FaTimes,
  FaUserInjured, FaHome, FaUserShield, FaStethoscope,
  FaHeartbeat
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

  // Get role-specific colors and icons
  const getRoleTheme = () => {
    switch (currentUser.role) {
      case 'patient':
        return {
          bgColor: 'from-blue-600 to-blue-800',
          hoverColor: 'hover:bg-blue-50',
          activeColor: 'bg-blue-50 text-blue-600',
          textColor: 'text-blue-600',
          icon: <FaHeartbeat />
        };
      case 'doctor':
        return {
          bgColor: 'from-green-600 to-green-800',
          hoverColor: 'hover:bg-green-50',
          activeColor: 'bg-green-50 text-green-600',
          textColor: 'text-green-600',
          icon: <FaStethoscope />
        };
      case 'admin':
        return {
          bgColor: 'from-purple-600 to-purple-800',
          hoverColor: 'hover:bg-purple-50',
          activeColor: 'bg-purple-50 text-purple-600',
          textColor: 'text-purple-600',
          icon: <FaUserShield />
        };
      default:
        return {
          bgColor: 'from-gray-600 to-gray-800',
          hoverColor: 'hover:bg-gray-50',
          activeColor: 'bg-gray-50 text-gray-600',
          textColor: 'text-gray-600',
          icon: <FaUser />
        };
    }
  };

  const theme = getRoleTheme();

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
        { to: '/admin/patients', icon: <FaUserInjured />, text: 'Patients' },
        { to: '/admin/doctors', icon: <FaUserMd />, text: 'Doctors' },
        { to: '/admin/appointments', icon: <FaCalendarAlt />, text: 'Appointments' },
        { to: '/admin/users', icon: <FaUsers />, text: 'User Management' },
        { to: '/admin/billing', icon: <FaFileInvoiceDollar />, text: 'Billing' },
        { to: '/admin/reports', icon: <FaChartBar />, text: 'Reports' },
        { to: '/admin/settings', icon: <FaCog />, text: 'Settings' }
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className={`bg-gradient-to-r ${theme.bgColor} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-lg mr-3">
                {theme.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">HMS Portal</h2>
                <p className="text-sm text-white/80 capitalize">{currentUser.role} Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <FaTimes className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile user info */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
              src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${currentUser.name}&background=6366f1&color=fff`}
              alt={currentUser.name}
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === link.to 
                  ? theme.activeColor + ' shadow-sm' 
                  : `text-gray-700 ${theme.hoverColor} hover:shadow-sm`
              }`}
            >
              <span className={`mr-3 text-lg ${location.pathname === link.to ? '' : 'text-gray-400'}`}>
                {link.icon}
              </span>
              {link.text}
            </Link>
          ))}
        </nav>

        {/* Mobile bottom actions */}
        <div className="p-4 border-t bg-gray-50 space-y-2">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <FaHome className="mr-3 text-lg text-gray-400" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-full bg-white shadow-xl">
            {/* Desktop header */}
            <div className={`bg-gradient-to-r ${theme.bgColor} px-6 py-6`}>
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl mr-4">
                  <span className="text-2xl text-white">{theme.icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">HMS Portal</h2>
                  <p className="text-sm text-white/80 capitalize">{currentUser.role} Dashboard</p>
                </div>
              </div>
            </div>

            {/* Desktop user info */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center">
                <img
                  className="h-14 w-14 rounded-full object-cover border-3 border-white shadow-lg"
                  src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${currentUser.name}&background=6366f1&color=fff`}
                  alt={currentUser.name}
                />
                <div className="ml-4">
                  <p className="text-base font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    currentUser.role === 'doctor' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto bg-gray-50/50">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.to
                      ? theme.activeColor + ' shadow-sm'
                      : `text-gray-700 ${theme.hoverColor} hover:shadow-sm`
                  }`}
                >
                  <span className={`mr-3 text-lg ${location.pathname === link.to ? '' : 'text-gray-400'}`}>
                    {link.icon}
                  </span>
                  {link.text}
                </Link>
              ))}
            </nav>

            {/* Desktop bottom actions */}
            <div className="p-4 border-t bg-gray-50 space-y-2">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <FaHome className="mr-3 text-lg text-gray-400" />
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                <FaSignOutAlt className="mr-3 text-lg" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile top bar */}
        <header className="bg-white shadow-sm md:hidden border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <span className={`text-xl font-bold ${theme.textColor}`}>HMS Portal</span>
            </div>
            <Link to="/profile" className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-md"
                src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${currentUser.name}&background=6366f1&color=fff`}
                alt={currentUser.name}
              />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaCalendarPlus, 
  FaFileMedical, 
  FaPrescription, 
  FaFileInvoiceDollar, 
  FaUserMd,
  FaClock,
  FaChartLine,
  FaHeartbeat,
  FaBell,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import api from '../../services/api';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/patient');
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate health score (dummy calculation for demonstration)
  const healthScore = dashboardData?.medicalRecords?.recent?.length > 0 ? 85 : 95;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
              <p className="text-blue-100 text-lg">
                Here's an overview of your health information and upcoming appointments.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3">
                <FaHeartbeat className="h-12 w-12" />
                <div>
                  <p className="text-sm text-blue-100">Health Score</p>
                  <p className="text-3xl font-bold">{healthScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.appointments?.total || 0}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaCalendarPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Medical Records</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.medicalRecords?.total || 0}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaFileMedical className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.prescriptions?.active || 0}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <FaPrescription className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Bills</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.billing?.unpaidInvoices || 0}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/patient/book-appointment"
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaCalendarPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Book Appointment</h3>
              <p className="mt-2 text-sm text-gray-600">Schedule a visit with a doctor</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/patient/medical-records"
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-green-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaFileMedical className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Medical Records</h3>
              <p className="mt-2 text-sm text-gray-600">View your health history</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/patient/prescriptions"
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-purple-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaPrescription className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Prescriptions</h3>
              <p className="mt-2 text-sm text-gray-600">Manage your medications</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/patient/billing"
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-yellow-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaFileInvoiceDollar className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Billing</h3>
              <p className="mt-2 text-sm text-gray-600">View and pay invoices</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-yellow-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaClock className="mr-2 h-5 w-5 text-blue-600" />
              Upcoming Appointments
            </h2>
            <Link to="/patient/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
              View all
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData?.appointments?.upcoming?.length > 0 ? (
              dashboardData.appointments.upcoming.slice(0, 3).map((appointment) => (
                <div key={appointment._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={appointment.doctor.user.profilePicture || `https://ui-avatars.com/api/?name=${appointment.doctor.user.name}&background=0891b2&color=fff`}
                          alt={appointment.doctor.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Dr. {appointment.doctor.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <FaClock className="mr-1 h-3 w-3" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/patient/appointments/${appointment._id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors duration-150"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <FaCalendarPlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-3 text-gray-500">No upcoming appointments</p>
                <Link to="/patient/book-appointment" className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                  Book an appointment
                  <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Medical Records */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaFileMedical className="mr-2 h-5 w-5 text-green-600" />
                Recent Medical Records
              </h2>
                            <Link to="/patient/medical-records" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                View all
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData?.medicalRecords?.recent?.length > 0 ? (
                dashboardData.medicalRecords.recent.slice(0, 3).map((record) => (
                  <div key={record._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{record.diagnosis}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(record.createdAt).toLocaleDateString()} • Dr. {record.doctor.user.name}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FaFileMedical className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-3 text-gray-500">No medical records yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaPrescription className="mr-2 h-5 w-5 text-purple-600" />
                Recent Prescriptions
              </h2>
              <Link to="/patient/prescriptions" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                View all
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData?.prescriptions?.recent?.length > 0 ? (
                dashboardData.prescriptions.recent.slice(0, 3).map((prescription) => (
                  <div key={prescription._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {prescription.medications[0]?.name || 'Prescription'}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(prescription.createdAt).toLocaleDateString()} • Dr. {prescription.doctor.user.name}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FaPrescription className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-3 text-gray-500">No prescriptions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Important Notifications */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaBell className="mr-2 h-5 w-5 text-red-600" />
              Important Notifications
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {dashboardData?.billing?.unpaidInvoices > 0 && (
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <FaExclamationCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      You have {dashboardData.billing.unpaidInvoices} unpaid invoice{dashboardData.billing.unpaidInvoices > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Total amount due: ₹{dashboardData.billing.totalAmountDue || 0}
                    </p>
                    <Link to="/patient/billing" className="text-sm font-medium text-yellow-900 hover:text-yellow-800 mt-2 inline-flex items-center">
                      Pay now
                      <FaArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
              
              {dashboardData?.prescriptions?.expiringSoon > 0 && (
                <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <FaExclamationCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">
                      {dashboardData.prescriptions.expiringSoon} prescription{dashboardData.prescriptions.expiringSoon > 1 ? 's' : ''} expiring soon
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      Please consult your doctor for renewal
                    </p>
                    <Link to="/patient/prescriptions" className="text-sm font-medium text-orange-900 hover:text-orange-800 mt-2 inline-flex items-center">
                      View prescriptions
                      <FaArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {!dashboardData?.billing?.unpaidInvoices && !dashboardData?.prescriptions?.expiringSoon && (
                <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <FaCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-900">
                    All good! No important notifications at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaChartLine className="mr-2 h-5 w-5 text-indigo-600" />
              Health Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Last Check-up</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {dashboardData?.lastCheckup 
                      ? new Date(dashboardData.lastCheckup).toLocaleDateString()
                      : 'No recent check-up'
                    }
                  </p>
                </div>
                <FaUserMd className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Medications Active</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {dashboardData?.prescriptions?.active || 0} medications
                  </p>
                </div>
                <FaPrescription className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Next Appointment</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {dashboardData?.appointments?.upcoming?.[0]
                      ? new Date(dashboardData.appointments.upcoming[0].date).toLocaleDateString()
                      : 'No upcoming'
                    }
                  </p>
                </div>
                <FaCalendarPlus className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;

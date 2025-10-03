import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { FaCalendarPlus, FaFileMedical, FaPrescription, FaFileInvoiceDollar, FaUserMd } from 'react-icons/fa';
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h1 className="text-2xl font-bold">Welcome back, {currentUser.name}!</h1>
            <p className="mt-1 text-blue-100">
              Here's an overview of your health information and upcoming appointments.
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/patient/book-appointment"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCalendarPlus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Book Appointment</h3>
            <p className="mt-1 text-sm text-gray-500">Schedule a visit with a doctor</p>
          </Link>

          <Link
            to="/patient/medical-records"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <FaFileMedical className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Medical Records</h3>
            <p className="mt-1 text-sm text-gray-500">View your health history</p>
          </Link>

          <Link
            to="/patient/prescriptions"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="p-3 bg-purple-100 rounded-full">
              <FaPrescription className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Prescriptions</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your medications</p>
          </Link>

          <Link
            to="/patient/billing"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Billing</h3>
            <p className="mt-1 text-sm text-gray-500">View and pay your invoices</p>
          </Link>
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData?.appointments?.upcoming?.length > 0 ? (
              dashboardData.appointments.upcoming.map((appointment) => (
                <div key={appointment._id} className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaUserMd className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Dr. {appointment.doctor.user.name}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/patient/appointments/${appointment._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                No upcoming appointments. 
                <Link to="/patient/book-appointment" className="text-blue-600 hover:text-blue-500 ml-1">
                  Book one now
                </Link>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link to="/patient/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all appointments →
            </Link>
          </div>
        </div>

        {/* Health summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Medical Records</h2>
            </div>
            <div className="px-6 py-4">
              <div className="text-3xl font-bold text-gray-900">
                {dashboardData?.medicalRecords?.total || 0}
              </div>
              <p className="mt-1 text-sm text-gray-500">Total records</p>
              {dashboardData?.medicalRecords?.recent && dashboardData.medicalRecords.recent.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Recent records:</p>
                  <ul className="mt-2 space-y-2">
                    {dashboardData.medicalRecords.recent.map((record) => (
                      <li key={record._id} className="text-sm text-gray-600">
                        • {record.diagnosis} - Dr. {record.doctor.user.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link to="/patient/medical-records" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all records →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Prescriptions</h2>
            </div>
            <div className="px-6 py-4">
              <div className="text-3xl font-bold text-gray-900">
                {dashboardData?.prescriptions?.total || 0}
              </div>
              <p className="mt-1 text-sm text-gray-500">Total prescriptions</p>
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${dashboardData?.prescriptions?.total ? (dashboardData.prescriptions.active / dashboardData.prescriptions.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {dashboardData?.prescriptions?.active || 0} active prescriptions
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link to="/patient/prescriptions" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all prescriptions →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
            </div>
            <div className="px-6 py-4">
              <div className="text-3xl font-bold text-gray-900">
                {dashboardData?.billing?.unpaidInvoices || 0}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {dashboardData?.billing?.unpaidInvoices === 1 ? 'Unpaid invoice' : 'Unpaid invoices'}
              </p>
              {dashboardData?.billing?.unpaidInvoices > 0 && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Payment needed
                  </span>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link to="/patient/billing" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all invoices →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;

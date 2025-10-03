// src/pages/doctor/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  FaUserInjured, 
  FaCalendarCheck, 
  FaFileMedical, 
  FaChartLine, 
  FaCalendarAlt,
  FaClock, 
  FaArrowRight 
} from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/doctor');
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
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
            <h1 className="text-2xl font-bold">Welcome, Dr. {currentUser.name}!</h1>
            <p className="mt-1 text-blue-100">
              Here's an overview of your appointments and patients
            </p>
          </div>
        </div>

        {error && (
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
        )}

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.appointments?.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaCalendarCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.appointments?.completed || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <FaUserInjured className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.patients || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FaFileMedical className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Medical Records</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.medicalRecords || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's appointments */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Today's Appointments</h2>
            <Link to="/doctor/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {dashboardData?.appointments?.today?.length > 0 ? (
              dashboardData.appointments.today.map((appointment) => (
                <div key={appointment._id} className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={appointment.patient.user.profilePicture || "https://via.placeholder.com/48"} 
                      alt={appointment.patient.user.name} 
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{appointment.patient.user.name}</h3>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {appointment.timeSlot}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                      <FaClock className="mr-1 h-3 w-3 text-gray-400" />
                      <span className="truncate">{appointment.reasonForVisit}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link
                      to={`/doctor/appointments/${appointment._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Details <FaArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <FaCalendarAlt className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any appointments scheduled for today.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent patients */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Patients</h2>
            <Link to="/doctor/patients" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData?.recentPatients?.length > 0 ? (
              dashboardData.recentPatients.map((patient) => (
                <div key={patient._id} className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={patient.user.profilePicture || "https://via.placeholder.com/48"} 
                      alt={patient.user.name} 
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{patient.user.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaEnvelope className="mr-1 h-3 w-3 text-gray-400" />
                      <span>{patient.user.email}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link
                      to={`/doctor/patients/${patient._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      View <FaArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <FaUserInjured className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patients yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't seen any patients yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

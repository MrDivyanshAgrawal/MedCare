import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  FaUserInjured, 
  FaUserMd, 
  FaCalendarAlt, 
  FaFileInvoiceDollar, 
  FaChartLine, 
  FaUserShield, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaHospital,
  FaStethoscope,
  FaHeartbeat,
  FaUsersCog
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/admin');
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
              <p className="text-purple-100 text-lg">
                Here's an overview of your hospital management system
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3">
                <FaHospital className="h-12 w-12" />
                <div>
                  <p className="text-sm text-purple-100">System Status</p>
                  <p className="text-2xl font-bold flex items-center">
                    <span className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.counts?.patients || 0}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <FaArrowUp className="mr-1" />
                  12% from last month
                </p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <FaUserInjured className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.counts?.doctors || 0}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <FaArrowUp className="mr-1" />
                  8% from last month
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaUserMd className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Appointments Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData?.appointments?.today || 0}
                </p>
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <FaArrowDown className="mr-1" />
                  3% from yesterday
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaCalendarAlt className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${dashboardData?.revenue?.total?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <FaArrowUp className="mr-1" />
                  18% from last month
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Approvals Alert */}
        {dashboardData?.counts?.pendingDoctorApprovals > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-medium">
                    Pending Doctor Approvals
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    You have {dashboardData.counts.pendingDoctorApprovals} doctor{dashboardData.counts.pendingDoctorApprovals > 1 ? 's' : ''} awaiting approval.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/doctors?filter=pending"
                className="ml-4 inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Review Applications
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/admin/appointments"
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-indigo-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaCalendarAlt className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Appointments</h3>
              <p className="mt-2 text-sm text-gray-600">Manage schedules</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/doctors"
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaUserMd className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Doctors</h3>
              <p className="mt-2 text-sm text-gray-600">Manage staff</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/patients"
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-green-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaUserInjured className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Patients</h3>
              <p className="mt-2 text-sm text-gray-600">Patient records</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-purple-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <FaChartLine className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Reports</h3>
              <p className="mt-2 text-sm text-gray-600">Analytics & insights</p>
              <FaArrowRight className="mt-3 h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaChartLine className="mr-2 h-5 w-5 text-purple-600" />
                Revenue Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">Monthly revenue trend</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Collected</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  {
                    name: 'Jan',
                    total: 4000,
                    collected: 2400,
                  },
                  {
                    name: 'Feb',
                    total: 3000,
                    collected: 1398,
                  },
                  {
                    name: 'Mar',
                    total: 2000,
                    collected: 1800,
                  },
                  {
                    name: 'Apr',
                    total: 2780,
                    collected: 2508,
                  },
                  {
                    name: 'May',
                    total: 1890,
                    collected: 1800,
                  },
                  {
                    name: 'Jun',
                    total: 2390,
                    collected: 2300,
                  },
                  {
                    name: 'Jul',
                    total: 3490,
                    collected: 3000,
                  },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Registrations and Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaUsersCog className="mr-2 h-5 w-5 text-indigo-600" />
                Recent Registrations
              </h2>
              <Link to="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center transition-colors duration-200">
                View all
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {dashboardData?.recentUsers?.length > 0 ? (
                dashboardData.recentUsers.map((user) => (
                  <div key={user._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md" 
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} 
                          alt={user.name} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                        <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500">
                          <span>{user.email}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400 flex items-center">
                          <FaClock className="mr-1 h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FaUserShield className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-3 text-sm font-medium text-gray-900">No recent registrations</h3>
                </div>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaHeartbeat className="mr-2 h-5 w-5 text-green-600" />
                Recent Appointments
              </h2>
              <Link to="/admin/appointments" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center transition-colors duration-200">
                View all
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {dashboardData?.recentAppointments?.length > 0 ? (
                dashboardData.recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          appointment.status === 'completed' ? 'bg-green-100' : 
                          appointment.status === 'cancelled' ? 'bg-red-100' : 
                          'bg-blue-100'
                        }`}>
                          {appointment.status === 'completed' ? (
                            <FaCheckCircle className="h-6 w-6 text-green-600" />
                          ) : appointment.status === 'cancelled' ? (
                            <FaTimesCircle className="h-6 w-6 text-red-600" />
                          ) : (
                            <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {appointment.patient.user.name} with Dr. {appointment.doctor.user.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <FaClock className="mr-1 h-3 w-3" />
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-3 text-sm font-medium text-gray-900">No recent appointments</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

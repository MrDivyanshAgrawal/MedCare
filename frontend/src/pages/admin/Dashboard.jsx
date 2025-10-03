import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { FaUserInjured, FaUserMd, FaCalendarAlt, FaFileInvoiceDollar, FaChartLine, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';
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
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
            <h1 className="text-2xl font-bold">Welcome, {currentUser.name}!</h1>
            <p className="mt-1 text-indigo-100">
              Here's an overview of your hospital management system
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

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 mr-4">
                <FaUserInjured className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.counts?.patients || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaUserMd className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.counts?.doctors || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaCalendarAlt className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments Today</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.appointments?.today || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardData?.revenue?.total.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Approvals Alert */}
        {dashboardData?.counts?.pendingDoctorApprovals > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have {dashboardData.counts.pendingDoctorApprovals} doctor{dashboardData.counts.pendingDoctorApprovals > 1 ? 's' : ''} awaiting approval.
                </p>
                <div className="mt-2">
                  <Link
                    to="/admin/doctors?filter=pending"
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                  >
                    Review Applications →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Registrations and Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Registrations</h2>
              <Link to="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData?.recentUsers?.length > 0 ? (
                dashboardData.recentUsers.map((user) => (
                  <div key={user._id} className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaUserShield className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-indigo-100 text-indigo-800">
                          {user.role}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Registered on {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">No recent registrations</div>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
              <Link to="/admin/appointments" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData?.recentAppointments?.length > 0 ? (
                dashboardData.recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100' : 
                        appointment.status === 'cancelled' ? 'bg-red-100' : 
                        'bg-blue-100'
                      }`}>
                        <FaCalendarAlt className={`h-5 w-5 ${
                          appointment.status === 'completed' ? 'text-green-600' : 
                          appointment.status === 'cancelled' ? 'text-red-600' : 
                          'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {appointment.patient.user.name} with Dr. {appointment.doctor.user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                          </p>
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
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">No recent appointments</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

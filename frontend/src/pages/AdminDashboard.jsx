import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaUserInjured, FaUserMd, FaCalendarAlt, FaHospital } from 'react-icons/fa';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would normally fetch from API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data for now
        setStats({
          patients: 120,
          doctors: 15,
          appointments: 45
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-blue-50 border border-blue-100">
            <FaUserInjured className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Total Patients</h3>
            <p className="text-3xl font-bold text-blue-600">{loading ? '...' : stats.patients}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-green-50 border border-green-100">
            <FaUserMd className="text-green-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Total Doctors</h3>
            <p className="text-3xl font-bold text-green-600">{loading ? '...' : stats.doctors}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-purple-50 border border-purple-100">
            <FaCalendarAlt className="text-purple-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
            <p className="text-3xl font-bold text-purple-600">{loading ? '...' : stats.appointments}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-yellow-50 border border-yellow-100">
            <FaHospital className="text-yellow-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">System</h3>
            <p className="text-sm text-gray-600 mt-2">Manage hospital settings</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 font-semibold text-lg">
            <h2>Recent Patients</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center py-4">Loading patients...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Sample data row */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">John Doe</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">john.doe@example.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">(123) 456-7890</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">July 10, 2023</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 font-semibold text-lg">
            <h2>Recent Doctors</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center py-4">Loading doctors...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Sample data row */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Dr. Jane Smith</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Cardiologist</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">jane.smith@example.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

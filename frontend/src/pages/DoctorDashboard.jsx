import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUserInjured, FaNotesMedical, FaUserMd } from 'react-icons/fa';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would normally fetch from API
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Mock data for now
        setAppointments([
          {
            id: 1,
            patient: { name: 'John Doe', age: 45, gender: 'Male' },
            dateTime: new Date('2023-07-24T09:00:00'),
            reason: 'Routine Check-up',
            status: 'confirmed'
          }
        ]);
      } catch (err) {
        setError('Failed to load appointments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-blue-50 border border-blue-100">
            <FaCalendarAlt className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{loading ? '...' : '4'}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-green-50 border border-green-100">
            <FaUserInjured className="text-green-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Total Patients</h3>
            <p className="text-3xl font-bold text-green-600">42</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-purple-50 border border-purple-100">
            <FaNotesMedical className="text-purple-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Medical Records</h3>
            <p className="text-3xl font-bold text-purple-600">156</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-yellow-50 border border-yellow-100">
            <FaUserMd className="text-yellow-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
            <p className="text-sm text-gray-600 mt-2">Update your professional information</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 font-semibold text-lg">
            <h2>Today's Schedule</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center py-4">Loading schedule...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
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
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                              <div className="text-sm text-gray-500">
                                {appointment.patient.gender}, {appointment.patient.age} years
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm">Start</button>
                        </td>
                      </tr>
                    ))}
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

export default DoctorDashboard;

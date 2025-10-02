import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaNotesMedical, FaPrescription, FaUserCircle } from 'react-icons/fa';

const PatientDashboard = () => {
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
            doctor: { name: 'Dr. Jane Smith', specialization: 'Cardiologist' },
            dateTime: new Date('2023-07-24T10:30:00'),
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
        <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-blue-50 border border-blue-100">
            <FaCalendarAlt className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{loading ? '...' : appointments.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-green-50 border border-green-100">
            <FaNotesMedical className="text-green-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Medical Records</h3>
            <p className="text-3xl font-bold text-green-600">3</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-purple-50 border border-purple-100">
            <FaPrescription className="text-purple-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Prescriptions</h3>
            <p className="text-3xl font-bold text-purple-600">5</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 bg-yellow-50 border border-yellow-100">
            <FaUserCircle className="text-yellow-600 text-3xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
            <p className="text-sm text-gray-600 mt-2">Update your personal information</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 font-semibold text-lg">
            <h2>Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center py-4">Loading appointments...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">{error}</p>
            ) : appointments.length === 0 ? (
              <p className="text-center py-4">No upcoming appointments.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
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
                              <div className="text-sm font-medium text-gray-900">{appointment.doctor.name}</div>
                              <div className="text-sm text-gray-500">{appointment.doctor.specialization}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.dateTime).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
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

export default PatientDashboard;

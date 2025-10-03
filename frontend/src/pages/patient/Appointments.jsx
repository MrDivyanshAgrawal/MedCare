// src/pages/patient/Appointments.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaUserMd, FaClock, FaNotesMedical, FaAngleRight } from 'react-icons/fa';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      await api.put(`/appointments/${id}`, { status: 'cancelled' });
      toast.success('Appointment cancelled successfully');
      
      // Update the local state
      setAppointments(appointments.map(appointment => 
        appointment._id === id 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      ));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const filteredAppointments = () => {
    if (filter === 'all') return appointments;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'upcoming') {
      return appointments.filter(appointment => 
        new Date(appointment.date) >= today && appointment.status === 'scheduled'
      );
    }
    
    if (filter === 'past') {
      return appointments.filter(appointment => 
        new Date(appointment.date) < today || appointment.status === 'completed'
      );
    }
    
    return appointments.filter(appointment => appointment.status === filter);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      missed: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="mt-1 text-blue-100">
              View and manage your scheduled appointments
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
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'upcoming' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'past' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'completed' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'cancelled' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancelled
            </button>
          </div>
          
          <Link 
            to="/patient/book-appointment" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaCalendarAlt className="mr-2 h-4 w-4" />
            Book New Appointment
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAppointments().length > 0 ? (
              filteredAppointments().map((appointment) => {
                const appointmentDate = new Date(appointment.date);
                const isUpcoming = appointmentDate >= new Date() && appointment.status === 'scheduled';
                
                return (
                  <li key={appointment._id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-full ${
                              appointment.status === 'completed' ? 'bg-green-100' : 
                              appointment.status === 'cancelled' ? 'bg-red-100' : 
                              'bg-blue-100'
                            }`}>
                              {appointment.status === 'completed' ? (
                                <FaCalendarCheck className="h-6 w-6 text-green-600" />
                              ) : appointment.status === 'cancelled' ? (
                                <FaCalendarTimes className="h-6 w-6 text-red-600" />
                              ) : (
                                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Appointment with Dr. {appointment.doctor.user.name}
                            </h3>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{appointmentDate.toLocaleDateString()} at {appointment.timeSlot}</span>
                              <span className="mx-2">•</span>
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {isUpcoming && (
                            <button
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500"
                            >
                              Cancel
                            </button>
                          )}
                          <Link
                            to={`/patient/appointments/${appointment._id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Details <FaAngleRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <FaUserMd className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-700">Specialization:</span> {appointment.doctor.specialization}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-start">
                          <div className="flex-shrink-0">
                            <FaNotesMedical className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-700">Reason for visit:</span> {appointment.reasonForVisit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter !== 'all' ? 'Try changing your filter or ' : ''}
                  Get started by booking a new appointment.
                </p>
                <div className="mt-6">
                  <Link
                    to="/patient/book-appointment"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaCalendarAlt className="-ml-1 mr-2 h-4 w-4" />
                    Book New Appointment
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

// src/pages/doctor/Appointments.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaCalendarTimes, 
  FaUserInjured, 
  FaClock, 
  FaNotesMedical, 
  FaAngleRight,
  FaEdit,
  FaFileMedical
} from 'react-icons/fa';

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

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status} successfully`);
      
      // Update the local state
      setAppointments(appointments.map(appointment => 
        appointment._id === id 
          ? { ...appointment, status } 
          : appointment
      ));
    } catch (err) {
      console.error('Error updating appointment:', err);
      toast.error(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const filteredAppointments = () => {
    if (filter === 'all') return appointments;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'today') {
      return appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getFullYear() === today.getFullYear() &&
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getDate() === today.getDate()
        );
      });
    }
    
    if (filter === 'upcoming') {
      return appointments.filter(appointment => 
        new Date(appointment.date) >= today && appointment.status === 'scheduled'
      );
    }
    
    if (filter === 'past') {
      return appointments.filter(appointment => 
        new Date(appointment.date) < today || appointment.status === 'completed' || appointment.status === 'cancelled'
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
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="mt-1 text-blue-100">
              Manage your patient appointments
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
        
        <div className="flex flex-wrap gap-2 items-center">
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
            onClick={() => setFilter('today')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'today' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Today
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
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'scheduled' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Scheduled
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
          <button
            onClick={() => setFilter('missed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'missed' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Missed
          </button>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAppointments().length > 0 ? (
              filteredAppointments().map((appointment) => {
                const appointmentDate = new Date(appointment.date);
                const isToday = appointmentDate.toDateString() === new Date().toDateString();
                const isPast = appointmentDate < new Date();
                
                return (
                  <li key={appointment._id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-full ${
                              appointment.status === 'completed' ? 'bg-green-100' : 
                              appointment.status === 'cancelled' ? 'bg-red-100' : 
                              appointment.status === 'missed' ? 'bg-yellow-100' : 
                              'bg-blue-100'
                            }`}>
                              {appointment.status === 'completed' ? (
                                <FaCalendarCheck className="h-6 w-6 text-green-600" />
                              ) : appointment.status === 'cancelled' ? (
                                <FaCalendarTimes className="h-6 w-6 text-red-600" />
                              ) : appointment.status === 'missed' ? (
                                <FaCalendarTimes className="h-6 w-6 text-yellow-600" />
                              ) : (
                                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Appointment with {appointment.patient.user.name}
                              {isToday && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Today
                                </span>
                              )}
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
                          {appointment.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                              >
                                <FaCalendarCheck className="mr-1 h-4 w-4" />
                                Complete
                              </button>
                              {isPast && (
                                <button
                                  onClick={() => handleUpdateStatus(appointment._id, 'missed')}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                >
                                  <FaCalendarTimes className="mr-1 h-4 w-4" />
                                  Mark Missed
                                </button>
                              )}
                              <button
                                onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500"
                              >
                                <FaCalendarTimes className="mr-1 h-4 w-4" />
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <Link
                              to={`/doctor/medical-records/create/${appointment._id}`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              <FaFileMedical className="mr-1 h-4 w-4" />
                              Add Medical Record
                            </Link>
                          )}
                          <Link
                            to={`/doctor/appointments/${appointment._id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                          >
                            Details <FaAngleRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <FaUserInjured className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Patient:</span> {appointment.patient.user.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Contact:</span> {appointment.patient.user.phone || 'N/A'}, {appointment.patient.user.email}
                              </p>
                              {appointment.patient.dateOfBirth && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-700">DOB:</span> {new Date(appointment.patient.dateOfBirth).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start">
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
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter !== 'all' ? `No ${filter} appointments found.` : 'You don\'t have any appointments yet.'}
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

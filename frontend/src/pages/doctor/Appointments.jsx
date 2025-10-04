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
  FaChevronRight,
  FaEdit,
  FaFileMedical,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFilter
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

  const getStatusInfo = (status) => {
    const statusConfig = {
      scheduled: {
        color: 'blue',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: FaCalendarAlt,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      completed: {
        color: 'green',
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: FaCalendarCheck,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      cancelled: {
        color: 'red',
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: FaCalendarTimes,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      },
      missed: {
        color: 'yellow',
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: FaExclamationTriangle,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      }
    };
    
    return statusConfig[status] || statusConfig.scheduled;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaCalendarAlt className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Appointments</h1>
                <p className="text-blue-100 text-lg mt-1">
                  Manage your patient appointments efficiently
                </p>
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
        
        {/* Filter Pills */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center">
            <FaFilter className="h-5 w-5 text-gray-400 mr-3" />
            <div className="flex flex-wrap gap-2">
              {['all', 'today', 'upcoming', 'scheduled', 'completed', 'cancelled', 'missed'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === filterOption 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments().length > 0 ? (
            filteredAppointments().map((appointment) => {
              const appointmentDate = new Date(appointment.date);
              const isToday = appointmentDate.toDateString() === new Date().toDateString();
              const isPast = appointmentDate < new Date();
              const statusInfo = getStatusInfo(appointment.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={appointment._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Status Icon */}
                        <div className={`p-3 rounded-xl ${statusInfo.iconBg}`}>
                          <StatusIcon className={`h-8 w-8 ${statusInfo.iconColor}`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                              Appointment with {appointment.patient.user.name}
                              {isToday && (
                                <span className="ml-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                  Today
                                </span>
                              )}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          
                          {/* Meta Information */}
                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <FaClock className="mr-1.5 h-4 w-4" />
                              {appointmentDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })} at {appointment.timeSlot}
                            </span>
                          </div>
                          
                          {/* Patient Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <FaUserInjured className="mr-2 h-4 w-4" />
                                Patient Information
                              </h4>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Name:</span> {appointment.patient.user.name}
                                </p>
                                {appointment.patient.user.phone && (
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <FaPhone className="mr-2 h-3 w-3" />
                                    {appointment.patient.user.phone}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 flex items-center">
                                  <FaEnvelope className="mr-2 h-3 w-3" />
                                  {appointment.patient.user.email}
                                </p>
                                {appointment.patient.dateOfBirth && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Age:</span> {
                                      new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()
                                    } years
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <FaNotesMedical className="mr-2 h-4 w-4" />
                                Visit Details
                              </h4>
                              <p className="text-sm text-gray-700">
                                {appointment.reasonForVisit}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-2 justify-end">
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            <FaCheckCircle className="mr-2 h-4 w-4" />
                            Mark Completed
                          </button>
                          {isPast && (
                            <button
                              onClick={() => handleUpdateStatus(appointment._id, 'missed')}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-sm font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-800 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <FaExclamationTriangle className="mr-2 h-4 w-4" />
                              Mark Missed
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                            className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-400 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <FaTimesCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'completed' && (
                        <Link
                          to={`/doctor/medical-records/create/${appointment._id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <FaFileMedical className="mr-2 h-4 w-4" />
                          Add Medical Record
                        </Link>
                      )}
                      <Link
                        to={`/doctor/appointments/${appointment._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        View Details
                        <FaChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-8 py-16 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <FaCalendarAlt className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {filter !== 'all' ? `No ${filter} appointments found.` : 'You don\'t have any appointments yet.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

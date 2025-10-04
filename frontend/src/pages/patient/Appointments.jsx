import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaCalendarTimes, 
  FaUserMd, 
  FaClock, 
  FaNotesMedical, 
  FaAngleRight,
  FaFilter,
  FaMapMarkerAlt,
  FaVideo,
  FaClinicMedical
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
    const statusConfig = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <FaCalendarCheck className="mr-1 h-3 w-3" /> },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: <FaCheckCircle className="mr-1 h-3 w-3" /> },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: <FaCalendarTimes className="mr-1 h-3 w-3" /> },
      missed: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FaTimesCircle className="mr-1 h-3 w-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
            <h1 className="text-3xl font-bold text-white mb-2">My Appointments</h1>
            <p className="text-blue-100 text-lg">
              Manage and track all your medical appointments in one place
            </p>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {['all', 'upcoming', 'past', 'completed', 'cancelled'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === filterType 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <Link 
            to="/patient/book-appointment" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
          >
            <FaCalendarAlt className="mr-2 h-5 w-5" />
            Book New Appointment
          </Link>
        </div>
        
        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments().length > 0 ? (
            filteredAppointments().map((appointment) => {
              const appointmentDate = new Date(appointment.date);
              const isUpcoming = appointmentDate >= new Date() && appointment.status === 'scheduled';
              
              return (
                <div 
                  key={appointment._id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Doctor Avatar */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={appointment.doctor.user.profilePicture || `https://ui-avatars.com/api/?name=${appointment.doctor.user.name}&background=0891b2&color=fff`}
                              alt={appointment.doctor.user.name}
                              className="h-16 w-16 rounded-full object-cover border-4 border-blue-100"
                            />
                            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ${
                              appointment.status === 'completed' ? 'bg-green-500' : 
                              appointment.status === 'cancelled' ? 'bg-red-500' : 
                              'bg-blue-500'
                            }`}>
                              {appointment.status === 'completed' ? (
                                <FaCalendarCheck className="h-3 w-3 text-white" />
                              ) : appointment.status === 'cancelled' ? (
                                <FaCalendarTimes className="h-3 w-3 text-white" />
                              ) : (
                                <FaCalendarAlt className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Appointment Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {appointment.doctor.user.name}
                          </h3>
                          <p className="text-gray-600">{appointment.doctor.specialization}</p>
                          
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaClock className="mr-2 h-4 w-4 text-gray-400" />
                              <span>{appointmentDate.toLocaleDateString()} at {appointment.timeSlot}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaClinicMedical className="mr-2 h-4 w-4 text-gray-400" />
                              <span>Consultation Fee: ₹{appointment.doctor.consultationFee || '500'}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-start">
                            <FaNotesMedical className="mt-0.5 mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Reason for visit:</p>
                              <p className="text-sm text-gray-600">{appointment.reasonForVisit}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        {getStatusBadge(appointment.status)}
                        
                        {isUpcoming && (
                          <button
                            onClick={() => handleCancelAppointment(appointment._id)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        )}
                        
                        <Link
                          to={`/patient/appointments/${appointment._id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          View Details
                          <FaAngleRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FaCalendarAlt className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {filter !== 'all' ? 'Try changing your filter or ' : ''}
                Get started by booking a new appointment.
              </p>
              <Link
                to="/patient/book-appointment"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <FaCalendarAlt className="mr-2 h-5 w-5" />
                Book Your First Appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

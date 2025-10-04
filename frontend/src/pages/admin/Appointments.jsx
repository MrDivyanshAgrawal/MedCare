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
  FaUserInjured,
  FaClock, 
  FaSearch, 
  FaFilter,
  FaAngleRight,
  FaCheck,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/all');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status} successfully`);
      
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
    return appointments.filter(appointment => {
      const patientName = appointment.patient.user.name.toLowerCase();
      const doctorName = appointment.doctor.user.name.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        patientName.includes(searchLower) || 
        doctorName.includes(searchLower);
      
      const matchesStatus = 
        statusFilter === 'all' || 
        appointment.status === statusFilter;
      
      const matchesDoctor = 
        doctorFilter === '' || 
        appointment.doctor._id === doctorFilter;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      
      let matchesDate = true;
      
      if (dateFilter === 'today') {
        matchesDate = appointmentDate.getTime() === today.getTime();
      } else if (dateFilter === 'upcoming') {
        matchesDate = appointmentDate.getTime() >= today.getTime();
      } else if (dateFilter === 'past') {
        matchesDate = appointmentDate.getTime() < today.getTime();
      }
      
      return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaClock },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheck },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimes },
      missed: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaExclamationTriangle }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    const Icon = config.icon;
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}>
        {Icon && <Icon className="mr-1 h-3 w-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaCalendarAlt className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Appointments Management</h1>
                <p className="text-indigo-100 text-lg mt-1">
                  View and manage all appointments in the system
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
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by patient or doctor"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
              </select>
            </div>
            
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            
            <div className="relative">
              <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
              >
                <option value="">All Doctors</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>Dr. {doctor.user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Appointment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 mr-4">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-100 to-green-200 mr-4">
                <FaCalendarCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 mr-4">
                <FaClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-100 to-red-200 mr-4">
                <FaCalendarTimes className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled/Missed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'cancelled' || a.status === 'missed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments().length > 0 ? (
                  filteredAppointments().map((appointment) => {
                    const appointmentDate = parseISO(appointment.date);
                    const formattedDate = format(appointmentDate, 'MMM d, yyyy');
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isToday = appointmentDate.getDate() === today.getDate() && 
                                   appointmentDate.getMonth() === today.getMonth() && 
                                   appointmentDate.getFullYear() === today.getFullYear();
                    
                    return (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 flex items-center justify-center">
                                <FaUserInjured className="h-5 w-5 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patient.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.patient.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                                <FaUserMd className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Dr. {appointment.doctor.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.doctor.specialization}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formattedDate} {isToday && <span className="text-blue-600 font-semibold">(Today)</span>}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaClock className="h-3 w-3 mr-1" />
                            {appointment.timeSlot}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {appointment.status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                                  className="text-green-600 hover:text-green-900 font-medium transition-colors duration-200"
                                >
                                  Complete
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900 font-medium transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                                <span className="text-gray-300">|</span>
                              </>
                            )}
                            <Link
                              to={`/admin/appointments/${appointment._id}`}
                              className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center transition-colors duration-200"
                            >
                              Details <FaAngleRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FaCalendarAlt className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">No appointments found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAppointments;

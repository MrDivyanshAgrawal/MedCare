// src/pages/admin/Appointments.jsx
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
  FaAngleRight
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
            <h1 className="text-2xl font-bold">Appointments Management</h1>
            <p className="mt-1 text-indigo-100">
              View and manage all appointments in the system
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
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient or doctor"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserMd className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
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
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FaCalendarAlt className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <tr key={appointment._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
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
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
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
                          <div className="text-sm text-gray-500">
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
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            <Link
                              to={`/admin/appointments/${appointment._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Details <FaAngleRight className="inline-block ml-1" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="text-gray-500">No appointments found</div>
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

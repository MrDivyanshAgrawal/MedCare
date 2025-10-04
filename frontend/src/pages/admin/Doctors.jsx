import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUserMd, 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationCircle,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaStethoscope,
  FaCertificate,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaUserClock,
  FaStar,
  FaCalendarCheck
} from 'react-icons/fa';

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterParam || 'all');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors?includeAll=true');
      setDoctors(response.data);
      
      const uniqueSpecs = [...new Set(response.data.map(doctor => doctor.specialization))];
      setSpecializations(uniqueSpecs);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (id) => {
    try {
      await api.put(`/doctors/${id}/approve`, { isApproved: true });
      toast.success('Doctor approved successfully');
      
      setDoctors(doctors.map(doctor => 
        doctor._id === id ? { ...doctor, isApproved: true } : doctor
      ));
    } catch (err) {
      console.error('Error approving doctor:', err);
      toast.error('Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (id) => {
    try {
      await api.put(`/doctors/${id}/approve`, { isApproved: false });
      toast.success('Doctor rejected');
      
      setDoctors(doctors.map(doctor => 
        doctor._id === id ? { ...doctor, isApproved: false } : doctor
      ));
    } catch (err) {
      console.error('Error rejecting doctor:', err);
      toast.error('Failed to reject doctor');
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await api.delete(`/doctors/${id}`);
      toast.success('Doctor deleted successfully');
      
      setDoctors(doctors.filter(doctor => doctor._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting doctor:', err);
      toast.error('Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.licenseNumber && doctor.licenseNumber.includes(searchTerm));
      
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'approved' && doctor.isApproved) || 
      (statusFilter === 'pending' && !doctor.isApproved);
    
    const matchesSpecialization = 
      specializationFilter === '' || 
      doctor.specialization === specializationFilter;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

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
              <FaUserMd className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Doctors Management</h1>
                <p className="text-blue-100 text-lg mt-1">
                  Manage and approve doctor registrations
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Doctors</p>
                <p className="text-2xl font-bold text-white">{doctors.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-100 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">
                  {doctors.filter(d => d.isApproved).length}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-100 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {doctors.filter(d => !d.isApproved).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pending approvals alert */}
        {doctors.filter(doctor => !doctor.isApproved).length > 0 && statusFilter !== 'pending' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex">
                <FaExclamationCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">Pending Approvals</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    There are {doctors.filter(doctor => !doctor.isApproved).length} doctors awaiting approval.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStatusFilter('pending')}
                className="ml-4 inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                View Pending
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, specialization, or license"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>

            <div className="relative">
              <FaStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredDoctors.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <img 
                        className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md" 
                        src={doctor.user.profilePicture || `https://ui-avatars.com/api/?name=${doctor.user.name}&background=3b82f6&color=fff`} 
                        alt={doctor.user.name} 
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          Dr. {doctor.user.name}
                          {doctor.isApproved && <FaCheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                            <FaStethoscope className="mr-1 h-3 w-3" />
                            {doctor.specialization}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                            <FaUserClock className="mr-1 h-3 w-3" />
                            {doctor.experience} years
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            <FaMoneyBillWave className="mr-1 h-3 w-3" />
                            ${doctor.consultationFee}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full ${
                            doctor.isApproved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doctor.isApproved ? (
                              <>
                                <FaCheck className="mr-1 h-3 w-3" />
                                Approved
                              </>
                            ) : (
                              <>
                                <FaUserClock className="mr-1 h-3 w-3" />
                                Pending
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaCertificate className="mr-2 h-4 w-4 text-gray-400" />
                            License: {doctor.licenseNumber}
                          </div>
                          <div className="flex items-center">
                            <FaCalendarCheck className="mr-2 h-4 w-4 text-gray-400" />
                                                        Joined: {new Date(doctor.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FaStar className="mr-2 h-4 w-4 text-gray-400" />
                            {doctor.qualification}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
                      {!doctor.isApproved ? (
                        <>
                          <button
                            onClick={() => handleApproveDoctor(doctor._id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            <FaCheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectDoctor(doctor._id)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-all duration-200"
                          >
                            <FaTimesCircle className="mr-2 h-4 w-4" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRejectDoctor(doctor._id)}
                          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          <FaTimesCircle className="mr-2 h-4 w-4" />
                          Revoke Approval
                        </button>
                      )}
                      <Link
                        to={`/admin/doctors/${doctor._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-200"
                      >
                        <FaEye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                      <Link
                        to={`/admin/doctors/${doctor._id}/edit`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 text-sm font-medium rounded-lg hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200"
                      >
                        <FaEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(doctor._id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-sm font-medium rounded-lg hover:from-red-200 hover:to-red-300 transition-all duration-200"
                      >
                        <FaTrashAlt className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-24 text-center">
              <FaUserMd className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-3 text-lg font-medium text-gray-900">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || specializationFilter 
                  ? 'Try adjusting your search filters' 
                  : 'No doctors have registered yet'}
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this doctor? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDoctor(confirmDelete)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Doctors;

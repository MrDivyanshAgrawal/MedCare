// src/pages/admin/Doctors.jsx
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
  FaTrashAlt
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
      
      // Extract unique specializations
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
      
      // Update local state
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
      
      // Update local state
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
      
      // Remove from local state
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h1 className="text-2xl font-bold">Doctors Management</h1>
            <p className="mt-1 text-blue-100">
              Manage and approve doctor registrations
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

        {/* Pending approvals alert */}
        {filteredDoctors.filter(doctor => !doctor.isApproved).length > 0 && statusFilter !== 'pending' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  There are {filteredDoctors.filter(doctor => !doctor.isApproved).length} doctors awaiting approval.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                  >
                    View Pending Approvals →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, specialization, or license"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredDoctors.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <li key={doctor._id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-12 w-12 rounded-full" 
                          src={doctor.user.profilePicture || "https://via.placeholder.com/48"} 
                          alt={doctor.user.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Dr. {doctor.user.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{doctor.specialization}</span>
                          <span className="mx-2">•</span>
                          <span>{doctor.experience} years experience</span>
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            doctor.isApproved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doctor.isApproved ? 'Approved' : 'Pending Approval'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap md:flex-nowrap gap-2">
                      {!doctor.isApproved ? (
                        <>
                          <button
                            onClick={() => handleApproveDoctor(doctor._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <FaCheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectDoctor(doctor._id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
                          >
                            <FaTimesCircle className="mr-1 h-4 w-4" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRejectDoctor(doctor._id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
                        >
                          <FaTimesCircle className="mr-1 h-4 w-4" />
                          Revoke Approval
                        </button>
                      )}
                      <Link
                        to={`/admin/doctors/${doctor._id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <FaEye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                      <Link
                        to={`/admin/doctors/${doctor._id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <FaEdit className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(doctor._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <FaTrashAlt className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">License: </span>
                      <span className="font-medium text-gray-900">{doctor.licenseNumber}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Qualification: </span>
                      <span className="font-medium text-gray-900">{doctor.qualification}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Fee: </span>
                      <span className="font-medium text-gray-900">${doctor.consultationFee}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <FaUserMd className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No doctors found</h3>
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
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this doctor? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDoctor(confirmDelete)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
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

// src/pages/doctor/Prescriptions.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaPrescription, 
  FaSearch, 
  FaUser, 
  FaCalendarAlt, 
  FaPills, 
  FaEye,
  FaPlus,
  FaFilter
} from 'react-icons/fa';

const Prescriptions = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patientIdParam || '');
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, [patientIdParam]);

  const fetchPrescriptions = async () => {
    try {
      let url = '/prescriptions';
      if (patientIdParam) {
        url += `?patientId=${patientIdParam}`;
      }
      
      const response = await api.get(url);
      setPrescriptions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions. Please try again.');
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/prescriptions/${id}`, { status });
      toast.success(`Prescription marked as ${status}`);
      
      // Update local state
      setPrescriptions(prescriptions.map(prescription => 
        prescription._id === id ? { ...prescription, status } : prescription
      ));
    } catch (err) {
      console.error('Error updating prescription:', err);
      toast.error('Failed to update prescription status');
    }
  };

  // Check if a prescription is expired
  const isPrescriptionExpired = (prescription) => {
    return prescription.status === 'active' && new Date(prescription.expiryDate) < new Date();
  };

  // Filter prescriptions based on search term, selected patient, and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Check if any medication name matches the search term
    const medicationMatch = prescription.medications.some(
      med => med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by patient
    const patientMatch = selectedPatient === '' || prescription.patient._id === selectedPatient;
    
    // Filter by status
    const statusMatch = 
      statusFilter === 'all' || 
      prescription.status === statusFilter ||
      (statusFilter === 'expired' && isPrescriptionExpired(prescription));
    
    return medicationMatch && patientMatch && statusMatch;
  });

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
          <div className="px-6 py-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <h1 className="text-2xl font-bold">Prescriptions</h1>
            <p className="mt-1 text-purple-100">
              View and manage patient prescriptions
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by medication"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">All Patients</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>{patient.user.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action button for creating new prescription */}
        <div className="flex justify-end">
          <Link
            to="/doctor/prescriptions/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
          >
            <FaPlus className="mr-2 -ml-1 h-4 w-4" />
            Create Prescription
          </Link>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredPrescriptions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => {
                const isExpired = isPrescriptionExpired(prescription);
                
                return (
                  <li key={prescription._id} className="px-6 py-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-full ${
                            prescription.status === 'completed' ? 'bg-green-100' : 
                            prescription.status === 'cancelled' ? 'bg-red-100' : 
                            isExpired ? 'bg-yellow-100' : 
                            'bg-purple-100'
                          }`}>
                            <FaPrescription className={`h-6 w-6 ${
                              prescription.status === 'completed' ? 'text-green-600' : 
                              prescription.status === 'cancelled' ? 'text-red-600' : 
                              isExpired ? 'text-yellow-600' : 
                              'text-purple-600'
                            }`} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Prescription for {prescription.patient.user.name}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>Created: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {isExpired 
                                ? 'Expired on: ' 
                                : 'Expires on: '
                              }
                              {new Date(prescription.expiryDate).toLocaleDateString()}
                            </span>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              prescription.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              prescription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              isExpired ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {isExpired ? 'Expired' : prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/doctor/prescriptions/${prescription._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 mr-2"
                        >
                          <FaEye className="mr-1 h-4 w-4" />
                          View
                        </Link>
                        {prescription.status === 'active' && !isExpired && (
                          <button
                            onClick={() => handleUpdateStatus(prescription._id, 'completed')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                          >
                            Mark Completed
                          </button>
                        )}
                        {(prescription.status === 'active' || prescription.status === 'completed') && !isExpired && (
                          <button
                            onClick={() => handleUpdateStatus(prescription._id, 'cancelled')}
                            className="inline-flex items-center px-3 py-1 ml-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Medications:</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {prescription.medications.map((medication, idx) => (
                          <div key={idx} className="bg-gray-50 px-3 py-2 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                            <p className="text-xs text-gray-600">{medication.dosage}, {medication.frequency}, {medication.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {prescription.instructions && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Instructions:</h4>
                        <p className="text-sm text-gray-600">{prescription.instructions}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <FaPrescription className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedPatient || statusFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Create a new prescription for your patients'}
              </p>
              {(!searchTerm && !selectedPatient && statusFilter === 'all') && (
                <div className="mt-6">
                  <Link
                    to="/doctor/prescriptions/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <FaPlus className="mr-2 -ml-1 h-4 w-4" />
                    Create New Prescription
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;

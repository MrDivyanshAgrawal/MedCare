import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { FaPrescription, FaEye, FaSearch, FaFilter, FaUserMd, FaCalendarDay, FaClock } from 'react-icons/fa';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions');
      setPrescriptions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions. Please try again.');
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Check if any medication name matches the search term
    const medicationMatch = prescription.medications.some(
      med => med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by status
    const statusMatch = 
      statusFilter === 'all' || 
      prescription.status === statusFilter ||
      (statusFilter === 'active' && 
        prescription.status === 'active' && 
        new Date(prescription.expiryDate) >= new Date());
    
    return medicationMatch && statusMatch;
  });

  // Check if a prescription is expired
  const isPrescriptionExpired = (prescription) => {
    return prescription.status === 'active' && new Date(prescription.expiryDate) < new Date();
  };

  // Get appropriate badge for prescription status
  const getStatusBadge = (prescription) => {
    if (prescription.status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    } else if (prescription.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    } else if (isPrescriptionExpired(prescription)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Expired
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Active
        </span>
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <h1 className="text-2xl font-bold">My Prescriptions</h1>
            <p className="mt-1 text-purple-100">
              View your current and past medication prescriptions
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

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by medication name"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Prescriptions</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {prescriptions.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => (
                <li key={prescription._id}>
                  <div className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-full ${
                            prescription.status === 'completed' ? 'bg-green-100' : 
                            prescription.status === 'cancelled' ? 'bg-red-100' : 
                            isPrescriptionExpired(prescription) ? 'bg-yellow-100' : 
                            'bg-purple-100'
                          }`}>
                            <FaPrescription className={`h-6 w-6 ${
                              prescription.status === 'completed' ? 'text-green-600' : 
                              prescription.status === 'cancelled' ? 'text-red-600' : 
                              isPrescriptionExpired(prescription) ? 'text-yellow-600' : 
                              'text-purple-600'
                            }`} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Prescription from Dr. {prescription.doctor.user.name}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FaCalendarDay className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>Issued: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>
                              {isPrescriptionExpired(prescription) 
                                ? 'Expired on: ' 
                                : 'Expires on: '
                              }
                              {new Date(prescription.expiryDate).toLocaleDateString()}
                            </span>
                            <span className="mx-2">•</span>
                            {getStatusBadge(prescription)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/patient/prescriptions/${prescription._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                        >
                          <FaEye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Medications:</h4>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {prescription.medications.map((medication, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                            <p className="text-xs text-gray-500">Dosage: {medication.dosage}</p>
                            <p className="text-xs text-gray-500">Frequency: {medication.frequency}</p>
                            <p className="text-xs text-gray-500">Duration: {medication.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {prescription.instructions && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Instructions:</h4>
                        <p className="mt-1 text-sm text-gray-600">{prescription.instructions}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your prescriptions will appear here after doctor visits.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;

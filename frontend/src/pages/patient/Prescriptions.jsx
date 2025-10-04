import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { 
  FaPrescription, 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaUserMd, 
  FaCalendarDay, 
  FaClock,
  FaPills,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaCalendarCheck
} from 'react-icons/fa';

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
      return {
        icon: FaCheckCircle,
        text: 'Completed',
        color: 'text-green-800',
        bg: 'bg-green-100',
        border: 'border-green-200'
      };
    } else if (prescription.status === 'cancelled') {
      return {
        icon: FaTimesCircle,
        text: 'Cancelled',
        color: 'text-red-800',
        bg: 'bg-red-100',
        border: 'border-red-200'
      };
    } else if (isPrescriptionExpired(prescription)) {
      return {
        icon: FaExclamationTriangle,
        text: 'Expired',
        color: 'text-yellow-800',
        bg: 'bg-yellow-100',
        border: 'border-yellow-200'
      };
    } else {
      return {
        icon: FaCheckCircle,
        text: 'Active',
        color: 'text-blue-800',
        bg: 'bg-blue-100',
        border: 'border-blue-200'
      };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaPrescription className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">My Prescriptions</h1>
                <p className="text-purple-100 text-lg mt-1">
                  Manage your medications and prescription history
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by medication name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
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

        {/* Prescriptions List */}
        {filteredPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => {
              const statusInfo = getStatusBadge(prescription);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={prescription._id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`p-3 ${statusInfo.bg} rounded-xl border ${statusInfo.border}`}>
                            <FaPrescription className={`h-8 w-8 ${statusInfo.color}`} />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Prescription from Dr. {prescription.doctor.user.name}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                              <StatusIcon className="mr-1.5 h-3 w-3" />
                              {statusInfo.text}
                            </span>
                          </div>
                          
                          {/* Meta Information */}
                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <FaCalendarDay className="mr-1.5 h-4 w-4" />
                              Issued: {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center">
                              <FaCalendarCheck className="mr-1.5 h-4 w-4" />
                              {isPrescriptionExpired(prescription) ? 'Expired on: ' : 'Valid until: '}
                              {new Date(prescription.expiryDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          {/* Medications Grid */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Prescribed Medications:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {prescription.medications.map((medication, idx) => (
                                <div key={idx} className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                                  <div className="flex items-start">
                                    <FaPills className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">{medication.name}</p>
                                      <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-medium">Dosage:</span> {medication.dosage}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Frequency:</span> {medication.frequency}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Duration:</span> {medication.duration}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Instructions */}
                          {prescription.instructions && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                              <h5 className="text-sm font-medium text-amber-800 mb-1">Special Instructions:</h5>
                              <p className="text-sm text-amber-700">{prescription.instructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="ml-4 flex-shrink-0">
                        <Link
                          to={`/patient/prescriptions/${prescription._id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <FaEye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaPrescription className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? "No prescriptions match your search criteria. Try adjusting your filters."
                  : "Your prescriptions will appear here after doctor visits."}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;

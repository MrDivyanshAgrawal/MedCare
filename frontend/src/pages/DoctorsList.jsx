import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  FaUserMd, 
  FaSearch,
  FaStar, 
  FaStethoscope,
  FaCalendarAlt,
  FaCertificate,
  FaFilter,
  FaMapMarkerAlt,
  FaClock,
  FaGraduationCap
} from 'react-icons/fa';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
      
      // Extract unique specializations
      const uniqueSpecializations = [...new Set(response.data.map(doctor => doctor.specialization))];
      setSpecializations(uniqueSpecializations);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors. Please try again later.');
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedRating('');
    setSelectedAvailability('');
  };

  // Filter doctors based on selected criteria
  const filteredDoctors = doctors.filter(doctor => {
    // Search term filter (name or specialization)
    const matchesSearch = 
      doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Specialization filter
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    
    // Rating filter
    const matchesRating = !selectedRating || doctor.rating >= parseInt(selectedRating);
    
    // Availability filter
    let matchesAvailability = true;
    if (selectedAvailability) {
      const today = new Date();
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      if (selectedAvailability === 'today') {
        const todayAvailability = doctor.availability?.find(day => day.day === dayOfWeek);
        matchesAvailability = todayAvailability && todayAvailability.isAvailable;
      } else if (selectedAvailability === 'thisWeek') {
        // At least one day available this week
        matchesAvailability = doctor.availability?.some(day => day.isAvailable);
      }
    }
    
    return matchesSearch && matchesSpecialization && matchesRating && matchesAvailability;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Doctors" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Doctor
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Connect with experienced healthcare professionals who are committed to providing the best care for you and your family.
          </p>
          
          {/* Quick Search Bar */}
          <div className="mt-10 max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-4 rounded-xl shadow-lg border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-10 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
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

          {/* Advanced Filters */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Doctors ({filteredDoctors.length})</h2>
                <p className="text-gray-600 mt-1">Find the right specialist for your needs</p>
              </div>
              
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaFilter className="mr-2 h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {/* Collapsible Filters */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slideDown">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <div className="relative">
                      <FaStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <select
                        id="specialization"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedSpecialization}
                        onChange={e => setSelectedSpecialization(e.target.value)}
                      >
                        <option value="">All Specializations</option>
                        {specializations.map((spec, index) => (
                          <option key={index} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <div className="relative">
                      <FaStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <select
                        id="rating"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedRating}
                        onChange={e => setSelectedRating(e.target.value)}
                      >
                        <option value="">Any Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <select
                        id="availability"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedAvailability}
                        onChange={e => setSelectedAvailability(e.target.value)}
                      >
                        <option value="">Any Time</option>
                        <option value="today">Available Today</option>
                        <option value="thisWeek">Available This Week</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Doctors Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="flex space-x-3">
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map(doctor => (
                      <div key={doctor._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                        <div className="relative h-64 bg-gradient-to-br from-blue-400 to-blue-600">
                          <img 
                            src={doctor.user.profilePicture || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"} 
                            alt={`Dr. ${doctor.user.name}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <h3 className="text-2xl font-bold text-white">Dr. {doctor.user.name}</h3>
                            <p className="text-blue-100 flex items-center mt-1">
                              <FaStethoscope className="mr-2 h-4 w-4" />
                              {doctor.specialization}
                            </p>
                          </div>
                          {doctor.isAvailableNow && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                              Available Now
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.round(doctor.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-gray-700">
                                {doctor.rating || '4.5'} ({doctor.reviewCount || '20'}+ reviews)
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaGraduationCap className="h-4 w-4 text-blue-500 mr-2" />
                              <span>{doctor.qualification || 'MBBS, MD'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaClock className="h-4 w-4 text-blue-500 mr-2" />
                              <span>{doctor.experience || '10'} years experience</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaMapMarkerAlt className="h-4 w-4 text-blue-500 mr-2" />
                              <span>New Delhi, India</span>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-gray-500">Consultation Fee</span>
                              <span className="text-2xl font-bold text-blue-600">₹{doctor.consultationFee || '500'}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <Link 
                                to={`/doctors/${doctor._id}`} 
                                className="text-center py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium"
                              >
                                View Profile
                              </Link>
                              
                              <Link 
                                to={localStorage.getItem('token') ? "/patient/book-appointment" : "/login?redirect=/patient/book-appointment"}
                                className="text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors duration-200 font-medium"
                              >
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <FaUserMd className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">No doctors found</h3>
                    <p className="mt-2 text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {!loading && filteredDoctors.length > 9 && (
            <div className="mt-12 text-center">
              <button
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
              >
                Load More Doctors
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Can't find the right doctor?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Contact us and we'll help you find the perfect specialist for your needs
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-200 font-medium"
              >
                Contact Us
              </Link>
              <a
                href="tel:+911123345678"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Call: +91 11-2334-5678
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsList;

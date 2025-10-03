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
  FaCertificate
} from 'react-icons/fa';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        const todayAvailability = doctor.availability.find(day => day.day === dayOfWeek);
        matchesAvailability = todayAvailability && todayAvailability.isAvailable;
      } else if (selectedAvailability === 'thisWeek') {
        // At least one day available this week
        matchesAvailability = doctor.availability.some(day => day.isAvailable);
      }
    }
    
    return matchesSearch && matchesSpecialization && matchesRating && matchesAvailability;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80" 
            alt="Doctors" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Doctors
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Meet our team of experienced medical professionals dedicated to providing you with the best healthcare.
          </p>
        </div>
      </div>

      <div className="bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-10 bg-red-50 border-l-4 border-red-400 p-4">
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
          <div className="mb-10 bg-gray-50 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">Find the Right Doctor</h2>
              
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaStethoscope className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="specialization"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
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
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaStar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="rating"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={selectedRating}
                    onChange={e => setSelectedRating(e.target.value)}
                  >
                    <option value="">Any Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="availability"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={selectedAvailability}
                    onChange={e => setSelectedAvailability(e.target.value)}
                  >
                    <option value="">Any Availability</option>
                    <option value="today">Available Today</option>
                    <option value="thisWeek">Available This Week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className="mt-12">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="h-60 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map(doctor => (
                      <div key={doctor._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl duration-300">
                        <div className="h-60 bg-gray-200 relative">
                          <img 
                            src={doctor.user.profilePicture || "https://via.placeholder.com/300x240?text=Doctor"} 
                            alt={`Dr. ${doctor.user.name}`} 
                            className="w-full h-full object-cover"
                          />
                          {doctor.isAvailableNow && (
                            <div className="absolute top-4 right-4 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                              Available Now
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">Dr. {doctor.user.name}</h2>
                              <p className="mt-1 text-gray-600">{doctor.specialization}</p>
                            </div>
                            <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                              <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">({doctor.reviewCount || 0})</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <FaCertificate className="h-4 w-4 text-blue-500 mr-1" />
                            <span>{doctor.qualification}</span>
                          </div>
                          
                          <p className="mt-3 text-gray-500 text-sm line-clamp-2">
                            {doctor.biography || `Dr. ${doctor.user.name} is an experienced ${doctor.specialization} specialist with ${doctor.experience} years of practice.`}
                          </p>
                          
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span className="font-medium">Experience:</span>
                            <span className="ml-1">{doctor.experience} years</span>
                          </div>
                          
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="font-medium">Consultation Fee:</span>
                            <span className="ml-1">${doctor.consultationFee}</span>
                          </div>
                          
                          <div className="mt-6 flex space-x-3">
                            <Link 
                              to={`/doctors/${doctor._id}`} 
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              View Profile
                            </Link>
                            
                            {/* Only show Book Appointment if user is logged in */}
                            <Link 
                              to={localStorage.getItem('token') ? "/patient/book-appointment" : "/login?redirect=/patient/book-appointment"}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <FaCalendarAlt className="mr-2 -ml-1 h-4 w-4" />
                              Book Appointment
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FaUserMd className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No doctors found</h3>
                    <p className="mt-1 text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Reset all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {!loading && filteredDoctors.length > 6 && (
            <div className="mt-12 text-center">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Load More Doctors
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Looking for specialized care?</span>
            <span className="block text-blue-200">Book an appointment with one of our experts today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsList;

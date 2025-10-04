import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  FaHeartbeat,
  FaBrain, 
  FaBone, 
  FaLungs,
  FaStethoscope, 
  FaUserMd, 
  FaBaby, 
  FaEye,
  FaTooth,
  FaAllergies,
  FaAmbulance,
  FaFlask,
  FaArrowLeft,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Service icons mapping
  const serviceIcons = {
    cardiology: FaHeartbeat,
    pediatrics: FaBaby,
    orthopedics: FaBone,
    gynecology: FaUserMd,
    neurology: FaBrain,
    dermatology: FaUserMd,
    emergency: FaAmbulance,
    general: FaStethoscope,
    oncology: FaUserMd,
    psychiatry: FaBrain,
    ophthalmology: FaEye,
    ent: FaUserMd
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // Fetch service details
        const serviceResponse = await api.get(`/services/${id}`);
        setService(serviceResponse.data);
        
        // Fetch doctors for this service
        const doctorsResponse = await api.get(`/doctors?specialization=${serviceResponse.data.name}`);
        setDoctors(doctorsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service data:', error);
        setError('Failed to load service details');
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The service you are looking for does not exist.'}</p>
            <Link
              to="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const IconComponent = serviceIcons[service.id] || FaStethoscope;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to="/services"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                      <p className="text-lg text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="border-t border-gray-200 px-6 py-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Overview</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      Our {service.name} department provides comprehensive medical care with state-of-the-art facilities 
                      and experienced healthcare professionals. We are committed to delivering the highest quality 
                      treatment and care for all our patients.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our team of specialists works together to ensure that each patient receives personalized 
                      care tailored to their specific needs. We use the latest medical technologies and 
                      evidence-based treatments to achieve the best possible outcomes.
                    </p>
                  </div>
                </div>

                {/* What We Offer */}
                <div className="border-t border-gray-200 px-6 py-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What We Offer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Expert Consultation</p>
                        <p className="text-sm text-gray-500">Professional medical consultation and diagnosis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Advanced Diagnostics</p>
                        <p className="text-sm text-gray-500">State-of-the-art diagnostic equipment and tests</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Treatment Plans</p>
                        <p className="text-sm text-gray-500">Personalized treatment plans for each patient</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Follow-up Care</p>
                        <p className="text-sm text-gray-500">Comprehensive follow-up and monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
                <div className="space-y-4">
                  <Link
                    to="/doctors"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FaUserMd className="mr-2 h-5 w-5" />
                    Find Specialists
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <FaPhone className="mr-2 h-5 w-5" />
                    Contact Us
                  </Link>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Emergency?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      For urgent medical assistance, call our 24/7 emergency helpline.
                    </p>
                    <a
                      href="tel:+91-22-12345678"
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <FaPhone className="mr-2 h-4 w-4" />
                      Emergency: +91-22-12345678
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Doctors */}
          {doctors.length > 0 && (
            <div className="mt-12">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Our {service.name} Specialists
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.slice(0, 3).map((doctor) => (
                    <div key={doctor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={doctor.user.profilePicture || "https://via.placeholder.com/48x48?text=Dr"}
                          alt={`Dr. ${doctor.user.name}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Dr. {doctor.user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {doctor.experience} years experience
                          </p>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-500">
                              {doctor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link
                          to={`/doctors/${doctor._id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Profile →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                {doctors.length > 3 && (
                  <div className="mt-6 text-center">
                    <Link
                      to="/doctors"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All Specialists →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  FaChevronRight,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaArrowRight
} from 'react-icons/fa';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Enhanced fallback services with categories
  const fallbackServices = [
    {
      id: 'cardiology',
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options by leading cardiologists.',
      icon: <FaHeartbeat className="h-10 w-10" />,
      category: 'specialty',
      features: ['ECG & 2D Echo', 'Angiography', 'Heart Surgery', 'Cardiac Rehabilitation']
    },
    {
      id: 'neurology',
      title: 'Neurology',
      description: 'Specialized care for conditions affecting the brain, spine, and nervous system by expert neurologists.',
      icon: <FaBrain className="h-10 w-10" />,
      category: 'specialty',
      features: ['EEG & EMG', 'Stroke Treatment', 'Epilepsy Care', 'Neuro Surgery']
    },
    {
      id: 'orthopedics',
      title: 'Orthopedics',
      description: 'Treatment for bone, joint, and muscle conditions with both surgical and non-surgical approaches.',
      icon: <FaBone className="h-10 w-10" />,
      category: 'specialty',
      features: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Fracture Care']
    },
    {
      id: 'pulmonology',
      title: 'Pulmonology',
      description: 'Diagnosis and treatment of respiratory disorders and lung diseases by pulmonary specialists.',
      icon: <FaLungs className="h-10 w-10" />,
      category: 'specialty',
      features: ['Pulmonary Function Tests', 'Bronchoscopy', 'Sleep Studies', 'Asthma Care']
    },
    {
      id: 'general',
      title: 'General Medicine',
      description: 'Primary healthcare services for routine check-ups and common illnesses.',
      icon: <FaStethoscope className="h-10 w-10" />,
      category: 'preventive',
      features: ['Health Check-ups', 'Vaccination', 'Chronic Disease Management', 'Preventive Care']
    },
    {
      id: 'pediatrics',
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents by caring pediatricians.',
      icon: <FaBaby className="h-10 w-10" />,
      category: 'specialty',
      features: ['Growth Monitoring', 'Immunizations', 'Developmental Assessment', 'Child Nutrition']
    },
    {
      id: 'ophthalmology',
      title: 'Ophthalmology',
      description: 'Comprehensive eye care, vision correction, and treatment of eye diseases.',
      icon: <FaEye className="h-10 w-10" />,
      category: 'specialty',
      features: ['Eye Exams', 'Cataract Surgery', 'LASIK', 'Retina Care']
    },
    {
      id: 'dentistry',
      title: 'Dentistry',
      description: 'Complete dental care services from routine check-ups to advanced dental procedures.',
      icon: <FaTooth className="h-10 w-10" />,
      category: 'specialty',
      features: ['Dental Cleaning', 'Root Canal', 'Orthodontics', 'Cosmetic Dentistry']
    },
    {
      id: 'emergency',
      title: '24/7 Emergency Care',
      description: 'Round-the-clock emergency services with state-of-the-art facilities.',
      icon: <FaAmbulance className="h-10 w-10" />,
      category: 'emergency',
      features: ['Trauma Care', 'Ambulance Service', 'Critical Care', 'Emergency Surgery']
    },
    {
      id: 'laboratory',
      title: 'Laboratory & Diagnostics',
      description: 'Advanced diagnostic services with accurate and timely test results.',
      icon: <FaFlask className="h-10 w-10" />,
      category: 'diagnostic',
      features: ['Blood Tests', 'X-Ray & MRI', 'CT Scan', 'Pathology']
    }
  ];

  // Service icon mapping for API services
  const serviceIconMap = {
    cardiology: <FaHeartbeat className="h-10 w-10" />,
    neurology: <FaBrain className="h-10 w-10" />,
    orthopedics: <FaBone className="h-10 w-10" />,
    pulmonology: <FaLungs className="h-10 w-10" />,
    general: <FaStethoscope className="h-10 w-10" />,
    pediatrics: <FaBaby className="h-10 w-10" />,
    ophthalmology: <FaEye className="h-10 w-10" />,
    dentistry: <FaTooth className="h-10 w-10" />,
    emergency: <FaAmbulance className="h-10 w-10" />,
    laboratory: <FaFlask className="h-10 w-10" />,
    default: <FaStethoscope className="h-10 w-10" />
  };

  // Category mapping for services
  const getCategoryForService = (serviceName) => {
    const categoryMap = {
      'cardiology': 'specialty',
      'neurology': 'specialty',
      'orthopedics': 'specialty',
      'pulmonology': 'specialty',
      'pediatrics': 'specialty',
      'ophthalmology': 'specialty',
      'dentistry': 'specialty',
      'general': 'preventive',
      'general medicine': 'preventive',
      'preventive care': 'preventive',
      'emergency': 'emergency',
      'emergency care': 'emergency',
      '24/7 emergency': 'emergency',
      'laboratory': 'diagnostic',
      'diagnostics': 'diagnostic',
      'radiology': 'diagnostic',
      'pathology': 'diagnostic'
    };

    const lowerServiceName = serviceName.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerServiceName.includes(key)) {
        return value;
      }
    }
    return 'specialty'; // default category
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        
        // Transform API response to match our structure
        const transformedServices = response.data.map(service => ({
          id: service._id || service.id || service.title?.toLowerCase().replace(/\s+/g, '-'),
          title: service.title || service.name,
          description: service.description,
          icon: serviceIconMap[service.title?.toLowerCase().replace(/\s+/g, '')] || serviceIconMap.default,
          category: service.category || getCategoryForService(service.title || service.name || ''),
          features: service.features || []
        }));
        
        setServices(transformedServices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Use fallback services on error
        setServices(fallbackServices);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Service categories
  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'diagnostic', name: 'Diagnostic' },
    { id: 'specialty', name: 'Specialties' },
    { id: 'preventive', name: 'Preventive Care' }
  ];

  // Use API services if available, otherwise use fallback
  const displayedServices = services.length > 0 ? services : fallbackServices;
  
  // Filter services by category
  const filteredServices = activeCategory === 'all' 
    ? displayedServices 
    : displayedServices.filter(service => service.category === activeCategory);

  // Count services per category for display
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return displayedServices.length;
    return displayedServices.filter(service => service.category === categoryId).length;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Medical Equipment" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Our Medical Services
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive healthcare services delivered with compassion and excellence
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
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
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  {category.name} ({getCategoryCount(category.id)})
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FaStethoscope className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No services found</h3>
              <p className="mt-2 text-gray-600">No services available in this category.</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                View All Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                // Loading skeleton
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-gray-200 h-20 w-20"></div>
                    </div>
                    <div className="mt-6 h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="mt-6 h-10 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                filteredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 mx-auto group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h3 className="mt-6 text-2xl font-bold text-gray-900 text-center">
                        {service.title}
                      </h3>
                      <p className="mt-4 text-gray-600 text-center">
                        {service.description}
                      </p>
                      
                      {service.features && service.features.length > 0 && (
                        <div className="mt-6 space-y-2">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <FaCheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="px-8 pb-8">
                      <Link
                        to={`/services/${service.id}`}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium group"
                      >
                        Learn More
                        <FaArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose MedCare?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              We combine expertise with compassion to deliver exceptional healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <FaShieldAlt className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">NABH Accredited</h3>
              <p className="mt-2 text-sm text-gray-600">
                Internationally recognized standards for quality and patient safety
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <FaUserMd className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Expert Doctors</h3>
              <p className="mt-2 text-sm text-gray-600">
                Highly qualified specialists with years of experience
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <FaClock className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">24/7 Service</h3>
              <p className="mt-2 text-sm text-gray-600">
                Round-the-clock emergency and critical care services
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <FaFlask className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Modern Technology</h3>
              <p className="mt-2 text-sm text-gray-600">
                Latest medical equipment and diagnostic technologies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Need Help Choosing a Service?
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
              Our healthcare coordinators are here to guide you to the right specialist
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Contact Us
              </Link>
              <a
                href="tel:+911123345678"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-200 font-medium"
              >
                <FaPhone className="mr-2" />
                +91 11-2334-5678
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;

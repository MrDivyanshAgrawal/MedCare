// src/pages/Services.jsx
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
  FaFlask
} from 'react-icons/fa';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fallback services in case API fails or development
  const fallbackServices = [
    {
      id: 1,
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options by leading cardiologists.',
      icon: <FaHeartbeat className="h-10 w-10" />
    },
    {
      id: 2,
      title: 'Neurology',
      description: 'Specialized care for conditions affecting the brain, spine, and nervous system by expert neurologists.',
      icon: <FaBrain className="h-10 w-10" />
    },
    {
      id: 3,
      title: 'Orthopedics',
      description: 'Treatment for bone, joint, and muscle conditions with both surgical and non-surgical approaches.',
      icon: <FaBone className="h-10 w-10" />
    },
    {
      id: 4,
      title: 'Pulmonology',
      description: 'Diagnosis and treatment of respiratory disorders and lung diseases by pulmonary specialists.',
      icon: <FaLungs className="h-10 w-10" />
    },
    {
      id: 5,
      title: 'Internal Medicine',
      description: 'Preventive care and treatment of adult diseases by experienced internal medicine physicians.',
      icon: <FaStethoscope className="h-10 w-10" />
    },
    {
      id: 6,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents by caring pediatricians.',
      icon: <FaBaby className="h-10 w-10" />
    },
    {
      id: 7,
      title: 'Ophthalmology',
      description: 'Comprehensive eye care, vision correction, and treatment of eye diseases by expert ophthalmologists.',
      icon: <FaEye className="h-10 w-10" />
    },
    {
      id: 8,
      title: 'Dentistry',
      description: 'Complete dental care services from routine check-ups to advanced dental procedures.',
      icon: <FaTooth className="h-10 w-10" />
    },
    {
      id: 9,
      title: 'Allergy & Immunology',
      description: 'Diagnosis and treatment of allergies, asthma, and immunological disorders by specialists.',
      icon: <FaAllergies className="h-10 w-10" />
    },
    {
      id: 10,
      title: 'Emergency Care',
      description: '24/7 emergency services with state-of-the-art facilities and experienced medical professionals.',
      icon: <FaAmbulance className="h-10 w-10" />
    },
    {
      id: 11,
      title: 'Diagnostics & Laboratory',
      description: 'Advanced diagnostic services including pathology, radiology, and imaging with quick turnaround times.',
      icon: <FaFlask className="h-10 w-10" />
    },
    {
      id: 12,
      title: 'Telemedicine',
      description: 'Virtual consultations with healthcare providers from the comfort of your home.',
      icon: <FaUserMd className="h-10 w-10" />
    }
  ];

  // Use fallback if loading or error
  const displayedServices = (loading || error || services.length === 0) ? fallbackServices : services;

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
            alt="Medical Equipment" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            We offer a comprehensive range of healthcare services to meet all your medical needs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        {error && (
          <div className="max-w-7xl mx-auto mb-10">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
              Our Services
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Comprehensive Healthcare Solutions
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              From preventive care to specialized treatments, our medical team provides a wide range of services to ensure your health and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                  </div>
                  <div className="mt-6 h-4 bg-gray-200 rounded"></div>
                  <div className="mt-4 h-3 bg-gray-200 rounded"></div>
                  <div className="mt-1 h-3 bg-gray-200 rounded"></div>
                  <div className="mt-1 h-3 bg-gray-200 rounded"></div>
                  <div className="mt-4 h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))
            ) : (
              displayedServices.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600">
                    {service.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-gray-500">{service.description}</p>
                  <div className="mt-6 flex-grow flex items-end justify-center">
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Our Healthcare Services
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Quality Care</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Our medical professionals are committed to providing the highest standard of care using the latest treatments and technologies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Modern Facilities</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Our hospital is equipped with state-of-the-art technology and comfortable amenities for optimal patient care and comfort.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Comprehensive Services</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                From preventive care to specialized treatments, we offer a full range of medical services under one roof.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">24/7 Availability</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Our emergency services are available 24/7, ensuring you receive care whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Need medical assistance?</span>
            <span className="block text-blue-200">Schedule an appointment today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Register Now
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

export default Services;

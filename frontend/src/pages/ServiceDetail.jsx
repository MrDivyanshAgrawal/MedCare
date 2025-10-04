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
  FaClock,
  FaCheckCircle,
  FaStar,
  FaShieldAlt
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

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
    ophthalmology: FaEye,
    dentistry: FaTooth,
    laboratory: FaFlask,
    pulmonology: FaLungs
  };

  // Fallback service data
  const fallbackServiceData = {
    cardiology: {
      name: 'Cardiology',
      description: 'Comprehensive heart care services',
      detailedDescription: 'Our Cardiology department provides state-of-the-art cardiac care with a team of experienced cardiologists and cardiac surgeons. We offer comprehensive diagnostic, therapeutic, and preventive services for all heart-related conditions.',
      procedures: [
        'Coronary Angiography',
        'Angioplasty & Stenting',
        'Cardiac Surgery',
        'Pacemaker Implantation',
        'ECG & 2D Echo',
        'Stress Test',
        'Holter Monitoring'
      ],
      conditions: [
        'Heart Attack',
        'Heart Failure',
        'Arrhythmia',
        'Hypertension',
        'Coronary Artery Disease',
        'Valve Disorders'
      ]
    }
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // Simulate API response for development
        if (!service) {
          const mockService = {
            id: id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            description: `Comprehensive ${id} services`,
            ...fallbackServiceData[id]
          };
          setService(mockService);
        }
        
        // Fetch doctors for this service
        const doctorsResponse = await api.get(`/doctors?specialization=${id}`);
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Service Not Found</h1>
            <p className="mt-2 text-gray-600">{error || 'The service you are looking for does not exist.'}</p>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt={service.name}
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center text-white hover:text-blue-100 transition-colors duration-200 mb-8"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm text-white">
                <IconComponent className="h-12 w-12" />
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-2 text-xl text-blue-100">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'procedures', 'specialists', 'faqs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Overview</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.detailedDescription || `Our ${service.name} department provides comprehensive medical care with state-of-the-art facilities and experienced healthcare professionals. We are committed to delivering the highest quality treatment and care for all our patients.`}
                </p>
                
                {/* Key Features */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our {service.name} Department?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Expert medical team',
                      'Latest equipment & technology',
                      'Personalized care plans',
                      'Minimal waiting time',
                      'Insurance support',
                      'Post-treatment follow-up'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <FaCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'procedures' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Procedures & Treatments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(service.procedures || [
                    'Diagnostic Tests',
                    'Surgical Procedures',
                    'Non-invasive Treatments',
                    'Preventive Care',
                    'Rehabilitation Services',
                    'Follow-up Care'
                  ]).map((procedure, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-lg p-2 mr-3">
                          <FaShieldAlt className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-gray-800 font-medium">{procedure}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specialists' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Specialists</h2>
                {doctors.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {doctors.map((doctor) => (
                      <div key={doctor._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start space-x-4">
                          <img
                            className="h-16 w-16 rounded-full object-cover"
                            src={doctor.user.profilePicture || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"}
                            alt={`Dr. ${doctor.user.name}`}
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {doctor.user.name}
                            </h3>
                            <p className="text-gray-600">{doctor.qualification || 'MBBS, MD'}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {doctor.experience || '10'}+ years experience
                            </p>
                            <div className="flex items-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(doctor.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {doctor.rating || '4.5'} ({doctor.reviewCount || '20'}+ reviews)
                              </span>
                            </div>
                            <Link
                              to={`/doctors/${doctor._id}`}
                              className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              View Profile
                              <FaArrowLeft className="ml-2 h-3 w-3 rotate-180" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specialists available at the moment.</p>
                )}
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {[
                    {
                      question: `What conditions does the ${service.name} department treat?`,
                      answer: `Our ${service.name} department treats a wide range of conditions with specialized care and advanced treatment options.`
                    },
                    {
                      question: 'How do I book an appointment?',
                      answer: 'You can book an appointment online through our website, call our helpline, or visit the hospital reception.'
                    },
                    {
                      question: 'What should I bring for my first visit?',
                      answer: 'Please bring your ID proof, previous medical records, current medications list, and insurance details if applicable.'
                    },
                    {
                      question: 'Do you accept health insurance?',
                      answer: 'Yes, we accept most major health insurance plans. Please check with our billing department for specific coverage details.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  to="/appointments/new"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center font-medium"
                >
                  <FaCalendarAlt className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
                
                <Link
                  to="/doctors"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <FaUserMd className="mr-2 h-5 w-5" />
                  Find Specialists
                </Link>
                
                <Link
                  to="/contact"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <FaPhone className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </div>
              
              <div className="mt-8 p-4 bg-red-50 rounded-lg">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Emergency?</h4>
                <p className="text-sm text-red-600 mb-3">
                  For urgent medical assistance
                </p>
                <a
                  href="tel:+911123345678"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
                >
                  <FaPhone className="mr-2 h-4 w-4" />
                  +91 11-2334-5678
                </a>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Working Hours</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Mon - Sat</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>Emergency</span>
                    <span>24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;

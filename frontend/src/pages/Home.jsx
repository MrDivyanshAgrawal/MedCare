import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaCalendarCheck, 
  FaUserMd, 
  FaMedkit, 
  FaFileMedical,
  FaHeartbeat,
  FaStar,
  FaChartLine,
  FaClock,
  FaBell,
  FaArrowRight,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaStethoscope,
  FaBrain,
  FaBaby,
  FaXRay,
  FaShieldAlt,
  FaAmbulance,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    appointments: 0,
    medicalRecords: 0,
    prescriptions: 0,
    upcomingAppointments: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, servicesResponse] = await Promise.all([
          api.get('/doctors?limit=3&sort=rating'),
          api.get('/services?featured=true')
        ]);
        
        setTopDoctors(doctorsResponse.data);
        setServices(servicesResponse.data);
        
        // Fetch dashboard data if user is logged in
        if (currentUser) {
          try {
            const dashboardResponse = await api.get('/dashboard');
            setDashboardStats(dashboardResponse.data);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);
  
  // Indian testimonials
  const testimonials = [
    {
      id: 1,
      content: "The online appointment system is incredibly convenient. I could book my consultation with Dr. Sharma within minutes. The staff is professional and the facilities are world-class.",
      name: "Rajesh Malhotra",
      title: "Delhi",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      content: "Having my complete medical history digitally accessible has been a game-changer. During my recent emergency, doctors could quickly access my records and provide appropriate treatment.",
      name: "Anita Desai",
      title: "Mumbai",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      content: "The follow-up care and prescription management through the app is excellent. I never miss my medications thanks to the timely reminders. Highly recommend MedCare!",
      name: "Vikram Singh",
      title: "Bangalore",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  // Services with icons
  const featuredServices = [
    {
      icon: <FaHeartbeat className="h-8 w-8" />,
      title: "Cardiology",
      description: "Comprehensive heart care with ECG, 2D Echo, and advanced cardiac treatments",
      color: "red"
    },
    {
      icon: <FaBrain className="h-8 w-8" />,
      title: "Neurology",
      description: "Expert neurological care for brain and nervous system disorders",
      color: "purple"
    },
    {
      icon: <FaBaby className="h-8 w-8" />,
      title: "Pediatrics",
      description: "Specialized healthcare for infants, children, and adolescents",
      color: "pink"
    },
    {
      icon: <FaStethoscope className="h-8 w-8" />,
      title: "General Medicine",
      description: "Primary care services for common illnesses and preventive healthcare",
      color: "blue"
    },
    {
      icon: <FaXRay className="h-8 w-8" />,
      title: "Radiology",
      description: "Advanced imaging services including X-Ray, CT Scan, and MRI",
      color: "teal"
    },
    {
      icon: <FaAmbulance className="h-8 w-8" />,
      title: "Emergency Care",
      description: "24/7 emergency services with trauma care and critical support",
      color: "orange"
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-20" 
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Hospital Building" 
          />
        </div>
        <div className="absolute top-0 right-0 -mt-40 -mr-40 opacity-20">
          <svg width="400" height="400" fill="none" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="200" fill="white" fillOpacity="0.1"/>
            <circle cx="200" cy="200" r="150" fill="white" fillOpacity="0.1"/>
            <circle cx="200" cy="200" r="100" fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          {currentUser ? (
            // Logged in user content
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Welcome back, <span className="text-blue-200">{currentUser.name}!</span>
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
                Your health journey continues with us. Access your medical records, book appointments, and manage your healthcare - all in one place.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/${currentUser.role}/dashboard`}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  <FaChartLine className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
                <Link
                  to="/appointments/new"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-xl border border-blue-400"
                >
                  <FaCalendarCheck className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
              </div>
            </div>
          ) : (
            // Guest user content
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Your Health, <span className="text-blue-200">Our Priority</span>
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Experience healthcare redefined with MedCare Hospital. Book appointments with top specialists, access digital health records, and get 24/7 emergency care - all through our integrated healthcare platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  Get Started
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  <FaUser className="mr-2 h-5 w-5" />
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Quick Stats for Logged-in Users */}
      {currentUser && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Health Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.appointments}</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <FaCalendarCheck className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-600 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Medical Records</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.medicalRecords}</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <FaFileMedical className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-600 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Prescriptions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.prescriptions}</p>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <FaMedkit className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-600 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Upcoming Visits</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.upcomingAppointments.length}</p>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3">
                    <FaClock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Features Section */}
      <div className={`${currentUser ? 'py-16' : 'py-20'} bg-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Why Choose MedCare
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              Healthcare Made Simple & Accessible
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
              Our digital platform brings quality healthcare to your fingertips with innovative features
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <FaCalendarCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book appointments with specialists in just a few clicks, no more waiting in queues
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-green-600 rounded-full p-4">
                  <FaFileMedical className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Digital Records
              </h3>
              <p className="text-gray-600">
                Access your complete medical history anytime, anywhere with secure cloud storage
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-600 rounded-full p-4">
                  <FaUserMd className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Doctors
              </h3>
              <p className="text-gray-600">
                Consult with experienced specialists across 20+ departments
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-600 rounded-full p-4">
                  <FaBell className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Reminders
              </h3>
              <p className="text-gray-600">
                Never miss appointments or medications with intelligent notifications
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Doctors */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Our Specialists
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              Meet Our Top-Rated Doctors
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Experienced healthcare professionals committed to your well-being
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                topDoctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200">
                    <div className="h-64 relative">
                      <img 
                        className="w-full h-full object-cover"
                        src={doctor.user.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"} 
                        alt={`Dr. ${doctor.user.name}`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">Dr. {doctor.user.name}</h3>
                        <p className="text-blue-200">{doctor.specialization}</p>
                      </div>
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
                          <span className="ml-2 text-sm text-gray-600">
                            {doctor.rating || '4.5'} ({doctor.reviewCount || '50'}+ reviews)
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        {doctor.experience || '10'}+ years experience • {doctor.degree || 'MBBS, MD'}
                      </p>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Profile
                        <FaArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-12 text-center">
              <Link
                to="/doctors"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                View All Doctors
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Our Services
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              Comprehensive Medical Care
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
              From routine check-ups to specialized treatments, we've got you covered
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service, index) => (
                <div key={index} className="group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className={`inline-flex items-center justify-center p-4 bg-${service.color}-100 text-${service.color}-600 rounded-xl mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Learn More
                    <FaArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                Explore All Services
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Patient Stories
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              What Our Patients Say
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-8 relative transform hover:scale-105 transition-all duration-200">
                  <div className="absolute top-6 right-6">
                    <svg className="h-8 w-8 text-blue-100" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <div className="flex items-center mb-6">
                    <img 
                      className="h-14 w-14 rounded-full object-cover"
                      src={testimonial.image} 
                      alt={testimonial.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action - Only show for non-logged in users */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <svg className="absolute bottom-0 left-0 transform translate-x-1/2 translate-y-1/2" width="400" height="400" fill="none" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="200" fill="white" fillOpacity="0.05"/>
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Ready to Experience Better Healthcare?
              </h2>
              <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
                Join thousands of patients who trust MedCare for their healthcare needs
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  Create Free Account
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white border-2 border-white hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location CTA - Show for both logged-in and guest users */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Visit Us Today</h3>
              <p className="text-gray-600 mb-6">Located at the heart of New Delhi</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  <span>Connaught Place, New Delhi - 110001</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaPhone className="mr-2 text-blue-600" />
                  <a href="tel:+911123345678" className="hover:text-blue-600">+91 11-2334-5678</a>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 mt-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Get Directions
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

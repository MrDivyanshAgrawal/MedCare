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
  FaSignOutAlt
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
      content: "The online appointment system made scheduling my visit very easy. The doctors were professional and thorough. Highly recommended!",
      name: "Ravi Kumar",
      title: "Patient",
      image: "https://randomuser.me/api/portraits/men/12.jpg"
    },
    {
      id: 2,
      content: "I was able to access my medical records instantly and share them with my specialist. The digital system of this hospital is revolutionizing healthcare.",
      name: "Priya Sharma",
      title: "Patient",
      image: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    {
      id: 3,
      content: "From booking to consultation and follow-up, everything was seamless. The staff is caring and the facilities are state-of-the-art.",
      name: "Amit Patel",
      title: "Patient",
      image: "https://randomuser.me/api/portraits/men/33.jpg"
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50" 
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80" 
            alt="Hospital Building" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          {currentUser ? (
            // Logged in user content
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
                Manage your health with our comprehensive digital healthcare platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/${currentUser.role}/dashboard`}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  <FaChartLine className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 transition-colors"
                >
                  <FaUserMd className="mr-2 h-5 w-5" />
                  Find Doctors
                </Link>
              </div>
            </div>
          ) : (
            // Guest user content
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Modern Healthcare Services at Your Doorstep
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
                Experience world-class healthcare with our integrated digital health records system. Book appointments with top Indian doctors, access your medical history, and connect with specialists across India - all in one place.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  Register Now
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 transition-colors"
                >
                  Find Doctors
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Quick Stats for Logged-in Users */}
      {currentUser && (
        <div className="bg-gray-50 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaCalendarCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Appointments</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.appointments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaFileMedical className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Medical Records</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.medicalRecords}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaMedkit className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Prescriptions</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.prescriptions}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaClock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Upcoming</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.upcomingAppointments.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Features Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Simple and Convenient Digital Healthcare Services
            </p>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
              Our integrated healthcare management system provides you with a seamless healthcare experience.
            </p>
          </div>

          <div className="mt-10 sm:mt-16">
            <dl className="space-y-8 sm:space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaCalendarCheck className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Online Appointment Booking
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Schedule appointments with your preferred doctors at your convenience, without waiting on hold.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaFileMedical className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Digital Health Records
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Access your complete medical history, prescriptions, and test results securely from anywhere.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaUserMd className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Expert Specialists
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Connect with experienced doctors across various specializations for the best care possible.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FaMedkit className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Prescription Management
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Receive digital prescriptions and medication reminders to ensure you never miss a dose.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* Top Doctors */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Our Experts
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Meet Our Top Doctors
            </p>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
              Experienced healthcare professionals dedicated to providing the highest quality care.
            </p>
          </div>

          <div className="mt-10 sm:mt-16">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                topDoctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img 
                        className="w-full h-full object-cover"
                        src={doctor.user.profilePicture || "https://via.placeholder.com/300x200?text=Doctor"} 
                        alt={`Dr. ${doctor.user.name}`}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Dr. {doctor.user.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{doctor.specialization}</p>
                      <div className="mt-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i}
                            className={`h-4 w-4 ${i < Math.round(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-500">({doctor.reviewCount || 0} reviews)</span>
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/doctors/${doctor._id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/doctors"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Services
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Comprehensive Healthcare Services
            </p>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
              We provide a wide range of medical services to meet all your healthcare needs.
            </p>
          </div>
          
          <div className="mt-10 sm:mt-16">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FaHeartbeat className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <Link to="/services" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true"></span>
                      Cardiology
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Comprehensive heart care with advanced diagnostic and treatment options by leading cardiologists.
                  </p>
                </div>
              </div>
              
              <div className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FaMedkit className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <Link to="/services" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true"></span>
                      Emergency Care
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    24/7 emergency services with state-of-the-art facilities and experienced medical professionals.
                  </p>
                </div>
              </div>
              
              <div className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FaUserMd className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <Link to="/services" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true"></span>
                      General Medicine
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Primary care services for patients of all ages, including preventive care and chronic disease management.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/services"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Customer Feedback
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              What Our Patients Say
            </p>
          </div>
          
          <div className="mt-10 sm:mt-16">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-12 w-12 rounded-full"
                        src={testimonial.image} 
                        alt={testimonial.name}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        className="h-4 w-4 text-yellow-400" 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Create an account or book an appointment today.</span>
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

export default Home;

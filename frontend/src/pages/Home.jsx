import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaCalendarCheck, FaUserMd, FaNotesMedical, FaHospital } from 'react-icons/fa';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Health Is Our Top Priority
              </h1>
              <p className="text-lg mb-8 text-blue-100">
                Experience the best healthcare services with our dedicated team of medical professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/appointments" className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50">
                  Book Appointment
                </Link>
                <Link to="/services" className="px-4 py-2 bg-transparent border-2 border-white rounded-md hover:bg-blue-700">
                  Our Services
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                alt="Healthcare professionals" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare services to meet all your medical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaCalendarCheck className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Online Appointments</h3>
              <p className="text-gray-600">
                Book appointments online and skip the wait. Our efficient system ensures you get the care you need when you need it.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaUserMd className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Consultations</h3>
              <p className="text-gray-600">
                Get expert medical advice from our team of specialists with years of experience in various medical fields.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaNotesMedical className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Records</h3>
              <p className="text-gray-600">
                Access your medical records anytime, anywhere. Our digital system keeps your health information secure and accessible.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaHospital className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Facilities</h3>
              <p className="text-gray-600">
                Our state-of-the-art facilities ensure that you receive the best medical care with the latest technology.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/services" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to experience better healthcare?</h2>
            <p className="text-xl mb-8">
              Join thousands of patients who trust us with their health. Register today and take the first step towards better health management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50">
                Register Now
              </Link>
              <Link to="/contact" className="px-4 py-2 bg-transparent border-2 border-white rounded-md hover:bg-blue-600">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;

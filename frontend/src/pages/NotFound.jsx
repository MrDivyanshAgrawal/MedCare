import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaExclamationTriangle, FaHome, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center items-center py-12 px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-9xl font-extrabold text-gray-200 animate-pulse">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-yellow-100 rounded-full p-6 animate-bounce">
                <FaExclamationTriangle className="h-16 w-16 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            The page you're looking for seems to have gone for a medical checkup. 
            Don't worry, we'll help you find your way back!
          </p>
          
          {/* Auto-redirect notice */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-700">
              You'll be redirected to the homepage in{' '}
              <span className="font-bold text-blue-900">{countdown}</span> seconds
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
            >
              <FaHome className="mr-2 -ml-1 h-5 w-5" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            >
              <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
              Go Back
            </button>
          </div>
          
          {/* Helpful links */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <FaSearch className="mr-2 h-5 w-5 text-blue-600" />
              Maybe you were looking for:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/doctors" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                Find Doctors →
              </Link>
              <Link to="/appointments" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                Book Appointment →
              </Link>
              <Link to="/services" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                Our Services →
              </Link>
              <Link to="/contact" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                Contact Us →
              </Link>
            </div>
          </div>
          
          {/* Fun medical fact */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Fun Medical Fact:</span> The human body contains approximately 37.2 trillion cells!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

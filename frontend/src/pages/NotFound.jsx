// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center">
            <FaExclamationTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            404
          </h1>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            Page Not Found
          </p>
          
          <p className="mt-4 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaHome className="mr-2 -ml-1 h-4 w-4" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

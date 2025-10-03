import { Link } from 'react-router-dom';
import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <FaHospital className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">MedCare</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Providing quality healthcare services with a focus on patient well-being and innovative medical solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Our Services</Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Our Doctors</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-blue-500 transition-colors duration-300">General Consultation</li>
              <li className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Pediatric Care</li>
              <li className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Cardiology</li>
              <li className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Neurology</li>
              <li className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Orthopedics</li>
              <li className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Dermatology</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-500" />
                <span className="text-gray-400">123 Healthcare Ave, Medical District, City, Country</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-blue-500" />
                <span className="text-gray-400">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-500" />
                <span className="text-gray-400">info@medcare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MedCare Hospital. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link to="/privacy" className="hover:text-blue-500 transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-500 transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

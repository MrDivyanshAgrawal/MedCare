import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaHospital
} from 'react-icons/fa';

const Contact = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      toast.success('Your message has been sent successfully. We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('There was an error sending your message. Please try again.');
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Indian contact information
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="h-6 w-6 text-blue-500" />,
      title: 'Address',
      details: [
        '123 MG Road, Fort',
        'Mumbai, Maharashtra 400001',
        'India'
      ]
    },
    {
      icon: <FaPhone className="h-6 w-6 text-blue-500" />,
      title: 'Phone',
      details: [
        '+91-22-12345678',
        '+91-9876543210'
      ]
    },
    {
      icon: <FaEnvelope className="h-6 w-6 text-blue-500" />,
      title: 'Email',
      details: [
        'info@arogyahospital.com',
        'support@arogyahospital.com'
      ]
    },
    {
      icon: <FaClock className="h-6 w-6 text-blue-500" />,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 8:00 AM - 8:00 PM',
        'Saturday: 9:00 AM - 5:00 PM',
        'Sunday: Closed (Emergency services available 24/7)'
      ]
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
            alt="Hospital Reception" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white">
            Contact Us
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-blue-100 max-w-3xl">
            We're here to help and answer any questions you might have. We look forward to hearing from you.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Contact Information */}
            <div>
              <div className="mb-10">
                <FaHospital className="h-10 w-10 text-blue-600" />
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Get in Touch</h2>
                <p className="mt-4 text-lg text-gray-500">
                  Have questions about our services or need medical advice? Our dedicated team is ready to assist you.
                </p>
              </div>
              
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <div className="mt-1 text-gray-500">
                        {item.details.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 lg:col-span-2">
              {submitted ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-gray-900">Thank you for your message!</h3>
                  <p className="mt-2 text-gray-500">
                    We've received your inquiry and will get back to you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number (optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.subject ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.subject && (
                          <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.message ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Location</h2>
          <div className="h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Hospital Location"
              className="w-full h-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6175903077147!2d-73.98776534880205!3d40.748440279226275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building%2C%20New%20York%2C%20NY%2010001%2C%20USA!5e0!3m2!1sen!2s!4v1624461309629!5m2!1sen!2s"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* Emergency Contact */}
      <div className="bg-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Emergency? Call Our 24/7 Helpline</h2>
          <a 
            href="tel:+91-22-12345678" 
            className="text-2xl sm:text-3xl font-bold text-white hover:underline"
          >
            +91-22-12345678
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

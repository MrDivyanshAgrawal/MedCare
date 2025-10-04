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
  FaHospital,
  FaWhatsapp,
  FaAmbulance
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
    
    if (formData.phone && !/^(\+91)?[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid Indian mobile number';
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
  
  // Updated Indian contact information matching footer
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="h-6 w-6 text-blue-500" />,
      title: 'Address',
      details: [
        'MedCare Hospital,',
        'Connaught Place, Central Delhi,',
        'New Delhi - 110001'
      ]
    },
    {
      icon: <FaPhone className="h-6 w-6 text-blue-500" />,
      title: 'Phone',
      details: [
        '+91 11-2334-5678',
        '+91 98765-43210 (Emergency)'
      ]
    },
    {
      icon: <FaEnvelope className="h-6 w-6 text-blue-500" />,
      title: 'Email',
      details: [
        'info@medcare.co.in',
        'support@medcare.co.in'
      ]
    },
    {
      icon: <FaClock className="h-6 w-6 text-blue-500" />,
      title: 'Working Hours',
      details: [
        'Monday - Saturday: 8:00 AM - 8:00 PM',
        'Sunday: 10:00 AM - 4:00 PM',
        'Emergency services available 24/7'
      ]
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section with Gradient Overlay */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Hospital Reception" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white">
              Get in Touch
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+911123345678" 
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                <FaPhone className="mr-2" />
                Call Now
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-8">
                  <FaHospital className="h-12 w-12 text-blue-600" />
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">Contact Information</h2>
                  <p className="mt-2 text-gray-600">
                    Reach out to us through any of these channels.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-50 rounded-lg p-3">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{item.title}</h3>
                        <div className="mt-1 text-gray-600 text-sm">
                          {item.details.map((detail, i) => (
                            <p key={i} className="leading-relaxed">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Section */}
                <div className="mt-8 bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center">
                    <FaAmbulance className="h-8 w-8 text-red-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">24/7 Emergency</h3>
                      <a href="tel:+919876543210" className="text-2xl font-bold text-red-600 hover:text-red-700">
                        +91 98765-43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                      <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-gray-900">Thank you for reaching out!</h3>
                    <p className="mt-2 text-lg text-gray-600">
                      We've received your message and will respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                    <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 border ${
                              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-3 border ${
                              errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                          />
                          {errors.email && (
                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className={`w-full px-4 py-3 border ${
                              errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                          />
                          {errors.phone && (
                            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${
                              errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                          >
                            <option value="">Select a subject</option>
                            <option value="appointment">Book an Appointment</option>
                            <option value="general">General Inquiry</option>
                            <option value="feedback">Feedback</option>
                            <option value="complaint">Complaint</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.subject && (
                            <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please describe your inquiry in detail..."
                          className={`w-full px-4 py-3 border ${
                            errors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                        ></textarea>
                        {errors.message && (
                          <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : 'Send Message'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Find Us Here</h2>
            <p className="mt-2 text-lg text-gray-600">Visit our hospital at Connaught Place, New Delhi</p>
          </div>
          <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              title="Hospital Location"
              className="w-full h-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9843729268444!2d77.21707131508219!3d28.630196282420594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741349f%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1624461309629!5m2!1sen!2sin"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
            <p className="text-xl text-blue-100 mb-8">Our emergency services are available 24/7</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+919876543210" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                <FaAmbulance className="mr-3 text-2xl" />
                Call Emergency: +91 98765-43210
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

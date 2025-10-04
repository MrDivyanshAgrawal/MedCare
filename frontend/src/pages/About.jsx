import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FaHistory, FaAward, FaUsers, FaUserMd, FaProcedures, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter } from 'react-icons/fa';

const About = () => {
  // Sample statistics
  const statistics = [
    { id: 1, name: 'Years of Excellence', value: '25+', icon: <FaHistory className="h-8 w-8 text-blue-500" /> },
    { id: 2, name: 'Expert Doctors', value: '50+', icon: <FaUserMd className="h-8 w-8 text-blue-500" /> },
    { id: 3, name: 'Happy Patients', value: '1,00,000+', icon: <FaUsers className="h-8 w-8 text-blue-500" /> },
    { id: 4, name: 'Medical Procedures', value: '500+', icon: <FaProcedures className="h-8 w-8 text-blue-500" /> },
  ];

  // Sample awards with Indian organizations
  const awards = [
    { year: 2023, title: 'Excellence in Digital Healthcare', organization: 'Indian Medical Association' },
    { year: 2022, title: 'Best Hospital Management System', organization: 'Healthcare Federation of India' },
    { year: 2021, title: 'Patient Care Excellence Award', organization: 'NABH (National Accreditation Board)' },
    { year: 2020, title: 'Innovation in Healthcare', organization: 'FICCI Health Awards' },
  ];

  // Indian team members
  const teamMembers = [
    { 
      name: 'Dr. Priya Sharma', 
      role: 'Chief Medical Officer',
      qualification: 'MBBS, MD, FICP',
      image: 'https://randomuser.me/api/portraits/women/44.jpg' 
    },
    { 
      name: 'Dr. Rajesh Kumar', 
      role: 'Head of Cardiology',
      qualification: 'MBBS, MD, DM (Cardiology)',
      image: 'https://randomuser.me/api/portraits/men/32.jpg' 
    },
    { 
      name: 'Dr. Sunita Patel', 
      role: 'Chief of Surgery',
      qualification: 'MBBS, MS, MCh',
      image: 'https://randomuser.me/api/portraits/women/68.jpg' 
    },
    { 
      name: 'Amit Verma', 
      role: 'Hospital Administrator',
      qualification: 'MBA (Healthcare), MHA',
      image: 'https://randomuser.me/api/portraits/men/75.jpg' 
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Hospital Interior" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white">
              About MedCare Hospital
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Delivering compassionate healthcare with cutting-edge technology since 1998
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-white">
                <FaMapMarkerAlt className="mr-2" />
                <span>Connaught Place, New Delhi</span>
              </div>
              <div className="flex items-center text-white">
                <FaPhone className="mr-2" />
                <span>+91 11-2334-5678</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Journey</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Legacy of Healthcare Excellence
            </p>
          </div>

          <div className="mt-12 lg:mt-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="relative">
                <div className="relative mb-10 lg:mb-0">
                  <img
                    className="w-full rounded-2xl shadow-2xl"
                    src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
                    alt="Hospital Building"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 mix-blend-multiply opacity-20 rounded-2xl"></div>
                </div>
              </div>
              <div className="lg:pl-8">
                <div className="prose prose-lg text-gray-600">
                  <p>
                    Established in 1998 in the heart of New Delhi, MedCare Hospital began as a modest clinic with a vision to provide accessible, quality healthcare to every Indian. Our founder, Dr. Ramesh Gupta, believed that healthcare should be a right, not a privilege.
                  </p>
                  <p className="mt-4">
                    Over the past 25 years, we've grown from a 20-bed facility to a 200-bed multi-specialty hospital, serving over 1 lakh patients annually. Our commitment to combining traditional care values with modern technology has made us a trusted name in Delhi-NCR.
                  </p>
                  <p className="mt-4">
                    In 2020, we embraced digital transformation, launching our comprehensive Hospital Management System. This initiative has revolutionized how we deliver care, making healthcare more accessible and efficient for our patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Impact in Numbers
            </h2>
            <p className="mt-3 text-xl text-gray-600 sm:mt-4">
              Serving the Delhi-NCR region with excellence and compassion
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat) => (
              <div key={stat.id} className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-200">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <dd className="text-4xl font-extrabold text-blue-600">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-lg font-medium text-gray-900">
                  {stat.name}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Mission and Values */}
      <div className="py-16 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div className="mb-12 lg:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Our Mission
                </h2>
                <p className="text-lg leading-relaxed">
                  To provide world-class healthcare services that are accessible, affordable, and patient-centric. We strive to combine the warmth of traditional Indian care values with cutting-edge medical technology.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3">24/7 Emergency Services</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3">Cashless Treatment Facilities</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3">NABH Accredited Hospital</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Core Values
              </h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Excellence</h3>
                    <p className="mt-1 text-gray-600">
                      Pursuing the highest standards in medical care and patient safety.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Compassion</h3>
                    <p className="mt-1 text-gray-600">
                      Treating every patient with empathy, respect, and dignity.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Integrity</h3>
                    <p className="mt-1 text-gray-600">
                      Maintaining transparency and ethical practices in all our operations.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Innovation</h3>
                    <p className="mt-1 text-gray-600">
                      Embracing technology and new methods to improve healthcare delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
              Our Leadership
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Our Expert Team
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-600">
              Led by some of India's finest medical professionals
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-200">
                <div className="h-56 relative bg-gradient-to-br from-blue-500 to-blue-700">
                  <img 
                    className="w-full h-full object-cover"
                    src={member.image} 
                    alt={member.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="mt-2 text-sm text-gray-600">{member.qualification}</p>
                  <div className="mt-4 flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                      <FaLinkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                      <FaTwitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards & Recognition */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
              Awards & Recognition
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Recognized for Excellence
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-600">
              Our commitment to quality healthcare has earned us prestigious accolades
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {awards.map((award, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 flex items-start hover:shadow-lg transition-shadow duration-200">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 text-white">
                      <FaAward className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-900">{award.title}</h4>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <span className="font-medium">{award.year}</span>
                      <span className="mx-2">•</span>
                      <span>{award.organization}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to experience our care?</span>
                <span className="block text-blue-200 text-2xl mt-2">Join thousands of satisfied patients</span>
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Book an appointment today or contact us for any queries
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:mt-0 lg:flex-shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white border-2 border-white hover:bg-white hover:text-blue-700 transition-colors duration-200"
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

export default About;

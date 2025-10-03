import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FaHistory, FaAward, FaUsers, FaUserMd, FaProcedures } from 'react-icons/fa';

const About = () => {
  // Sample statistics
  const statistics = [
    { id: 1, name: 'Years of Experience', value: '25+', icon: <FaHistory className="h-6 w-6 text-blue-500" /> },
    { id: 2, name: 'Qualified Doctors', value: '50+', icon: <FaUserMd className="h-6 w-6 text-blue-500" /> },
    { id: 3, name: 'Satisfied Patients', value: '10,000+', icon: <FaUsers className="h-6 w-6 text-blue-500" /> },
    { id: 4, name: 'Medical Procedures', value: '500+', icon: <FaProcedures className="h-6 w-6 text-blue-500" /> },
  ];

  // Sample awards
  const awards = [
    { year: 2023, title: 'Excellence in Digital Healthcare', organization: 'Healthcare Innovation Awards' },
    { year: 2022, title: 'Best Hospital Management System', organization: 'Medical Technology Association' },
    { year: 2021, title: 'Patient Satisfaction Award', organization: 'National Healthcare Standards' },
    { year: 2020, title: 'Digital Transformation in Healthcare', organization: 'Health Tech Summit' },
  ];

  // Sample team members
  const teamMembers = [
    { name: 'Dr. Emily Chen', role: 'Chief Medical Officer', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { name: 'Dr. Robert Williams', role: 'Head of Cardiology', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Dr. Sarah Johnson', role: 'Chief of Surgery', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Michael Roberts', role: 'Hospital Director', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-blue-700">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1953&q=80" 
            alt="Hospital Interior" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Us
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Discover our story, our mission, and the people behind our innovative healthcare system.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Story</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A History of Excellence in Healthcare
            </p>
          </div>

          <div className="mt-12 lg:mt-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <div className="relative mb-10 lg:mb-0">
                  <img
                    className="w-full rounded-lg shadow-lg"
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&q=80"
                    alt="Hospital Building"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 mix-blend-multiply opacity-20 rounded-lg"></div>
                </div>
              </div>
              <div className="sm:pl-6">
                <p className="text-lg text-gray-500">
                  Founded in 1998, our hospital began with a simple mission: to provide accessible, quality healthcare to our community. Over the years, we've grown from a small clinic to a comprehensive healthcare facility equipped with the latest technology and staffed by top medical professionals.
                </p>
                <p className="mt-4 text-lg text-gray-500">
                  In 2018, we recognized the need to embrace digital transformation in healthcare. We launched our Hospital Management & Digital Health Records System to streamline operations, improve patient care, and make healthcare more accessible than ever before.
                </p>
                <p className="mt-4 text-lg text-gray-500">
                  Today, we continue to innovate and expand our services, always with our core values of compassion, excellence, and patient-centered care at heart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Impact in Numbers
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Over the years, we've achieved significant milestones in providing quality healthcare.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat) => (
              <div key={stat.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center">
                  <div className="p-3 rounded-md bg-blue-50">
                    {stat.icon}
                  </div>
                </div>
                <dt className="mt-4 text-lg leading-6 font-medium text-gray-900 text-center">
                  {stat.name}
                </dt>
                <dd className="mt-2 text-3xl font-extrabold text-blue-600 text-center">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Mission and Values */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
                Our Mission
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">
                Providing Exceptional Healthcare for Everyone
              </p>
              <p className="mt-4 text-lg text-gray-500">
                We are committed to delivering the highest quality healthcare services with compassion, respect, and a patient-centered approach. Our mission is to improve the health and well-being of our community through innovative medical practices and accessible care.
              </p>
              <div className="mt-8 sm:flex">
                <div className="rounded-md shadow">
                  <Link
                    to="/services"
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Our Services
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
                Our Values
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Excellence</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We strive for excellence in every aspect of our service, from patient care to administrative processes.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Compassion</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We treat every patient with kindness, empathy, and respect, recognizing their individual needs.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Integrity</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We uphold the highest ethical standards in our practices, ensuring transparency and trust.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Innovation</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We continuously seek new ways to improve our services and embrace technological advancements.
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
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
              Our Team
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Meet Our Leadership
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our experienced team of medical professionals and administrators is dedicated to providing the highest quality care.
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-none">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 relative">
                  <img 
                    className="w-full h-full object-cover"
                    src={member.image} 
                    alt={member.name} 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{member.role}</p>
                  <div className="mt-4 flex space-x-2">
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
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
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
              Awards & Recognition
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Excellence in Healthcare
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our commitment to quality healthcare has been recognized by numerous organizations.
            </p>
          </div>

          <div className="mt-12">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {awards.map((award) => (
                <div key={award.title} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <FaAward className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg leading-6 font-medium text-gray-900">{award.title}</h4>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{award.year}</span>
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
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience our care?</span>
            <span className="block text-blue-200">Book an appointment or contact us today.</span>
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

export default About;

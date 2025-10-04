import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaNotesMedical, 
  FaSearch,
  FaStethoscope,
  FaStar,
  FaClock,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  const navigate = useNavigate();

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Generate available time slots for selected date and doctor
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const generateTimeSlots = async () => {
        try {
          // Get the selected doctor's availability for the selected day
          const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'lowercase' });
          const dayAvailability = selectedDoctor.availability?.find(
            (avail) => avail.day === selectedDay && avail.isAvailable
          );

          if (!dayAvailability) {
            setAvailableTimeSlots([]);
            return;
          }

          // Generate time slots from start time to end time
          const startTime = parseInt(dayAvailability.startTime.split(':')[0]);
          const endTime = parseInt(dayAvailability.endTime.split(':')[0]);
          
          const slots = [];
          for (let hour = startTime; hour < endTime; hour++) {
            const formattedHour = hour.toString().padStart(2, '0');
            slots.push(`${formattedHour}:00`);
            slots.push(`${formattedHour}:30`);
          }
          
          // Check which slots are already booked
          try {
            const bookedSlotsResponse = await api.get(`/appointments/check-availability`, {
              params: {
                doctorId: selectedDoctor._id,
                date: selectedDate
              }
            });
            
            const bookedSlots = bookedSlotsResponse.data.bookedTimeSlots || [];
            
            // Filter out already booked slots
            const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));
            setAvailableTimeSlots(availableSlots);
          } catch (error) {
            // If API call fails, show all slots
            setAvailableTimeSlots(slots);
          }
        } catch (err) {
          console.error('Error generating time slots:', err);
          toast.error('Failed to load available time slots');
          setAvailableTimeSlots([]);
        }
      };

      generateTimeSlots();
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate('');
    setSelectedTimeSlot('');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot || !reasonForVisit.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        reasonForVisit
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      console.error('Error booking appointment:', err);
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter doctors based on search and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !specializationFilter || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations
  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Book an Appointment</h1>
            <p className="text-blue-100 text-lg">
              Choose your doctor and schedule a convenient time for your visit
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Select Doctor */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-3">
                1
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Select a Doctor</h2>
            </div>
            
            {/* Search and Filter */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <FaStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                        selectedDoctor?._id === doctor._id
                          ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={doctor.user.profilePicture || `https://ui-avatars.com/api/?name=${doctor.user.name}&background=0891b2&color=fff`}
                          alt={doctor.user.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">Dr. {doctor.user.name}</h3>
                          <p className="text-gray-600 flex items-center mt-1">
                            <FaStethoscope className="mr-2 h-4 w-4" />
                            {doctor.specialization}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaClock className="mr-2 h-4 w-4" />
                              {doctor.experience || '10'} years experience
                            </p>
                            <p className="text-sm font-semibold text-blue-600 flex items-center">
                              <FaRupeeSign className="mr-1 h-4 w-4" />
                              {doctor.consultationFee || '500'}
                            </p>
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={`h-4 w-4 ${i < (doctor.rating || 4) ? '' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {doctor.rating || '4.5'} ({doctor.reviewsCount || '50'}+ reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedDoctor?._id === doctor._id && (
                          <div className="flex-shrink-0">
                            <FaCheckCircle className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <FaUserMd className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg">No doctors found matching your criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Select Date & Time */}
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-opacity duration-300 ${
            selectedDoctor ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-3">
                2
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Select Date & Time</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={handleDateChange}
                      disabled={!selectedDoctor}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  {!selectedDoctor && (
                    <p className="mt-2 text-sm text-gray-500">Please select a doctor first</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((timeSlot) => (
                          <button
                            key={timeSlot}
                            type="button"
                            className={`p-3 text-center rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedTimeSlot === timeSlot
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                            }`}
                            onClick={() => handleTimeSlotSelect(timeSlot)}
                          >
                            {timeSlot}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500">
                          <FaClock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-sm">
                            {selectedDate
                              ? "No available time slots for the selected date"
                              : "Please select a date to see available time slots"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Appointment Details */}
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-opacity duration-300 ${
            selectedDoctor && selectedDate && selectedTimeSlot ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-3">
                3
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
            </div>
            <div className="px-6 py-6">
              <div>
                <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <div className="relative">
                  <FaNotesMedical className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    id="reasonForVisit"
                    name="reasonForVisit"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe your symptoms or reason for the appointment"
                    required
                  />
                </div>
              </div>
              
              {/* Appointment Summary */}
              {selectedDoctor && selectedDate && selectedTimeSlot && (
                <div className="mt-6 bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium text-gray-900">Dr. {selectedDoctor.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium text-gray-900">{selectedDoctor.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-900">{selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-blue-200">
                      <span className="text-gray-600">Consultation Fee:</span>
                      <span className="font-bold text-gray-900 text-lg">₹{selectedDoctor.consultationFee || '500'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !selectedDoctor || !selectedDate || !selectedTimeSlot || !reasonForVisit.trim()}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                isSubmitting || !selectedDoctor || !selectedDate || !selectedTimeSlot || !reasonForVisit.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 shadow-lg'
              }`}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;

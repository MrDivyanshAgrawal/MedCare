import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUserMd, FaCalendarAlt, FaNotesMedical } from 'react-icons/fa';

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
          const dayAvailability = selectedDoctor.availability.find(
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
            // src/pages/patient/BookAppointment.jsx (continued)
            const formattedHour = hour.toString().padStart(2, '0');
            slots.push(`${formattedHour}:00`);
            slots.push(`${formattedHour}:30`);
          }
          
          // Check which slots are already booked
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h1 className="text-2xl font-bold">Book an Appointment</h1>
            <p className="mt-1 text-blue-100">
              Select a doctor and schedule your appointment
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <FaUserMd className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Select a Doctor</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedDoctor?._id === doctor._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="flex items-start">
                        <img
                          src={doctor.user.profilePicture || "https://via.placeholder.com/64"}
                          alt={doctor.user.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">Dr. {doctor.user.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                          <p className="text-sm text-gray-600 mt-1">Experience: {doctor.experience} years</p>
                          <p className="text-sm font-medium text-blue-600 mt-1">Fee: ${doctor.consultationFee}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    No doctors available at the moment.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <FaCalendarAlt className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Select Date & Time</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={handleDateChange}
                    disabled={!selectedDoctor}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  {!selectedDoctor && (
                    <p className="mt-2 text-sm text-gray-500">Please select a doctor first</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((timeSlot) => (
                        <div
                          key={timeSlot}
                          className={`p-2 text-center border rounded cursor-pointer text-sm ${
                            selectedTimeSlot === timeSlot
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                        >
                          {timeSlot}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-500">
                        {selectedDate
                          ? "No available time slots for the selected date"
                          : "Please select a date to see available time slots"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <FaNotesMedical className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
            </div>
            <div className="px-6 py-4">
              <div>
                <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  id="reasonForVisit"
                  name="reasonForVisit"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Please describe your symptoms or reason for the appointment"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !selectedDoctor || !selectedDate || !selectedTimeSlot || !reasonForVisit.trim()}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting || !selectedDoctor || !selectedDate || !selectedTimeSlot || !reasonForVisit.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;

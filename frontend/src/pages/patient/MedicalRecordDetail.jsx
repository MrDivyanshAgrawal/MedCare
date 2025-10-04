import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { 
  FaFileMedical, 
  FaUserMd, 
  FaCalendarAlt, 
  FaNotesMedical, 
  FaPills, 
  FaFlask, 
  FaFileDownload, 
  FaArrowLeft,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaThermometerHalf,
  FaLungs,
  FaTint,
  FaStethoscope,
  FaPaperclip,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        const response = await api.get(`/medical-records/${id}`);
        setMedicalRecord(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medical record:', err);
        setError('Failed to load medical record. Please try again.');
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !medicalRecord) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-700">
                {error || 'Medical record not found.'}
              </p>
              <button 
                onClick={() => navigate(-1)} 
                className="mt-2 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
              >
                <FaArrowLeft className="mr-1 h-3 w-3" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Helper function to get vital sign icon and color
  const getVitalSignIcon = (type) => {
    const icons = {
      bloodPressure: { icon: FaHeartbeat, color: 'text-red-600', bg: 'bg-red-100' },
      heartRate: { icon: FaHeartbeat, color: 'text-pink-600', bg: 'bg-pink-100' },
      temperature: { icon: FaThermometerHalf, color: 'text-orange-600', bg: 'bg-orange-100' },
      respiratoryRate: { icon: FaLungs, color: 'text-blue-600', bg: 'bg-blue-100' },
      oxygenSaturation: { icon: FaTint, color: 'text-cyan-600', bg: 'bg-cyan-100' },
      weight: { icon: FaWeight, color: 'text-purple-600', bg: 'bg-purple-100' },
      height: { icon: FaRulerVertical, color: 'text-green-600', bg: 'bg-green-100' },
      bmi: { icon: FaWeight, color: 'text-indigo-600', bg: 'bg-indigo-100' }
    };
    return icons[type] || { icon: FaHeartbeat, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Medical Records
          </button>
          {medicalRecord.appointment && (
            <Link
              to={`/patient/appointments/${medicalRecord.appointment._id}`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FaCalendarAlt className="mr-2 h-4 w-4" />
              View Appointment
            </Link>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaFileMedical className="mr-3 h-8 w-8" />
                  {medicalRecord.diagnosis}
                </h1>
                <div className="flex items-center space-x-4 text-green-100">
                  <span className="flex items-center">
                    <FaClock className="mr-1 h-4 w-4" />
                    {new Date(medicalRecord.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center">
                    <FaCheckCircle className="mr-1 h-4 w-4" />
                    Verified Record
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Doctor Information */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={medicalRecord.doctor.user.profilePicture || `https://ui-avatars.com/api/?name=${medicalRecord.doctor.user.name}&background=0891b2&color=fff`}
                alt={medicalRecord.doctor.user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {medicalRecord.doctor.user.name}
                </h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <FaStethoscope className="mr-2 h-4 w-4" />
                  {medicalRecord.doctor.specialization}
                </p>
                {medicalRecord.doctor.qualification && (
                  <p className="text-sm text-gray-600 mt-1">
                    {medicalRecord.doctor.qualification}
                  </p>
                )}
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <FaUserMd className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Diagnosis & Treatment */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <FaNotesMedical className="h-5 w-5 text-green-600" />
                    </div>
                    Diagnosis & Treatment
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Diagnosis:</h4>
                      <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                        {medicalRecord.diagnosis}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Treatment Plan:</h4>
                      <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                        {medicalRecord.treatment}
                      </p>
                    </div>
                    {medicalRecord.symptoms && medicalRecord.symptoms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Reported Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {medicalRecord.symptoms.map((symptom, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {medicalRecord.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Clinical Notes:</h4>
                        <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                          {medicalRecord.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <FaPills className="h-5 w-5 text-purple-600" />
                    </div>
                    Prescribed Medications
                  </h3>
                  {medicalRecord.medications && medicalRecord.medications.length > 0 ? (
                    <div className="space-y-3">
                      {medicalRecord.medications.map((medication, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <h4 className="font-semibold text-gray-900 text-lg">{medication.name}</h4>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-1">Dosage:</span>
                              <span className="text-gray-900">{medication.dosage}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-1">Frequency:</span>
                              <span className="text-gray-900">{medication.frequency}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-1">Duration:</span>
                              <span className="text-gray-900">{medication.duration}</span>
                            </div>
                          </div>
                          {medication.notes && (
                            <p className="mt-2 text-sm text-gray-600 bg-purple-50 p-2 rounded">
                              {medication.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                      <FaPills className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-3 text-gray-500">No medications prescribed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            {medicalRecord.vitalSigns && Object.keys(medicalRecord.vitalSigns).some(key => medicalRecord.vitalSigns[key]) && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FaHeartbeat className="h-5 w-5 text-blue-600" />
                  </div>
                  Vital Signs Recorded
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(medicalRecord.vitalSigns).map(([key, value]) => {
                    if (!value) return null;
                    const { icon: Icon, color, bg } = getVitalSignIcon(key);
                    const labels = {
                      bloodPressure: 'Blood Pressure',
                      heartRate: 'Heart Rate',
                      temperature: 'Temperature',
                      respiratoryRate: 'Respiratory Rate',
                      oxygenSaturation: 'Oxygen Saturation',
                      weight: 'Weight',
                      height: 'Height',
                      bmi: 'BMI'
                    };
                    const units = {
                      heartRate: 'bpm',
                      temperature: '°C',
                      respiratoryRate: '/min',
                      oxygenSaturation: '%',
                      weight: 'kg',
                      height: 'cm'
                    };

                    return (
                      <div key={key} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700">{labels[key]}</p>
                          <div className={`p-2 rounded-lg ${bg}`}>
                            <Icon className={`h-4 w-4 ${color}`} />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {value}{units[key] ? ` ${units[key]}` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lab Results */}
            {medicalRecord.labResults && medicalRecord.labResults.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <FaFlask className="h-5 w-5 text-purple-600" />
                  </div>
                  Laboratory Test Results
                </h3>
                <div className="space-y-4">
                  {medicalRecord.labResults.map((labResult, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{labResult.test}</h4>
                          <p className="mt-2 text-gray-700">
                            <span className="font-medium">Result:</span> 
                            <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {labResult.result}
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            <FaClock className="inline mr-1 h-3 w-3" />
                            {new Date(labResult.date).toLocaleDateString()}
                          </p>
                          {labResult.notes && (
                            <p className="mt-2 text-sm text-gray-600 bg-purple-50 p-2 rounded">
                              {labResult.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {labResult.attachments && labResult.attachments.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {labResult.attachments.map((attachment, attachIdx) => (
                              <a
                                key={attachIdx}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors duration-150"
                              >
                                <FaFileDownload className="mr-2 h-4 w-4" />
                                {attachment.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {medicalRecord.attachments && medicalRecord.attachments.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <div className="p-2 bg-gray-200 rounded-lg mr-3">
                    <FaPaperclip className="h-5 w-5 text-gray-600" />
                  </div>
                  Medical Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicalRecord.attachments.map((attachment, idx) => (
                    <a
                      key={idx}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                        <FaFileDownload className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {attachment.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordDetail;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { FaFileMedical, FaUserMd, FaCalendarAlt, FaNotesMedical, FaPills, FaFlask, FaFileDownload, FaArrowLeft } from 'react-icons/fa';

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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => navigate(-1)} 
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!medicalRecord) {
    return (
      <DashboardLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Medical record not found.</p>
              <button 
                onClick={() => navigate(-1)} 
                className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Medical Records
          </button>
          {medicalRecord.appointment && (
            <Link
              to={`/patient/appointments/${medicalRecord.appointment._id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaCalendarAlt className="mr-2 h-4 w-4" />
              View Appointment
            </Link>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-green-500 to-green-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{medicalRecord.diagnosis}</h1>
                <p className="mt-1 text-green-100">
                  {new Date(medicalRecord.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <FaFileMedical className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaUserMd className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Doctor Information
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> Dr. {medicalRecord.doctor.user.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Specialization:</span> {medicalRecord.doctor.specialization}
                  </p>
                  {medicalRecord.doctor.qualification && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Qualification:</span> {medicalRecord.doctor.qualification}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaNotesMedical className="mr-2 h-5 w-5 text-gray-500" />
                Diagnosis & Treatment
              </h3>
              <div className="mt-2">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Diagnosis:</h4>
                  <p className="mt-1 text-sm text-gray-900">{medicalRecord.diagnosis}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Treatment Plan:</h4>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{medicalRecord.treatment}</p>
                </div>
                {medicalRecord.symptoms && medicalRecord.symptoms.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Symptoms:</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {medicalRecord.symptoms.map((symptom, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {medicalRecord.notes && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Additional Notes:</h4>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{medicalRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaPills className="mr-2 h-5 w-5 text-gray-500" />
                Medications
              </h3>
              {medicalRecord.medications && medicalRecord.medications.length > 0 ? (
                <div className="mt-2 divide-y divide-gray-200">
                  {medicalRecord.medications.map((medication, idx) => (
                    <div key={idx} className={`py-2 ${idx === 0 ? '' : 'pt-3'}`}>
                    <h4 className="text-sm font-medium text-gray-900">{medication.name}</h4>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Dosage:</span> {medication.dosage}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span> {medication.frequency}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {medication.duration}
                    </p>
                    {medication.notes && (
                        <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {medication.notes}
                        </p>
                    )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500 italic">No medications prescribed</p>
              )}
            </div>
          </div>

          {medicalRecord.vitalSigns && Object.keys(medicalRecord.vitalSigns).some(key => medicalRecord.vitalSigns[key]) && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaFlask className="mr-2 h-5 w-5 text-gray-500" />
                Vital Signs
              </h3>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {medicalRecord.vitalSigns.bloodPressure && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Blood Pressure</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.bloodPressure}</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.heartRate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Heart Rate</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.heartRate} bpm</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.temperature && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Temperature</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.temperature} °C</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.respiratoryRate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Respiratory Rate</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.respiratoryRate} /min</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.oxygenSaturation && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Oxygen Saturation</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.oxygenSaturation}%</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.weight && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Weight</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.weight} kg</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.height && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Height</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.height} cm</p>
                  </div>
                )}
                {medicalRecord.vitalSigns.bmi && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">BMI</p>
                    <p className="text-sm text-gray-900">{medicalRecord.vitalSigns.bmi}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {medicalRecord.labResults && medicalRecord.labResults.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaFlask className="mr-2 h-5 w-5 text-gray-500" />
                Laboratory Results
              </h3>
              <div className="mt-2">
                {medicalRecord.labResults.map((labResult, idx) => (
                  <div key={idx} className={`${idx !== 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}`}>
                    <h4 className="text-sm font-medium text-gray-900">{labResult.test}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Result:</span> {labResult.result}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {new Date(labResult.date).toLocaleDateString()}
                    </p>
                    {labResult.notes && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {labResult.notes}
                      </p>
                    )}
                    {labResult.attachments && labResult.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Attachments:</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {labResult.attachments.map((attachment, attachIdx) => (
                            <a
                              key={attachIdx}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
                            >
                              {attachment.name}
                              <FaFileDownload className="ml-2 h-4 w-4" />
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

          {medicalRecord.attachments && medicalRecord.attachments.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicalRecord.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <FaFileDownload className="h-5 w-5 text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-900">{attachment.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordDetail;

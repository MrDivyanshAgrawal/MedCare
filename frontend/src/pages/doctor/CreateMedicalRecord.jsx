import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaFileMedical, FaPills, FaFlask, FaHeartbeat, FaFileUpload, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner, { LoadingButton } from '../../components/LoadingSpinner';
import useFormValidation from '../../hooks/useFormValidation';

const CreateMedicalRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);

  // Initial form state
  const initialForm = {
    diagnosis: '',
    symptoms: [],
    treatment: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
    labResults: [{ test: '', result: '', date: '', notes: '', attachments: [] }],
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: ''
    },
    notes: '',
    attachments: []
  };

  // Validation function
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.diagnosis.trim()) {
      errors.diagnosis = 'Diagnosis is required';
    }
    
    return errors;
  };

  // Form handling
  const {
    values: form,
    errors,
    touched,
    isSubmitting,
    handleChange: handleFormChange,
    handleBlur,
    handleSubmit: handleFormSubmit,
    setValues: setForm
  } = useFormValidation(
    initialForm,
    validateForm,
    submitForm
  );

  // New symptom state
  const [newSymptom, setNewSymptom] = useState('');
  
  // File upload state
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  
  // Lab result file upload state
  const [labDocumentFile, setLabDocumentFile] = useState(null);
  const [labDocumentName, setLabDocumentName] = useState('');
  const [activeLabIndex, setActiveLabIndex] = useState(0);

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      setAppointment(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError('Failed to load appointment. Please try again.');
      setLoading(false);
    }
  };

  // Custom handler for form with nested fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vitalSigns.')) {
      const vitalSignKey = name.split('.')[1];
      setForm({
        ...form,
        vitalSigns: {
          ...form.vitalSigns,
          [vitalSignKey]: value
        }
      });
    } else {
      handleFormChange(e);
    }
  };

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      setForm({
        ...form,
        symptoms: [...form.symptoms, newSymptom.trim()]
      });
      setNewSymptom('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setForm({
      ...form,
      symptoms: form.symptoms.filter((_, i) => i !== index)
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...form.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setForm({
      ...form,
      medications: updatedMedications
    });
  };

  const handleAddMedication = () => {
    setForm({
      ...form,
      medications: [
        ...form.medications, 
        { name: '', dosage: '', frequency: '', duration: '', notes: '' }
      ]
    });
  };

  const handleRemoveMedication = (index) => {
    setForm({
      ...form,
      medications: form.medications.filter((_, i) => i !== index)
    });
  };

  const handleLabResultChange = (index, field, value) => {
    const updatedLabResults = [...form.labResults];
    updatedLabResults[index] = {
      ...updatedLabResults[index],
      [field]: value
    };
    setForm({
      ...form,
      labResults: updatedLabResults
    });
  };

  const handleAddLabResult = () => {
    setForm({
      ...form,
      labResults: [
        ...form.labResults, 
        { test: '', result: '', date: '', notes: '', attachments: [] }
      ]
    });
    setActiveLabIndex(form.labResults.length);
  };

  const handleRemoveLabResult = (index) => {
    setForm({
      ...form,
      labResults: form.labResults.filter((_, i) => i !== index)
    });
    if (activeLabIndex >= index) {
      setActiveLabIndex(Math.max(0, activeLabIndex - 1));
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentName(file.name);
    }
  };

  const handleLabDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLabDocumentFile(file);
      setLabDocumentName(file.name);
    }
  };

  const uploadDocument = async (file, name) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        name: name || file.name,
        url: response.data.data.url
      };
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      return null;
    }
  };

  const handleAddDocument = async () => {
    if (!documentFile) {
      toast.error('Please select a document to upload');
      return;
    }

    const documentData = await uploadDocument(documentFile, documentName);
    if (documentData) {
      setForm({
        ...form,
        attachments: [...form.attachments, documentData]
      });
      setDocumentFile(null);
      setDocumentName('');
      toast.success('Document uploaded successfully');
    }
  };

  const handleAddLabDocument = async () => {
    if (!labDocumentFile) {
      toast.error('Please select a document to upload');
      return;
    }

    const documentData = await uploadDocument(labDocumentFile, labDocumentName);
    if (documentData) {
      const updatedLabResults = [...form.labResults];
      updatedLabResults[activeLabIndex] = {
        ...updatedLabResults[activeLabIndex],
        attachments: [...(updatedLabResults[activeLabIndex].attachments || []), documentData]
      };
      setForm({
        ...form,
        labResults: updatedLabResults
      });
      setLabDocumentFile(null);
      setLabDocumentName('');
      toast.success('Lab document uploaded successfully');
    }
  };

  const handleRemoveDocument = (index) => {
    setForm({
      ...form,
      attachments: form.attachments.filter((_, i) => i !== index)
    });
  };

  const handleRemoveLabDocument = (labIndex, docIndex) => {
    const updatedLabResults = [...form.labResults];
    updatedLabResults[labIndex].attachments = updatedLabResults[labIndex].attachments.filter((_, i) => i !== docIndex);
    setForm({
      ...form,
      labResults: updatedLabResults
    });
  };

  // Calculate BMI when height and weight change
  useEffect(() => {
    const { height, weight } = form.vitalSigns;
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setForm({
          ...form,
          vitalSigns: {
            ...form.vitalSigns,
            bmi
          }
        });
      }
    }
  }, [form.vitalSigns.height, form.vitalSigns.weight]);

  async function submitForm(values) {
    setSubmitting(true);
    
    try {
      // Prepare the data
      const medicalRecordData = {
        patientId: appointment.patient._id,
        appointmentId: appointment._id,
        ...values
      };
      
      // Remove any empty medications
      medicalRecordData.medications = medicalRecordData.medications.filter(med => med.name.trim());
      
      // Remove any empty lab results
      medicalRecordData.labResults = medicalRecordData.labResults.filter(lab => lab.test.trim());

      // Submit the medical record
      const response = await api.post('/medical-records', medicalRecordData);
      
      toast.success('Medical record created successfully');
      
      // Navigate back to the appointment page or to the new medical record
      navigate(`/doctor/medical-records/${response.data._id}`);
    } catch (err) {
      console.error('Error creating medical record:', err);
      toast.error(err.response?.data?.message || 'Failed to create medical record');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="large" />
      </DashboardLayout>
    );
  }

  if (!appointment) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Appointment not found</p>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-green-500 to-green-700 text-white">
            <h1 className="text-2xl font-bold">Create Medical Record</h1>
            <p className="mt-1 text-green-100">
              For {appointment.patient.user.name}'s appointment on {new Date(appointment.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
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

        {/* Patient information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FaUser className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">{appointment.patient.user.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.patient.dateOfBirth ? new Date(appointment.patient.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {appointment.patient.gender || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Diagnosis & Treatment */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaFileMedical className="h-5 w-5 text-gray-400 mr-2" />
              Diagnosis & Treatment
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                  Diagnosis *
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md ${
                    touched.diagnosis && errors.diagnosis ? 'border-red-500' : ''
                  }`}
                  placeholder="Primary diagnosis"
                />
                {touched.diagnosis && errors.diagnosis && (
                  <p className="mt-1 text-sm text-red-500">{errors.diagnosis}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symptoms
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    placeholder="Add a symptom"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.symptoms.map((symptom, idx) => (
                    <div key={idx} className="inline-flex items-center bg-blue-50 px-2.5 py-0.5 rounded-full text-xs font-medium text-blue-700">
                      {symptom}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(idx)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {form.symptoms.length === 0 && (
                    <span className="text-sm text-gray-500">No symptoms added yet</span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
                  Treatment Plan
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  rows={3}
                  value={form.treatment}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="Treatment plan and recommendations"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaPills className="h-5 w-5 text-gray-400 mr-2" />
              Medications
            </h2>
            <div className="space-y-4">
              {form.medications.map((medication, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium">Medication {idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosage</label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Frequency</label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                        placeholder="e.g., 3 times daily"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={medication.notes}
                        onChange={(e) => handleMedicationChange(idx, 'notes', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                        placeholder="Additional instructions or notes"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMedication}
                className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + Add Another Medication
              </button>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaHeartbeat className="h-5 w-5 text-gray-400 mr-2" />
              Vital Signs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  name="vitalSigns.bloodPressure"
                  value={form.vitalSigns.bloodPressure}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="e.g., 120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="vitalSigns.heartRate"
                  value={form.vitalSigns.heartRate}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="vitalSigns.temperature"
                  value={form.vitalSigns.temperature}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Respiratory Rate (/min)</label>
                <input
                  type="number"
                  name="vitalSigns.respiratoryRate"
                  value={form.vitalSigns.respiratoryRate}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Oxygen Saturation (%)</label>
                <input
                  type="number"
                  name="vitalSigns.oxygenSaturation"
                  value={form.vitalSigns.oxygenSaturation}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="vitalSigns.weight"
                  value={form.vitalSigns.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  name="vitalSigns.height"
                  value={form.vitalSigns.height}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">BMI</label>
                <input
                  type="number"
                  step="0.1"
                  name="vitalSigns.bmi"
                  value={form.vitalSigns.bmi}
                  readOnly
                  className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Lab Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaFlask className="h-5 w-5 text-gray-400 mr-2" />
              Laboratory Results
            </h2>
            
            {/* Tabs for lab results */}
            <div className="mb-4 border-b border-gray-200">
              <nav className="flex flex-wrap -mb-px">
                {form.labResults.map((lab, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                      activeLabIndex === idx
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveLabIndex(idx)}
                  >
                    {lab.test ? lab.test : `Lab Test ${idx + 1}`}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-block py-2 px-4 border-b-2 border-transparent text-gray-500 hover:border-gray-300 font-medium text-sm"
                  onClick={handleAddLabResult}
                >
                  + Add New
                </button>
              </nav>
            </div>
            
            {/* Active lab result form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Test Name</label>
                  <input
                    type="text"
                    value={form.labResults[activeLabIndex].test}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'test', e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    placeholder="e.g., Complete Blood Count"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Result</label>
                  <input
                    type="text"
                    value={form.labResults[activeLabIndex].result}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'result', e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={form.labResults[activeLabIndex].date}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'date', e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <input
                    type="text"
                    value={form.labResults[activeLabIndex].notes}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'notes', e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Lab attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.labResults[activeLabIndex].attachments && form.labResults[activeLabIndex].attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center bg-blue-50 px-3 py-2 rounded-md">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        {attachment.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveLabDocument(activeLabIndex, idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={labDocumentName}
                      onChange={(e) => setLabDocumentName(e.target.value)}
                      placeholder="Document name (optional)"
                      className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FaFileUpload className="mr-2 h-5 w-5 text-gray-400" />
                      {labDocumentFile ? labDocumentFile.name.substring(0, 20) + '...' : 'Choose File'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleLabDocumentChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddLabDocument}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove lab result button */}
              {form.labResults.length > 1 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveLabResult(activeLabIndex)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove This Lab Test
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes and Attachments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Notes & Attachments</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                                    placeholder="Any additional notes or observations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center bg-blue-50 px-3 py-2 rounded-md">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        {attachment.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Document name (optional)"
                      className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FaFileUpload className="mr-2 h-5 w-5 text-gray-400" />
                      {documentFile ? documentFile.name.substring(0, 20) + '...' : 'Choose File'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              isLoading={submitting || isSubmitting}
              disabled={submitting || isSubmitting}
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Medical Record
            </LoadingButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateMedicalRecord;

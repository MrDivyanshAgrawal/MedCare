import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaFileMedical, 
  FaPills, 
  FaFlask, 
  FaHeartbeat, 
  FaFileUpload, 
  FaArrowLeft,
  FaNotesMedical,
  FaPlus,
  FaTimes,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaThermometerHalf,
  FaLungs,
  FaTint,
  FaStethoscope,
  FaVenusMars,
  FaBirthdayCake,
  FaPaperclip
} from 'react-icons/fa';

const CreateMedicalRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);

  // Form state
  const [form, setForm] = useState({
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
  });

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

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
      setForm({
        ...form,
        [name]: value
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare the data
      const medicalRecordData = {
        patientId: appointment.patient._id,
        appointmentId: appointment._id,
        ...form
      };
      
      // Remove any empty medications
      medicalRecordData.medications = medicalRecordData.medications.filter(med => med.name.trim());
      
      // Remove any empty lab results
      medicalRecordData.labResults = medicalRecordData.labResults.filter(lab => lab.test.trim());

      // Submit the medical record
      const response = await api.post('/medical-records', medicalRecordData);
      
      toast.success('Medical record created successfully');
      
      // Navigate to the new medical record
      navigate(`/doctor/medical-records/${response.data._id}`);
    } catch (err) {
      console.error('Error creating medical record:', err);
      toast.error(err.response?.data?.message || 'Failed to create medical record');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!appointment) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
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
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaFileMedical className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Create Medical Record</h1>
                <p className="text-green-100 text-lg mt-1">
                  For {appointment.patient.user.name}'s appointment on {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Patient information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FaUser className="h-5 w-5 text-blue-600" />
            </div>
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaUser className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{appointment.patient.user.name}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaBirthdayCake className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.patient.dateOfBirth 
                      ? `${calculateAge(appointment.patient.dateOfBirth)} years`
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaVenusMars className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {appointment.patient.gender || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Diagnosis & Treatment */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FaFileMedical className="h-5 w-5 text-green-600" />
              </div>
              Diagnosis & Treatment
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter primary diagnosis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSymptom();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add a symptom"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <FaPlus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.symptoms.map((symptom, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {symptom}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(idx)}
                        className="ml-2 hover:text-yellow-600"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {form.symptoms.length === 0 && (
                    <span className="text-sm text-gray-500 italic">No symptoms added yet</span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Plan
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  rows={4}
                  value={form.treatment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter treatment plan and recommendations..."
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FaPills className="h-5 w-5 text-purple-600" />
              </div>
              Medications
            </h2>
            <div className="space-y-4">
              {form.medications.map((medication, idx) => (
                <div key={idx} className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold text-gray-900">Medication {idx + 1}</h3>
                    {form.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(idx)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Medication name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 3 times daily"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                      <textarea
                        value={medication.notes}
                        onChange={(e) => handleMedicationChange(idx, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Any special instructions..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMedication}
                className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors duration-200"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Another Medication
              </button>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <FaHeartbeat className="h-5 w-5 text-red-600" />
              </div>
              Vital Signs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaHeartbeat className="mr-1 h-4 w-4 text-gray-400" />
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  name="vitalSigns.bloodPressure"
                  value={form.vitalSigns.bloodPressure}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaHeartbeat className="mr-1 h-4 w-4 text-gray-400" />
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="vitalSigns.heartRate"
                  value={form.vitalSigns.heartRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaThermometerHalf className="mr-1 h-4 w-4 text-gray-400" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="vitalSigns.temperature"
                  value={form.vitalSigns.temperature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 37.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLungs className="mr-1 h-4 w-4 text-gray-400" />
                  Respiratory Rate (/min)
                </label>
                <input
                  type="number"
                  name="vitalSigns.respiratoryRate"
                  value={form.vitalSigns.respiratoryRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaTint className="mr-1 h-4 w-4 text-gray-400" />
                  Oxygen Saturation (%)
                </label>
                <input
                  type="number"
                  name="vitalSigns.oxygenSaturation"
                  value={form.vitalSigns.oxygenSaturation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 98"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaWeight className="mr-1 h-4 w-4 text-gray-400" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="vitalSigns.weight"
                  value={form.vitalSigns.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 70.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaRulerVertical className="mr-1 h-4 w-4 text-gray-400" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="vitalSigns.height"
                  value={form.vitalSigns.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaWeight className="mr-1 h-4 w-4 text-gray-400" />
                  BMI
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="vitalSigns.bmi"
                  value={form.vitalSigns.bmi}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                  placeholder="Auto-calculated"
                />
              </div>
            </div>
          </div>

          {/* Lab Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FaFlask className="h-5 w-5 text-blue-600" />
              </div>
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
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveLabIndex(idx)}
                  >
                    {lab.test ? lab.test : `Lab Test ${idx + 1}`}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-block py-2 px-4 border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-medium text-sm"
                  onClick={handleAddLabResult}
                >
                  <FaPlus className="inline h-3 w-3 mr-1" />
                  Add New
                </button>
              </nav>
            </div>
            
            {/* Active lab result form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                  <input
                    type="text"
                    value={form.labResults[activeLabIndex].test}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'test', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Complete Blood Count"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                  <input
                    type="text"
                    value={form.labResults[activeLabIndex].result}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'result', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Test results"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.labResults[activeLabIndex].date}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={form.labResults[activeLabIndex].notes}
                    onChange={(e) => handleLabResultChange(activeLabIndex, 'notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              {/* Lab attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Documents</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.labResults[activeLabIndex].attachments && form.labResults[activeLabIndex].attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                      <FaPaperclip className="h-4 w-4 text-blue-600 mr-2" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {attachment.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveLabDocument(activeLabIndex, idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="h-3 w-3" />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200">
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
                  <button
                    type="button"
                    onClick={handleAddLabDocument}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Remove lab result button */}
              {form.labResults.length > 1 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveLabResult(activeLabIndex)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove This Lab Test
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes and Attachments */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <FaNotesMedical className="h-5 w-5 text-gray-600" />
              </div>
              Additional Notes & Documents
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="Any additional notes or observations..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Documents</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                      <FaPaperclip className="h-4 w-4 text-gray-600 mr-2" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        {attachment.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="h-3 w-3" />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200">
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
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaFileMedical className="mr-3 h-5 w-5" />
                  Create Medical Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateMedicalRecord;


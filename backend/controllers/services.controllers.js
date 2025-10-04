import asyncHandler from '../middleware/async.middleware.js';

// Indian healthcare services
const ALL_SERVICES = [
  { id: 'cardiology', name: 'Cardiology', featured: true, description: 'Heart care and cardiovascular treatments' },
  { id: 'pediatrics', name: 'Pediatrics', featured: true, description: 'Child healthcare and development' },
  { id: 'orthopedics', name: 'Orthopedics', featured: true, description: 'Bone and joint treatments' },
  { id: 'gynecology', name: 'Gynecology', featured: true, description: 'Women\'s health and reproductive care' },
  { id: 'neurology', name: 'Neurology', featured: true, description: 'Brain and nervous system disorders' },
  { id: 'dermatology', name: 'Dermatology', featured: true, description: 'Skin, hair, and nail treatments' },
  { id: 'emergency', name: 'Emergency Care', featured: true, description: '24/7 emergency medical services' },
  { id: 'general', name: 'General Medicine', featured: true, description: 'Primary healthcare services' },
  { id: 'oncology', name: 'Oncology', featured: false, description: 'Cancer treatment and care' },
  { id: 'psychiatry', name: 'Psychiatry', featured: false, description: 'Mental health and behavioral disorders' },
  { id: 'ophthalmology', name: 'Ophthalmology', featured: false, description: 'Eye care and vision treatments' },
  { id: 'ent', name: 'ENT', featured: false, description: 'Ear, nose, and throat treatments' }
];

export const getServices = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  let result = ALL_SERVICES;
  if (featured === 'true') {
    result = ALL_SERVICES.filter(s => s.featured);
  }
  res.json(result);
});

export const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = ALL_SERVICES.find(s => s.id === id);
  
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  
  res.json(service);
});



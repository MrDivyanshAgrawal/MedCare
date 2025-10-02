import Invoice from '../models/invoice.models.js';
import Patient from '../models/patient.models.js';
import Doctor from '../models/doctor.models.js';
import Appointment from '../models/appointment.models.js';
import asyncHandler from '../middleware/async.middleware.js';
import { createAuditLog } from '../middleware/auditLog.middleware.js';
import Stripe from 'stripe';
import { sendEmail } from '../utils/sendEmail.utils.js';
import User from '../models/user.models.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper to generate invoice number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Count existing invoices for this month to create sequential numbering
  const count = await Invoice.countDocuments();
  const sequence = (count + 1).toString().padStart(4, '0');
  
  return `INV-${year}${month}-${sequence}`;
};

// @desc    Create new invoice
// @route   POST /api/billing
// @access  Private (Admin)
export const createInvoice = asyncHandler(async (req, res) => {
  const {
    patientId,
    doctorId,
    appointmentId,
    items,
    subtotal,
    tax,
    discount,
    total,
    dueDate,
    notes
  } = req.body;

  // Verify patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber();
  
  // Create invoice
  const invoice = await Invoice.create({
    patient: patientId,
    doctor: doctorId,
    appointment: appointmentId,
    items,
    subtotal,
    tax: tax || 0,
    discount: discount || 0,
    total,
    paymentStatus: 'pending',
    dueDate,
    notes,
    invoiceNumber
  });

  // If associated with appointment, update appointment payment status
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: 'pending' });
  }

  // Create audit log
  await createAuditLog(
    req,
    'create',
    'invoice',
    invoice._id,
    { 
      invoiceId: invoice._id, 
      patientId, 
      total 
    }
  );

  // Send invoice notification to patient
  try {
    const patientUser = await User.findById(patient.user);
    if (patientUser && patientUser.email) {
      await sendEmail({
        email: patientUser.email,
        subject: `New Invoice #${invoiceNumber}`,
        message: `Dear ${patientUser.name},\n\nA new invoice has been created for you. Invoice #: ${invoiceNumber}, Amount: $${total.toFixed(2)}. Please log in to your account to view the details and make a payment.\n\nThank you for choosing our services.`
      });
    }
  } catch (error) {
    console.error('Error sending invoice notification:', error);
  }

  res.status(201).json(invoice);
});

// @desc    Get all invoices
// @route   GET /api/billing
// @access  Private
export const getInvoices = asyncHandler(async (req, res) => {
  let invoices;

  // Filter invoices based on user role
  if (req.user.role === 'admin') {
    // Admin can see all invoices
    invoices = await Invoice.find()
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      })
      .populate('appointment');
  } else if (req.user.role === 'doctor') {
    // Doctors can only see invoices for their appointments
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    invoices = await Invoice.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      })
      .populate('appointment');
  } else if (req.user.role === 'patient') {
    // Patients can only see their own invoices
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    invoices = await Invoice.find({ patient: patient._id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      })
      .populate('appointment');
  } else {
    return res.status(403).json({ message: 'Not authorized to view invoices' });
  }

  res.json(invoices);
});

// @desc    Get invoice by ID
// @route   GET /api/billing/:id
// @access  Private
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone' }
    })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    })
    .populate('appointment');

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // Check permissions
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || patient._id.toString() !== invoice.patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || (invoice.doctor && doctor._id.toString() !== invoice.doctor.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view invoices' });
  }

  res.json(invoice);
});

// @desc    Update invoice
// @route   PUT /api/billing/:id
// @access  Private (Admin)
export const updateInvoice = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can update invoices' });
  }

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // Update fields
  const {
    items,
    subtotal,
    tax,
    discount,
    total,
    paymentStatus,
    paymentMethod,
    paymentDate,
    dueDate,
    notes
  } = req.body;

  if (items) invoice.items = items;
  if (subtotal) invoice.subtotal = subtotal;
  if (tax !== undefined) invoice.tax = tax;
  if (discount !== undefined) invoice.discount = discount;
  if (total) invoice.total = total;
  if (paymentStatus) invoice.paymentStatus = paymentStatus;
  if (paymentMethod) invoice.paymentMethod = paymentMethod;
  if (paymentDate) invoice.paymentDate = paymentDate;
  if (dueDate) invoice.dueDate = dueDate;
  if (notes !== undefined) invoice.notes = notes;

  const updatedInvoice = await invoice.save();

  // If payment status changed, update associated appointment
  if (paymentStatus && invoice.appointment) {
    await Appointment.findByIdAndUpdate(invoice.appointment, { 
      paymentStatus: paymentStatus === 'paid' ? 'completed' : paymentStatus 
    });
  }

  // Create audit log
  await createAuditLog(
    req,
    'update',
    'invoice',
    invoice._id,
    { 
      invoiceId: invoice._id,
      fields: Object.keys(req.body)
    }
  );

  // Send notification if payment status changed to 'paid'
  if (paymentStatus === 'paid' && invoice.paymentStatus !== 'paid') {
    try {
      const patientUser = await User.findById((await Patient.findById(invoice.patient)).user);
      
      if (patientUser && patientUser.email) {
        await sendEmail({
          email: patientUser.email,
          subject: `Payment Confirmation - Invoice #${invoice.invoiceNumber}`,
          message: `Dear ${patientUser.name},\n\nThank you for your payment. Your invoice #${invoice.invoiceNumber} has been marked as paid.\n\nThank you for choosing our services.`
        });
      }
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
    }
  }

  res.json(updatedInvoice);
});

// @desc    Delete invoice
// @route   DELETE /api/billing/:id
// @access  Private (Admin)
export const deleteInvoice = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete invoices' });
  }

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // If associated with appointment, update appointment payment status to pending
  if (invoice.appointment) {
    await Appointment.findByIdAndUpdate(invoice.appointment, { paymentStatus: 'pending' });
  }

  await invoice.deleteOne();

  // Create audit log
  await createAuditLog(
    req,
    'delete',
    'invoice',
    req.params.id,
    { invoiceId: req.params.id }
  );

  res.json({ message: 'Invoice removed' });
});

// @desc    Process payment for an invoice
// @route   POST /api/billing/:id/pay
// @access  Private
export const processPayment = asyncHandler(async (req, res) => {
  const { paymentMethodId } = req.body;
  
  const invoice = await Invoice.findById(req.params.id)
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email' }
    });

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // Check permissions - only patient who owns the invoice or admin can pay
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || patient._id.toString() !== invoice.patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay this invoice' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to process payments' });
  }

  // Check if already paid
  if (invoice.paymentStatus === 'paid') {
    return res.status(400).json({ message: 'This invoice has already been paid' });
  }

  try {
    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoice.total * 100), // Stripe expects amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Invoice #${invoice.invoiceNumber} payment`,
      metadata: {
        invoiceId: invoice._id.toString(),
        patientId: invoice.patient._id.toString()
      }
    });

    // Update invoice status
    invoice.paymentStatus = 'paid';
    invoice.paymentMethod = 'credit_card';
    invoice.paymentDate = new Date();
    
    await invoice.save();

    // If associated with appointment, update appointment payment status
    if (invoice.appointment) {
      await Appointment.findByIdAndUpdate(invoice.appointment, { paymentStatus: 'completed' });
    }

    // Create audit log
    await createAuditLog(
      req,
      'payment',
      'invoice',
      invoice._id,
      { 
        invoiceId: invoice._id,
        amount: invoice.total,
        paymentIntentId: paymentIntent.id
      }
    );

    // Send payment confirmation email
    try {
      await sendEmail({
        email: invoice.patient.user.email,
        subject: `Payment Confirmation - Invoice #${invoice.invoiceNumber}`,
        message: `Dear ${invoice.patient.user.name},\n\nThank you for your payment of $${invoice.total.toFixed(2)}. Your invoice #${invoice.invoiceNumber} has been marked as paid.\n\nThank you for choosing our services.`
      });
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
    }

    res.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      invoice: invoice
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Payment processing failed'
    });
  }
});

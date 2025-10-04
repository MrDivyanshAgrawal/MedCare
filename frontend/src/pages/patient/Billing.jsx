import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaFileInvoiceDollar, 
  FaRegCreditCard, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSearch, 
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaRupeeSign,
  FaClock
} from 'react-icons/fa';

// Import Stripe components
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe('pk_test_51S6acTELX7EgUQu06vmtEDFSrXxDIoqNu5efNymlGIvPSz8JisMVU1euo947lABJNNsjAK908mz9ZAFarjDTZThN00IV9Ew8WN');

// Payment Form Component
const PaymentForm = ({ invoice, onPaymentSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create a payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Process payment with your API
      const response = await api.post(`/billing/${invoice._id}/pay`, {
        paymentMethodId: paymentMethod.id,
      });

      if (response.data.success) {
        toast.success('Payment processed successfully!');
        onPaymentSuccess(invoice._id);
        onClose();
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Complete Your Payment</h3>
        <p className="text-gray-600 mt-1">Total Amount: ₹{invoice.total.toFixed(2)}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className={`px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 ${
              (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {processing ? 'Processing...' : `Pay ₹${invoice.total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/billing');
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (invoiceId) => {
    // Update the invoice in state
    setInvoices(invoices.map(invoice => 
      invoice._id === invoiceId 
        ? { ...invoice, paymentStatus: 'paid', paymentDate: new Date().toISOString() } 
        : invoice
    ));
    
    // Close the payment form
    setPayingInvoiceId(null);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.notes && invoice.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Sort invoices by due date (most recent first)
  const sortedInvoices = [...filteredInvoices].sort((a, b) => 
    new Date(b.dueDate) - new Date(a.dueDate)
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: <FaClock className="mr-1 h-3 w-3" /> 
      },
      paid: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: <FaCheckCircle className="mr-1 h-3 w-3" /> 
      },
      overdue: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: <FaTimesCircle className="mr-1 h-3 w-3" /> 
      },
      cancelled: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        icon: <FaTimesCircle className="mr-1 h-3 w-3" /> 
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.icon}
        {status === 'paid' ? 'Paid' : 
         status === 'pending' ? 'Pending' : 
         status === 'overdue' ? 'Overdue' : 'Cancelled'}
      </span>
    );
  };

  const isInvoiceOverdue = (invoice) => {
    return invoice.paymentStatus === 'pending' && new Date(invoice.dueDate) < new Date();
  };

  // Calculate totals
  const totalPending = invoices.filter(i => i.paymentStatus === 'pending').reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.filter(i => i.paymentStatus === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = invoices.filter(i => isInvoiceOverdue(i)).reduce((sum, i) => sum + i.total, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Billing & Invoices</h1>
            <p className="text-yellow-100 text-lg">
              Manage your medical bills and payment history
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

        {/* Billing summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                  <FaRupeeSign className="h-5 w-5" />
                  {totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {invoices.filter(i => i.paymentStatus === 'paid').length} invoices
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                  <FaRupeeSign className="h-5 w-5" />
                  {totalPending.toFixed(2)}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {invoices.filter(i => i.paymentStatus === 'pending' && !isInvoiceOverdue(i)).length} invoices
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                  <FaRupeeSign className="h-5 w-5" />
                  {totalOverdue.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <FaTimesCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {invoices.filter(i => isInvoiceOverdue(i)).length} invoices
            </p>
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by invoice number or notes"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Invoices</option>
                  <option value="pending">Pending Payment</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices list */}
        {sortedInvoices.length > 0 ? (
          <div className="space-y-4">
            {sortedInvoices.map((invoice) => (
              <div 
                key={invoice._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${
                        invoice.paymentStatus === 'paid' ? 'bg-green-100' : 
                        isInvoiceOverdue(invoice) ? 'bg-red-100' : 
                        'bg-yellow-100'
                      }`}>
                        <FaFileInvoiceDollar className={`h-6 w-6 ${
                          invoice.paymentStatus === 'paid' ? 'text-green-600' : 
                          isInvoiceOverdue(invoice) ? 'text-red-600' : 
                          'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Invoice #{invoice.invoiceNumber}
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaCalendarAlt className="mr-2 h-4 w-4 text-gray-400" />
                            <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-900 font-semibold">
                            <FaRupeeSign className="mr-1 h-4 w-4" />
                            <span>{invoice.total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {invoice.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            {invoice.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                      {getStatusBadge(isInvoiceOverdue(invoice) ? 'overdue' : invoice.paymentStatus)}
                      
                      <div className="flex space-x-2">
                        {invoice.paymentStatus === 'pending' && (
                          <button
                            onClick={() => setPayingInvoiceId(invoice._id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
                          >
                            <FaRegCreditCard className="mr-2 h-4 w-4" />
                            Pay Now
                          </button>
                        )}
                        
                        <button
                          onClick={() => window.open(`/api/billing/${invoice._id}/download`, '_blank')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FaEye className="mr-2 h-4 w-4" />
                          View
                        </button>
                        
                        <button
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FaDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Show item breakdown for expanded view */}
                  {invoice.items && invoice.items.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {invoice.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-2 text-sm text-gray-900">{item.description}</td>
                                <td className="py-2 text-sm text-right text-gray-600">{item.quantity}</td>
                                <td className="py-2 text-sm text-right text-gray-600">₹{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 text-sm text-right font-medium text-gray-900">₹{item.amount.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Payment form modal */}
                  {payingInvoiceId === invoice._id && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <Elements stripe={stripePromise}>
                          <PaymentForm 
                            invoice={invoice} 
                            onPaymentSuccess={handlePaymentSuccess}
                            onClose={() => setPayingInvoiceId(null)}
                          />
                        </Elements>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaFileInvoiceDollar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">
              {statusFilter !== 'all' 
                ? `No invoices with status "${statusFilter}" found.` 
                : 'You don\'t have any invoices yet.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Billing;

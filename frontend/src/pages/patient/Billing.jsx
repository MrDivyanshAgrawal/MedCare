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
  FaCalendarAlt
} from 'react-icons/fa';

// Import Stripe components
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe('your_stripe_public_key');

// Payment Form Component
const PaymentForm = ({ invoice, onPaymentSuccess }) => {
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="border border-gray-300 rounded-md p-4">
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
        <div className="text-sm text-red-600">{error}</div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none ${
            (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {processing ? 'Processing...' : `Pay $${invoice.total.toFixed(2)}`}
        </button>
      </div>
    </form>
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
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'paid' ? 'Paid' : 
         status === 'pending' ? 'Pending' : 
         status === 'overdue' ? 'Overdue' : 'Cancelled'}
      </span>
    );
  };

  const isInvoiceOverdue = (invoice) => {
    return invoice.paymentStatus === 'pending' && new Date(invoice.dueDate) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white">
            <h1 className="text-2xl font-bold">Billing & Invoices</h1>
            <p className="mt-1 text-yellow-100">
              View and pay your medical bills
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

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by invoice number or notes"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
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

        {/* Billing summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => i.paymentStatus === 'paid').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => i.paymentStatus === 'pending' && !isInvoiceOverdue(i)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <FaTimesCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(i => isInvoiceOverdue(i)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices list */}
        {sortedInvoices.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {sortedInvoices.map((invoice) => (
                <li key={invoice._id}>
                  <div className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-full ${
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
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Invoice #{invoice.invoiceNumber}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                            <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Total: ${invoice.total.toFixed(2)}
                            </span>
                            <span className="mx-2">•</span>
                            {getStatusBadge(
                              isInvoiceOverdue(invoice) ? 'overdue' : invoice.paymentStatus
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        {invoice.paymentStatus === 'pending' && (
                          <button
                            onClick={() => setPayingInvoiceId(invoice._id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            <FaRegCreditCard className="mr-2 h-4 w-4" />
                            Pay Now
                          </button>
                        )}
                        
                        <button
                          onClick={() => window.open(`/api/billing/${invoice._id}/download`, '_blank')}
                          className="inline-flex items-center ml-2 px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    {invoice.items.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Items:</h4>
                        <div className="mt-2 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {invoice.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="px-6 py-2 text-sm text-gray-900">{item.description}</td>
                                  <td className="px-6 py-2 text-sm text-right text-gray-500">{item.quantity}</td>
                                  <td className="px-6 py-2 text-sm text-right text-gray-500">${item.unitPrice.toFixed(2)}</td>
                                  <td className="px-6 py-2 text-sm text-right text-gray-900">${item.amount.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td colSpan="3" className="px-6 py-2 text-sm text-right font-medium text-gray-700">Subtotal:</td>
                                <td className="px-6 py-2 text-sm text-right text-gray-900">${invoice.subtotal.toFixed(2)}</td>
                              </tr>
                              {invoice.tax > 0 && (
                                <tr>
                                  <td colSpan="3" className="px-6 py-2 text-sm text-right font-medium text-gray-700">Tax:</td>
                                  <td className="px-6 py-2 text-sm text-right text-gray-900">${invoice.tax.toFixed(2)}</td>
                                </tr>
                              )}
                              {invoice.discount > 0 && (
                                <tr>
                                  <td colSpan="3" className="px-6 py-2 text-sm text-right font-medium text-gray-700">Discount:</td>
                                  <td className="px-6 py-2 text-sm text-right text-green-600">-${invoice.discount.toFixed(2)}</td>
                                </tr>
                              )}
                              <tr>
                                <td colSpan="3" className="px-6 py-2 text-sm text-right font-bold text-gray-700">Total:</td>
                                <td className="px-6 py-2 text-sm text-right font-bold text-gray-900">${invoice.total.toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment form */}
                    {payingInvoiceId === invoice._id && (
                      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                          <button 
                            onClick={() => setPayingInvoiceId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <Elements stripe={stripePromise}>
                          <PaymentForm 
                            invoice={invoice} 
                            onPaymentSuccess={handlePaymentSuccess} 
                          />
                        </Elements>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No invoices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter !== 'all' 
                  ? `No invoices with status "${statusFilter}" found.` 
                  : 'You don\'t have any invoices yet.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Billing;

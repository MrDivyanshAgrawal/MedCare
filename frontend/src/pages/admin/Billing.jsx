// src/pages/admin/Billing.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaFileInvoiceDollar, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaDownload,
  FaPlus,
  FaChartBar,
  FaFilePdf
} from 'react-icons/fa';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [reportType, setReportType] = useState('revenue');
  const [reportData, setReportData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [dateRange]);

  const fetchInvoices = async () => {
    try {
      const params = {
        startDate: dateRange[0].startDate.toISOString(),
        endDate: dateRange[0].endDate.toISOString()
      };
      
      const response = await api.get('/billing', { params });
      setInvoices(response.data);
      setLoading(false);
      
      // Generate initial report
      fetchReportData(reportType);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
      setLoading(false);
    }
  };

  const fetchReportData = async (type) => {
    setReportLoading(true);
    try {
      const params = {
        startDate: dateRange[0].startDate.toISOString(),
        endDate: dateRange[0].endDate.toISOString(),
        type
      };
      
      const response = await api.get('/reports', { params });
      setReportData(response.data);
      setReportLoading(false);
    } catch (err) {
      console.error('Error fetching report data:', err);
      toast.error('Failed to load report data');
      setReportLoading(false);
    }
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    fetchReportData(type);
  };

  const generateReport = async () => {
    try {
      const params = {
        startDate: dateRange[0].startDate.toISOString(),
        endDate: dateRange[0].endDate.toISOString(),
        type: reportType
      };
      
      // Open report in new window/tab
      window.open(`/api/reports/download?${new URLSearchParams(params)}`, '_blank');
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate report');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.includes(searchTerm) || 
      invoice.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      invoice.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getTotalRevenue = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + (invoice.paymentStatus === 'paid' ? invoice.total : 0), 0);
  };

  const getPendingAmount = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + (invoice.paymentStatus === 'pending' ? invoice.total : 0), 0);
  };

  // For pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
            <h1 className="text-2xl font-bold">Billing & Reports</h1>
            <p className="mt-1 text-yellow-100">
              Manage invoices and generate financial reports
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

        {/* Date Range and Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="button"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 text-left focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                {`${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
              </button>
              {showDatePicker && (
                <div className="absolute mt-2 z-10 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                  <DateRangePicker
                    onChange={item => {
                      setDateRange([item.selection]);
                      setShowDatePicker(false);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={dateRange}
                    direction="horizontal"
                  />
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by invoice number or patient"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaFileInvoiceDollar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${getTotalRevenue().toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">${getPendingAmount().toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaFileInvoiceDollar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FaChartBar className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Financial Reports</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={generateReport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <FaFilePdf className="mr-2 h-4 w-4 text-gray-500" />
                Export PDF
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleReportTypeChange('revenue')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reportType === 'revenue' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => handleReportTypeChange('invoices')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reportType === 'invoices' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => handleReportTypeChange('paymentMethods')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reportType === 'paymentMethods' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Payment Methods
              </button>
              <button
                onClick={() => handleReportTypeChange('departments')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reportType === 'departments' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Departments
              </button>
            </div>
            
            {reportLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="h-80">
                {reportType === 'revenue' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#FFB200" strokeWidth={2} />
                      <Line type="monotone" dataKey="pending" name="Pending" stroke="#9CA3AF" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                
                {reportType === 'invoices' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [name === 'paid' ? `$${value}` : value, name === 'paid' ? 'Paid Invoices' : 'Total Invoices']} />
                      <Legend />
                      <Bar dataKey="count" name="Total Invoices" fill="#3B82F6" />
                      <Bar dataKey="paid" name="Paid Invoices" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {reportType === 'paymentMethods' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                
                {reportType === 'departments' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Invoices Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
            <Link
              to="/admin/billing/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
            >
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              Create Invoice
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/billing/${invoice._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/billing/${invoice._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => window.open(`/api/billing/${invoice._id}/download`, '_blank')}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FaDownload className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;

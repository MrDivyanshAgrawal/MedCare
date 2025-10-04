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
  FaFilePdf,
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaChartPie,
  FaFileExcel
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

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaFileInvoiceDollar className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Billing & Reports</h1>
                <p className="text-yellow-100 text-lg mt-1">
                  Manage invoices and generate financial reports
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

        {/* Date Range and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <button
                type="button"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                {`${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
              </button>
              {showDatePicker && (
                <div className="absolute mt-2 z-50 bg-white shadow-2xl rounded-lg p-4 border border-gray-200">
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
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by invoice number or patient"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none transition-all duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-100 to-green-200 mr-4">
                <FaMoneyBillWave className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${getTotalRevenue().toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 mr-4">
                <FaFileInvoiceDollar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">${getPendingAmount().toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 mr-4">
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FaChartBar className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={generateReport}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <FaFilePdf className="mr-2 h-4 w-4 text-red-500" />
                Export PDF
              </button>
              <button
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <FaFileExcel className="mr-2 h-4 w-4 text-green-500" />
                Export Excel
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleReportTypeChange('revenue')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  reportType === 'revenue' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaChartLine className="inline mr-2 h-4 w-4" />
                Revenue
              </button>
              <button
                onClick={() => handleReportTypeChange('invoices')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  reportType === 'invoices' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaFileInvoiceDollar className="inline mr-2 h-4 w-4" />
                Invoices
              </button>
              <button
                onClick={() => handleReportTypeChange('paymentMethods')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  reportType === 'paymentMethods' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaChartPie className="inline mr-2 h-4 w-4" />
                Payment Methods
              </button>
              <button
                onClick={() => handleReportTypeChange('departments')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  reportType === 'departments' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaChartBar className="inline mr-2 h-4 w-4" />
                Departments
              </button>
            </div>
            
            {reportLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
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
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={2} />
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <Link
              to="/admin/billing/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-sm font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              Create Invoice
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          invoice.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/billing/${invoice._id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            View
                          </Link>
                          <span className="text-gray-300">|</span>
                          <Link
                            to={`/admin/billing/${invoice._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          >
                            Edit
                          </Link>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => window.open(`/api/billing/${invoice._id}/download`, '_blank')}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            <FaDownload className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FaFileInvoiceDollar className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">No invoices found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                      </div>
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

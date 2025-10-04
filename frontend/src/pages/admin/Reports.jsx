import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaChartBar, 
  FaChartPie, 
  FaChartLine, 
  FaCalendarAlt, 
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaFilter,
  FaUserMd,
  FaUserInjured,
  FaMoneyBillWave,
  FaStethoscope,
  FaHeartbeat,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
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
  Cell,
  Area,
  AreaChart 
} from 'recharts';

const AdminReports = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('appointments');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [reportData, setReportData] = useState([]);
  const [reportGenerating, setReportGenerating] = useState(false);

  // Report types
  const reportTypes = [
    { id: 'appointments', name: 'Appointments', icon: FaCalendarAlt, color: 'from-blue-600 to-blue-700' },
    { id: 'revenue', name: 'Revenue', icon: FaChartLine, color: 'from-green-600 to-green-700' },
    { id: 'doctors', name: 'Doctors Performance', icon: FaUserMd, color: 'from-purple-600 to-purple-700' },
    { id: 'patients', name: 'Patient Demographics', icon: FaUserInjured, color: 'from-orange-600 to-orange-700' },
  ];

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = {
        reportType,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      };
      
      const response = await api.get('/reports/data', { params });
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, field) => {
    setDateRange({
      ...dateRange,
      [field]: new Date(event.target.value)
    });
  };

  const generateReport = async (format) => {
    setReportGenerating(true);
    try {
      const params = {
        reportType,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        format
      };
      
      const queryString = new URLSearchParams(params).toString();
      const downloadUrl = `/api/reports/download?${queryString}`;
      
      window.open(downloadUrl, '_blank');
      
      toast.success(`${format.toUpperCase()} report generated successfully`);
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate report');
    } finally {
      setReportGenerating(false);
    }
  };

  // Chart colors
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      );
    }

    if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <FaChartBar className="h-16 w-16 text-gray-300" />
          <p className="mt-4 text-gray-500">No data available for the selected period</p>
        </div>
      );
    }

    switch (reportType) {
      case 'appointments':
        return (
          <div className="space-y-8">
            {/* Appointments Overview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaHeartbeat className="mr-2 h-5 w-5 text-blue-600" />
                Appointments Overview
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={reportData.timeline || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAppointments)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Status Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.byStatus || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(reportData.byStatus || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Top Doctors */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUserMd className="mr-2 h-5 w-5 text-purple-600" />
                  Top Doctors by Appointments
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData.topDoctors || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="name" type="category" stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className="space-y-8">
            {/* Revenue Trend */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaMoneyBillWave className="mr-2 h-5 w-5 text-green-600" />
                Revenue Trend
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reportData.trend || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="collected" name="Collected" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 h-5 w-5 text-yellow-600" />
                  Payment Methods
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.paymentMethods || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(reportData.paymentMethods || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Department Revenue */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaStethoscope className="mr-2 h-5 w-5 text-indigo-600" />
                  Revenue by Department
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData.departments || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-gray-500">Please select a report type to view data</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaChartBar className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
                <p className="text-purple-100 text-lg mt-1">
                  Generate and view reports to make data-driven decisions
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

        {/* Report Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            {/* Report Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Report Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        reportType === type.id
                          ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg transform scale-105`
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      <Icon className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{type.name}</span>
                      {reportType === type.id && (
                        <div className="absolute top-2 right-2">
                          <FaCheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    id="start-date"
                    value={dateRange.startDate.toISOString().substr(0, 10)}
                    onChange={(e) => handleDateChange(e, 'startDate')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    id="end-date"
                    value={dateRange.endDate.toISOString().substr(0, 10)}
                    onChange={(e) => handleDateChange(e, 'endDate')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={() => generateReport('pdf')}
                  disabled={reportGenerating || loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFilePdf className="mr-2 h-4 w-4" />
                  Export PDF
                </button>
                <button
                  onClick={() => generateReport('excel')}
                  disabled={reportGenerating || loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFileExcel className="mr-2 h-4 w-4" />
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {reportTypes.find(r => r.id === reportType)?.name} Report
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Data from {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()}
          </p>
          
          {renderChart()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;

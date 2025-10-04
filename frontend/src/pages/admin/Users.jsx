import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaSearch, 
  FaFilter, 
  FaUserMd, 
  FaUserInjured, 
  FaUserCog,
  FaEdit,
  FaTrashAlt,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
  FaUserShield,
  FaClock,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await api.put(`/users/${id}/status`, { isActive: !isActive });
      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      
      setUsers(users.map(user => 
        user._id === id ? { ...user, isActive: !isActive } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  const handleResetPassword = async (id) => {
    if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
      return;
    }
    
    try {
      await api.post(`/users/${id}/reset-password`);
      toast.success('Password reset email sent');
    } catch (err) {
      console.error('Error resetting password:', err);
      toast.error('Failed to reset password');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      
      setUsers(users.filter(user => user._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) || 
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserCog className="h-5 w-5 text-purple-600" />;
      case 'doctor':
        return <FaUserMd className="h-5 w-5 text-blue-600" />;
      case 'patient':
        return <FaUserInjured className="h-5 w-5 text-green-600" />;
      default:
        return <FaUser className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'patient':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaUserShield className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-purple-100 text-lg mt-1">
                  Manage all system users and their access
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Active</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Doctors</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'doctor').length}
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="doctor">Doctors</option>
                <option value="patient">Patients</option>
              </select>
            </div>
            
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li key={user._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img 
                          className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md" 
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=9333ea&color=fff`} 
                          alt={user.name} 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                          {getRoleIcon(user.role)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {user.name}
                          {user.isActive ? (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheck className="mr-1 h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FaTimes className="mr-1 h-3 w-3" />
                              Inactive
                            </span>
                          )}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full capitalize ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">{user.role}</span>
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                            <FaEnvelope className="mr-1 h-3 w-3" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                              <FaPhone className="mr-1 h-3 w-3" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
                            Registered: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-2 h-4 w-4 text-gray-400" />
                            Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          user.isActive 
                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300' 
                            : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <FaToggleOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <FaToggleOn className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleResetPassword(user._id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-sm font-medium rounded-lg hover:from-purple-200 hover:to-purple-300 transition-all duration-200"
                      >
                        <FaLock className="mr-2 h-4 w-4" />
                        Reset Password
                      </button>
                      <Link
                        to={`/admin/users/${user._id}/edit`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 text-sm font-medium rounded-lg hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200"
                      >
                        <FaEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(user._id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-sm font-medium rounded-lg hover:from-red-200 hover:to-red-300 transition-all duration-200"
                      >
                        <FaTrashAlt className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          ) : (
            <div className="px-6 py-24 text-center">
              <FaUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-3 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter || statusFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'No users have registered yet'}
              </p>
            </div>
          )}
        </div>

        {/* Add User Button */}
        <div className="flex justify-end">
          <Link 
            to="/admin/users/create" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <FaUser className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </div>

        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(confirmDelete)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;

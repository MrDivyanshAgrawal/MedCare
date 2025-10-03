// src/pages/admin/Users.jsx
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
  FaEnvelope
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
      
      // Update local state
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
      
      // Remove from local state
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="mt-1 text-purple-100">
              Manage all system users and their access
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li key={user._id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            getRoleIcon(user.role)
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <FaEnvelope className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md ${
                          user.isActive 
                            ? 'text-red-700 bg-red-100 hover:bg-red-200' 
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleResetPassword(user._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                      >
                        <FaLock className="mr-1 h-4 w-4" />
                        Reset Password
                      </button>
                      <Link
                        to={`/admin/users/${user._id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <FaEdit className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(user._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <FaTrashAlt className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800">
                        {user.role}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Last Login: </span>
                      <span className="font-medium text-gray-900">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Registered: </span>
                      <span className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-12 text-center">
                <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || roleFilter || statusFilter !== 'all'
                    ? 'Try adjusting your search filters'
                    : 'No users have registered yet'}
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* Add User Button */}
        <div className="flex justify-end">
          <Link 
            to="/admin/users/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add New User
          </Link>
        </div>

        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(confirmDelete)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
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

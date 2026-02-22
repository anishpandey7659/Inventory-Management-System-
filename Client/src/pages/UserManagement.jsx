import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Ban, Plus, X, Info } from 'lucide-react';
import { create_manager, create_staff,my_team,delete_user} from '../services/ApiService';

const UserManagement = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'Staff',
    password: '',
    confirmPassword: '',
    status: 'Active'
  });

useEffect(() => {
  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const response = await my_team();
      setTeamData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchTeamData();
}, []);

// NOW you can have early returns
if (loading) return <div>Loading team data...</div>;
if (error) return <div>Error: {error}</div>;

console.log('LOlo: ',teamData);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await delete_user(userId);
            // Refresh team data
            const response = await my_team();
            setTeamData(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const rolePermissions = {
    Manager: [
      'Manage inventory and stock levels',
      'View and generate reports',
      'Limited user management access'
    ],
    Staff: [
      'View inventory items',
      'Update stock quantities',
      'No access to user management'
    ]
  };

  const roleDescriptions = {
    Manager: 'Manage inventory & reports',
    Staff: 'Limited inventory access'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async() => {
    const newUser = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      // role: formData.role.split(' - ')[0],
      password:formData.password,

    };
    console.log(formData.password);
    console.log(formData.confirmPassword);
    if (formData.password == formData.confirmPassword){
      console.log("correct password");
      if (formData.role == 'Manager'){

      try{
          const response =await create_manager(newUser);
          console.log("Sucessfully created : ",response.data);
      }catch(error){
        console.log(error)
      }
      }else{
         try{
            const response =await create_staff(newUser);
            console.log("Sucessfully created : ",response.data);
          }catch(error){
            console.log(error);
      }
      }

    }else{
      console.log("Please enter correct paswword")
    }
    
    // setUsers([...users, newUser]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditUser = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? {
            ...user,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role.split(' - ')[0],
          }
        : user
    );
    
    setUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      role: 'Staff',
      password: '',
      confirmPassword: '',
      status: 'Active'
    });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: `${user.role} - ${roleDescriptions[user.role]}`,
      password: '',
      confirmPassword: '',
      status: user.status
    });
    setShowEditModal(true);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: 'bg-purple-100 text-purple-700 border border-purple-200',
      Manager: 'bg-blue-100 text-blue-700 border border-blue-200',
      Staff: 'bg-gray-100 text-gray-700 border border-gray-200'
    };
    return colors[role] || colors.Staff;
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700 border border-green-200' 
      : 'bg-red-100 text-red-700 border border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage staff and manager accounts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Create User
          </button>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {user.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                          {user.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name + ' ' + user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.first_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'Admin' && '👑 '}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button onClick={()=> handleDeleteUser(user.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                          title="Disable User"
                        >
                          <Ban size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing 1 to {teamData.length} of {teamData.length} users
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                <p className="text-sm text-gray-500 mt-1">Add a new staff or manager account</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Username and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="john"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number and Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="johndoe12@gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                </label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="Staff - Limited inventory access">Staff - Limited inventory access</option>
                    <option value="Manager - Manage inventory & reports">Manager - Manage inventory & reports</option>
                  </select>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Role Permissions */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-900 mb-2">
                      Role Permissions:
                    </h4>
                    <ul className="space-y-1">
                      {rolePermissions[formData.role.split(' - ')[0]]?.map((permission, index) => (
                        <li key={index} className="text-sm text-indigo-800">
                          • {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <p className="text-sm text-gray-500 mt-1">Update user information and permissions</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Username and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number and Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="Staff - Limited inventory access">Staff - Limited inventory access</option>
                    <option value="Manager - Manage inventory & reports">Manager - Manage inventory & reports</option>
                  </select>
                </div>
              </div>

              {/* Role Permissions */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-900 mb-2">
                      Role Permissions:
                    </h4>
                    <ul className="space-y-1">
                      {rolePermissions[formData.role.split(' - ')[0]]?.map((permission, index) => (
                        <li key={index} className="text-sm text-indigo-800">
                          • {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  resetForm();
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
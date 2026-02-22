import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { userdetail } from '../services/ApiService';
import { User, Mail, Phone, MapPin, Building, Calendar, Camera, Save, Edit2 ,LogOut } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState([]);
  useEffect(()=>{
    const fetchUserDetail =async()=>{
      try{
        const response = await userdetail();
        console.log(response.data);
        setProfileData(response.data)
      }catch(err){
        console.log(err);
      }finally{
        setLoading(false);
      }
    }
    fetchUserDetail();
  }
  ,[]);
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

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add your save logic here
    console.log('Saving profile data:', profileData);
  };
  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
    // Add logout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="max-w-6xl mx-auto">
        <div className="mt-2 flex justify-end">
          <Link to='/'
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header with Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          
          <div className="px-8 pb-8">
            {/* Profile Picture and Edit Button */}
            <div className="flex justify-between items-start -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isEditing 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.first_name + ' ' + profileData.last_name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.location}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Work Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Information</h2>
                
                {/* Role */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Staff</option>
                      <option>Viewer</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.role}</p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Building className="w-4 h-4 text-gray-500" />
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.department}</p>
                  )}
                </div>

                {/* Join Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Join Date
                  </label>
                  <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">{formatDate(profileData.created_at)}</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-2.5">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">156</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products Managed</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">5</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Since</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">3 years</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
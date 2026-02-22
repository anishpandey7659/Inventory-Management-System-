import React, { useState } from 'react';
import { registercompany } from '../../services/ApiService';
import { data, useNavigate } from 'react-router-dom';

export default function CompanyAccountForm() {
  const navigate = useNavigate(); 
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',

    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
    admin_confirm_password: '',
    admin_code: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrors({}); 
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const data ={
    "client_name": formData.company_name,
    "client_email": formData.company_email,
    "client_phone":formData.company_phone,
    "client_address":formData.company_address,
    "admin_first_name":formData.admin_first_name,
    "admin_last_name":formData.admin_last_name,
    "admin_code":formData.admin_code,
    "admin_email": formData.admin_email,
    "admin_password": formData.admin_password,
    "admin_confirm_password":formData.admin_confirm_password
    }
    console.log('Data being sent:', data);
    try{
      const response =await registercompany(data);
      console.log('✅ Success:', response.data);
      navigate('/');
    }catch(error){
      setErrors(error.data);  
      console.log("error: ",error)
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center p-8">
    <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Create Company Account
        </h1>
        <p className="text-gray-600 text-base">
          Register your company and set up admin access
          And login through admin account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Company Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
            Company Details
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.company_name 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.company_name && (
                <p className="text-red-600 text-sm mt-1">{errors.company_name[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Company Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.company_email 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.company_email && (
                <p className="text-red-600 text-sm mt-1">{errors.company_email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Company Phone
              </label>
              <input
                type="text"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.company_phone 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.company_phone && (
                <p className="text-red-600 text-sm mt-1">{errors.company_phone[0]}</p>
              )}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Company Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                errors.company_address 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 focus:border-indigo-600'
              }`}
            />
            {errors.company_address && (
              <p className="text-red-600 text-sm mt-1">{errors.company_address[0]}</p>
            )}
          </div>
        </div>

        {/* Admin Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
            Admin (Company Owner) Details
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Admin First Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="admin_first_name"
                value={formData.admin_first_name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.admin_first_name 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.admin_first_name && (
                <p className="text-red-600 text-sm mt-1">{errors.admin_first_name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Admin Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="admin_last_name"
                value={formData.admin_last_name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.admin_last_name 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.admin_last_name && (
                <p className="text-red-600 text-sm mt-1">{errors.admin_last_name[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Admin Email (used for login) <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="admin_email"
                value={formData.admin_email}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.admin_email 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.admin_email && (
                <p className="text-red-600 text-sm mt-1">{errors.admin_email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Admin code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="admin_code"
                value={formData.admin_code}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.admin_code 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.admin_code && (
                <p className="text-red-600 text-sm mt-1">{errors.admin_code[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="admin_password"
                value={formData.admin_password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.admin_password 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.admin_password && (
                <p className="text-red-600 text-sm mt-1">{errors.admin_password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="admin_confirm_password"
                value={formData.admin_confirm_password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2.5 text-base border rounded-md focus:outline-none transition-colors ${
                  errors.admin_confirm_password 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-gray-300 focus:border-indigo-600'
                }`}
              />
              {errors.admin_confirm_password && (
                <p className="text-red-600 text-sm mt-1">{errors.admin_confirm_password[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-md transition-colors shadow-md shadow-indigo-600/30"
        >
          Create Account
        </button>
      </form>
    </div>
  </div>
);
}
import React, { useState ,useEffect} from 'react';
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { userdetail } from '../../services/ApiService';
// import { userdetail } from '../../services/Apiservice';

const Layout = ({ children }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading,setLoading]=useState('')
  const navigate = useNavigate();
  const location = useLocation();
    const [profileData, setProfileData] = useState([]);
    useEffect(()=>{
      const fetchUserDetail =async()=>{
        try{
          const response = await userdetail();
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

  const getTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard";
    if (path === "/inventory") return "Inventory";
    if (path === "/movements") return "Movements";
    if (path === "/billing") return "Billing";
    if (path === "/suppliers") return "Suppliers";
    if (path === "/report") return "Reports";
    if (path === "/users") return "Users";
    if (path === "/settings") return "Settings";
    return "Dashboard";
  };

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Sidebar */}
      <div 
        className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'w-[260px]' : 'w-0'
        }`}
      >
        
        {/* Top Section */}
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-gray-900 m-0 text-lg font-bold tracking-tight">
                InventoryPro
              </h2>
              <p className="text-xs text-gray-500 m-0">Management System</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-1 overflow-y-auto">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2 px-3 mb-0.5 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Products</span>
            </NavLink>

            {/* <NavLink
              to="/stock-levels"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Stock Levels</span>
            </NavLink> */}

            <NavLink
              to="/billinghistory"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Movements</span>
            </NavLink>

            <NavLink
              to="/billing"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="/suppliers"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>Suppliers</span>
            </NavLink>

            <NavLink
              to="/user-management"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 py-2.5 px-3 mb-1 border-none rounded-lg
                text-[15px] font-medium cursor-pointer transition-all duration-200 text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 z-10">
          <div className="flex items-center justify-between py-2 px-6">
            
            {/* Left Section - Menu & Dashboard Title */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="bg-transparent border-none text-gray-600 p-2 cursor-pointer rounded-lg flex items-center hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-gray-900 m-0 text-2xl font-bold">
                  {getTitle()}
                </h2>
                <p className="text-sm text-gray-500 m-0 mt-0.5">
                  {/* Welcome back! Here's what's happening with your inventory. */}
                </p>
              </div>
            </div>

            {/* Right Section - Search, Notification & Profile */}
            <div className="flex items-center gap-4">
              
              {/* Search Bar */}
              {/* <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products, SKUs, orders..."
                  className="w-80 py-2 px-6 pl-10 rounded-lg border border-gray-200 outline-none text-sm text-gray-700 bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div> */}

              {/* Notification Button */}
              <button className="bg-transparent border-none text-gray-500 p-2 cursor-pointer rounded-lg relative flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Profile */}
              <Link to='/profile-page'>
                <div 
                  className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {profileData.first_name}
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 m-0 text-sm font-semibold">
                      {profileData.first_name}
                    </p>
                    <p className="text-xs text-gray-500 m-0">{profileData.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}

export default Layout;
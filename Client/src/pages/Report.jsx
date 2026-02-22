import React, { useState,useEffect } from 'react';
import { Download, Trash2, FileText, Plus, TrendingUp, TrendingDown, Package, ShoppingCart, Users } from 'lucide-react';
import { getsales,total_revenue } from '../services/ApiService';




const Reports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Monthly Sales Report',
      date: 'Oct 2023',
      type: 'Sales',
      size: '1.2 MB',
      icon: '📄'
    },
    {
      id: 2,
      name: 'Inventory Valuation',
      date: 'Oct 2023',
      type: 'Inventory',
      size: '845 KB',
      icon: '📄'
    },
    {
      id: 3,
      name: 'Low Stock Alert',
      date: 'Sep 2023',
      type: 'Inventory',
      size: '230 KB',
      icon: '📄'
    },
    {
      id: 4,
      name: 'Customer Acquisition',
      date: 'Q3 2023',
      type: 'Marketing',
      size: '2.4 MB',
      icon: '📄'
    }
  ]);
    const [Total_Revenue, setTotalRevenue] = useState(0);
    useEffect(() => {
      const fetchRevenue = async () => {
        try {
          const res = await total_revenue();
          setTotalRevenue(res.data.total_revenue);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchRevenue();
    }, []);

  const stats = [
    {
      title: "Total Revenue",
      subtitle: 'Last 30 days',
      value: Total_Revenue,
      change: '+12.5%',
      isPositive: true,
      color: 'green',
      progress: 85
    },
    {
      title: 'Products Sold',
      subtitle: 'Last 30 days',
      value: '18',
      change: '+5.2%',
      isPositive: true,
      color: 'blue',
      progress: 72
    },
    {
      title: 'New Customers',
      subtitle: 'Last 30 days',
      value: '345',
      change: '-2.1%',
      isPositive: false,
      color: 'orange',
      progress: 58
    }
  ];

  const handleDownload = (reportName) => {
    console.log(`Downloading ${reportName}`);
    // Add download logic here
  };

  const handleDelete = (reportId) => {
    setReports(reports.filter(report => report.id !== reportId));
  };

  const getProgressColor = (color) => {
    const colors = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const getTypeColor = (type) => {
    const colors = {
      Sales: 'bg-green-100 text-green-700',
      Inventory: 'bg-blue-100 text-blue-700',
      Marketing: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">{stat.title}</h3>
                  <p className="text-gray-500 text-sm">{stat.subtitle}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(stat.color)} transition-all duration-500`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Generated Reports Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Generated Reports</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
              <Plus className="w-5 h-5" />
              Generate New
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {report.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(report.name)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State (if no reports) */}
          {reports.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports generated yet</h3>
              <p className="text-gray-600 mb-4">Create your first report to get started</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Generate Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
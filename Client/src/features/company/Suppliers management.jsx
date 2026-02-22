import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Package, DollarSign, TrendingUp, Clock, Star, Edit2, Trash2, Eye, ShoppingCart, Calendar, FileText, Award, AlertCircle } from 'lucide-react';
import { CreateSupplierModal } from '../products/CreateSupplier';
import { getSuppliers } from '../../services/ApiService';

const SuppliersManagement = () => {
  const [showCreateSupplier, setShowCreateSupplier] = useState(false);
  const [supplierdetail, setsupplierdetail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await getSuppliers();
        console.log(response.data);
        setsupplierdetail(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSupplier();
  }, []);

  const filteredSuppliers = supplierdetail.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const activeSuppliers = supplierdetail.length;
  const totalSuppliers = supplierdetail.length;

  const statCards = [
    { label: 'Total Suppliers', value: totalSuppliers, icon: Package, color: 'text-emerald-500', bgColor: 'bg-emerald-500', subtext: 'All suppliers' },
    { label: 'Active Suppliers', value: activeSuppliers, icon: DollarSign, color: 'text-blue-500', bgColor: 'bg-blue-500', subtext: 'Currently active' },
    { label: 'New This Month', value: '0', icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-500', subtext: 'Added recently' },
    { label: 'Pending Review', value: '0', icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500', subtext: 'Need attention' }
  ];

  const handleCreateSupplier = (e) => {
    setShowCreateSupplier(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-1">
              Suppliers
            </h1>
            <p className="text-sm text-gray-500">
              Manage your supplier relationships and purchase orders
            </p>
          </div>
          <button 
            onClick={handleCreateSupplier}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 transition-all duration-200 shadow-md shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40"
          >
            <Plus size={18} />
            Add Supplier
          </button>
          <CreateSupplierModal
            isOpen={showCreateSupplier}
            onClose={() => setShowCreateSupplier(false)}
          />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-10 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.subtext}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} bg-opacity-10 flex items-center justify-center`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSuppliers.map((supplier) => {
            return (
              <div 
                key={supplier.id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {supplier.name}
                      </h3>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="px-5 py-4 bg-gray-50 text-xs text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={14} className="text-gray-500" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={14} className="text-gray-500" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{supplier.address}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-blue-700">
                    <ShoppingCart size={14} />
                    Create PO
                  </button>
                  <button className="px-2 py-2 bg-white border border-gray-200 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-50">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="px-2 py-2 bg-white border border-gray-200 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-50">
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button className="px-2 py-2 bg-white border border-gray-200 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-red-50 group">
                    <Trash2 size={16} className="text-gray-600 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="bg-white rounded-xl px-5 py-15 text-center border border-gray-200">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No suppliers found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search or add a new supplier
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersManagement;
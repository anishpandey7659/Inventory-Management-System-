import React, { useState,useEffect } from 'react';
import { Search, Eye, Download, Printer, Plus, FileText, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/UseHook";
import { getsales,total_revenue,getProduct,getsalesId } from '../services/ApiService';

const BillingHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useFetch(getsales, []);
  const [productList, setProductList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [productNames, setProductNames] = useState({});
  const pageSize = 10;
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
  

const fetchInvoiceDetail = async (invoice) => {
  setLoadingDetail(true);
  try {
    const numericId = invoice.id.replace('INV-', '');
    console.log('Invoice object:', invoice);
    console.log('numericId :', numericId );
    const response = await getsalesId(numericId);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    setSelectedInvoiceDetail(response.data);
  
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    alert(`Failed to load invoice details: ${error.message}`);
  } finally {
    setLoadingDetail(false);
  }
};
if (loadingDetail){
  return <h1>Loading billing</h1>
}

  const invoices = (data?.results ?? data ?? []).map(sale => ({
    id: `INV-${sale.id}`,                      
    customer: sale.customer_name,              
    date:new Date(sale.date).toLocaleString("en-GB"),

    items: sale.items.length,                  
    amount: Number(sale.total_amount),         
    status: sale.status ?? "paid",             
  }));

  const totalCount =invoices .length
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);



let Total_Invoices=data.length
const paginatedInvoices =invoices.slice(
  (currentPage-1)* pageSize,
  currentPage * pageSize
)

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = [
    { label: 'Total Invoices', value: Total_Invoices, icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Revenue', value: Total_Revenue, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Paid', value: '186', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Pending', value: '62', icon: Clock, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Billing History</h2>
          <p className="text-gray-600 mt-1">View and manage all your invoices</p>
        </div>
        <Link to='/billing' className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Invoice</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Invoice</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Invoice number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    <button   onClick={() => {setSelectedInvoice(invoice);fetchInvoiceDetail(invoice);}}
                      className="hover:underline cursor-pointer"
                      >
                      #{invoice.id}
                    </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.items} items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => {setSelectedInvoice(invoice);fetchInvoiceDetail(invoice);}} className="text-blue-600 hover:text-blue-800 transition" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 transition" title="Download">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">Showing {start} – {end} of {totalCount} entries</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹ Prev
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`py-2 px-4 border border-gray-200 rounded-md text-sm font-medium cursor-pointer ${
                      currentPage === page 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-500'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
                className="py-2 px-4 bg-white border border-gray-200 rounded-md text-gray-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>


          {/* ADD THE MODAL HERE - Invoice Detail Modal */}
    {selectedInvoice && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Invoice Details</h3>
                <p className="text-blue-100 mt-1">#{selectedInvoice.id}</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedInvoice(null);
                  setSelectedInvoiceDetail(null);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : selectedInvoiceDetail ? (
              <>
                {/* Customer & Invoice Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Customer Information</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">Customer Name</label>
                        <p className="text-sm font-semibold text-gray-800">{selectedInvoiceDetail.customer_name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone Number</label>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedInvoiceDetail.customer_phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Invoice Information</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">Invoice Date</label>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(selectedInvoiceDetail.date).toLocaleString("en-GB")}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                            {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden mb-6">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                      <FileText className="mr-2" size={18} />
                      Invoice Items
                    </h4>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoiceDetail.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">ProductId #{item.product}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">${parseFloat(item.price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="max-w-sm ml-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-semibold text-gray-800">
                        ${parseFloat(selectedInvoiceDetail.subtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tax</span>
                      <span className="text-sm font-semibold text-gray-800">
                        ${parseFloat(selectedInvoiceDetail.tax).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${parseFloat(selectedInvoiceDetail.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t mt-6 pt-6 flex items-center justify-end space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2">
                    <Download size={18} />
                    <span>Download PDF</span>
                  </button>
                  <button onClick={() => window.print()}  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2">
                    <Printer size={18} />
                    <span> Print </span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedInvoice(null);
                      setSelectedInvoiceDetail(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Failed to load invoice details
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    {/* END OF MODAL */}
    
    
    </div>
    
  );
};

export default BillingHistory;
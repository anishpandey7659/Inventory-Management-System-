import React, { useState,useEffect } from 'react';
import { X, Plus, Minus, Search, ShoppingCart, FileText, Printer, Save,History} from 'lucide-react';
import { getProducts,createsales } from '../services/ApiService';
import { Link } from "react-router-dom";

const BillingCreate = () => {
  const [customerName, setCustomerName] = useState('John Doe');
  const [customer_phone, setCustomer_phone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showProductList, setShowProductList] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const fetchInventory = async () => {
  try {
    let page = 1;
    let allProducts = [];

    // Keep fetching while there is a next page
    while (true) {
      const response = await getProducts({}, page);
      if (page === 1) {
        setTotalCount(response.data.count);
      }
      const data = response.data.results || response.data;
      allProducts = [...allProducts, ...data];
      if (!response.data.next) break;
      page++;
    }

    // Map once after fetching all data
    const mappedData = allProducts.map((item) => ({
      id: item.id,
      name: item.product_name,
      sku: item.sku,
      category: item.category?.name || "Unknown",
      Sp: item.selling_price,
      Pp: item.purchase_price,
      quantity: item.quantity,
      status:
        item.quantity === 0
          ? "Out of Stock"
          : item.quantity < 15
            ? "Low Stock"
            : "In Stock",
    }));

    setInventoryData(mappedData);

  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

    useEffect(() => {
    fetchInventory();
    }, []);




const filteredProducts = inventoryData.filter((product) => {
  const query = searchQuery.toLowerCase();
  return (
    product.name.toLowerCase().includes(query) ||
    product.sku.toLowerCase().includes(query)
  );
});


const calculateSubtotal = () => {
  return invoiceItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );
};


  const calculateTax = () => {
    const subtotal = Number(calculateSubtotal()) || 0;
    const tax = subtotal * 0.08;
    return parseFloat(tax.toFixed(2));
  };


  const calculateTotal = () => {
    const subtotal = Number(calculateSubtotal()) || 0;
    const total = subtotal + calculateTax();
    return parseFloat(total.toFixed(2));
  };


  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setInvoiceItems(invoiceItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  const removeItem = (itemId) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };

  const addProduct = (product) => {
    const existingItem = invoiceItems.find(item => item.sku === product.sku);
    
    if (existingItem) {
      updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price : product.Sp,
        quantity: quantity,
        total: product.Sp * quantity
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
    
    setSearchQuery('');
    setQuantity(1);
    setShowProductList(false);
  };



  const handleGenerateInvoice = async() => {
    console.log("Generating invoice..."); 
    console.log("data items:", invoiceItems.map(item => ({
      product: item.id,
      quantity: item.quantity,
    })));
    let data = {
      customer_name: customerName,
      customer_phone: customer_phone,
      subtotal: (calculateSubtotal()).toFixed(2),
      tax: calculateTax(),
      total_amount: calculateTotal(),
      items: invoiceItems.map(item => ({
        product:  item.id,
        quantity: item.quantity,
        price:parseFloat(item.price).toFixed(2),
      })),
    };
    console.log("data: ",data);
    try{
      const res = await createsales(data);
      console.log("Successfully Send");
      console.log("Success", res.data);
    }catch(err){
      console.log("Error", err.response.data);
    }
    

    alert('Invoice generated successfully!');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
            <p className="text-sm text-gray-600">Fill in the details to generate a new invoice</p>
          </div>
          
          <Link to="/billinghistory" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm text-sm">
          <History size={18} />
           Billing history
          </Link>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Left Column - Customer Details & Add Items */}
          <div className="space-y-4 pr-2 h-full overflow-hidden">
            {/* Customer Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Customer Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customer_phone}
                    onChange={(e) => setCustomer_phone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+977 9811122233"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Add Item Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                Add Item
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Find Product
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowProductList(e.target.value.length > 0);
                      }}
                      onFocus={() => searchQuery && setShowProductList(true)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Search by name or SKU..."
                    />
                    
                    {/* Product Dropdown */}
                    {showProductList && searchQuery && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => addProduct(product)}
                              className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                  <p className="text-xs text-gray-500">{product.sku}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-gray-900">${product.Sp}</p>
                                  <p className={`text-xs ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.quantity > 0 ? `${product.quantity} avail` : 'Out of stock'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-gray-500 text-sm">
                            <p>No products found</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => searchQuery && addProduct(filteredProducts[0])}
                      disabled={!searchQuery || filteredProducts.length === 0}
                      className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-medium shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Current Invoice */}
          <div className="overflow-hidden flex flex-col">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Current Invoice</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Invoice #INV-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs">Date</p>
                    <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items - Scrollable */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-gray-200 sticky top-0 bg-white">
                      <tr>
                        <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 uppercase">Item</th>
                        <th className="text-center py-2 px-2 text-xs font-semibold text-gray-600 uppercase">Qty</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600 uppercase">Price</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600 uppercase">Total</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600 uppercase"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invoiceItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.sku}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right text-sm text-gray-600">
                            ${Number(item.price || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-right text-sm font-semibold text-gray-900">
                           ${Number(item.total || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {invoiceItems.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-medium">No items added yet</p>
                      <p className="text-xs text-gray-500 mt-1">Search and add products to create an invoice</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals & Actions - Fixed at bottom */}
              {invoiceItems.length > 0 && (
                <div className="border-t-2 border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                  <div className="space-y-2 max-w-xs ml-auto mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Tax (8%)</span>
                      <span className="font-semibold text-gray-900">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 text-sm bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateInvoice}
                      disabled={invoiceItems.length === 0 || !customerName}
                      className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium shadow-lg flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Generate Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingCreate;
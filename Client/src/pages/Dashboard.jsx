import React, { useState, useEffect } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, XCircle, Plus, Download, Upload, Scan, FileText, RefreshCw } from 'lucide-react';
import { getsales, total_revenue, getProducts, products_grouped_by_category } from '../services/Apiservice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [Total_Revenue, setTotalRevenue] = useState(0);
  const [Bill, setBill] = useState(0);
  const [Product, setProduct] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [status, setstatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ✅ All 6 calls run in parallel
        const [res, resbill, lowRes, outRes, inRes, categoryRes] = await Promise.all([
          total_revenue(),
          getsales(),
          getProducts({ status: 'low_stock' }),
          getProducts({ status: 'out_stock' }),
          getProducts({ status: 'in_stock' }),
          products_grouped_by_category(),
        ]);

        setTotalRevenue(res.data.total_revenue);
        setBill(resbill.data.count);

        setstatus({
          low_stock: lowRes.data,
          out_stock: outRes.data,
          in_stock: inRes.data,
        });

        setProduct(inRes.data.count + lowRes.data.count + outRes.data.count);

        // Category stats
        const groupedData = categoryRes.data;
        const counts = Object.entries(groupedData).map(([category, items]) => ({
          category,
          count: items.length,
        }));
        const total = counts.reduce((sum, item) => sum + item.count, 0);
        const stats = counts
          .map(item => ({
            ...item,
            percentage: total ? Number(((item.count / total) * 100).toFixed(1)) : 0,
          }))
          .sort((a, b) => b.percentage - a.percentage);

        setCategoryStats(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ✅ Single loading gate
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // ✅ Derive alerts from status
  const lowStockAlerts = status.low_stock?.results?.map(item => ({
    name: item.product_name,
    sku: `SKU-${item.sku}`,
    quantity: item.quantity,
    status: 'low',
  })) || [];

  const outStockAlerts = status.out_stock?.results?.map(item => ({
    name: item.product_name,
    sku: `SKU-${item.sku}`,
    quantity: item.quantity,
    status: 'out',
  })) || [];

  const stockAlerts = [...outStockAlerts, ...lowStockAlerts];

  // ✅ Product table uses all results combined (no extra API call)
  const allProducts = [
    ...(status.in_stock?.results || []),
    ...(status.low_stock?.results || []),
    ...(status.out_stock?.results || []),
  ].map(item => ({
    name: item.product_name,
    sku: item.sku,
    category: item.category?.name,
    quantity: item.quantity,
    price: item.selling_price,
    status: item.quantity > 10 ? 'in' : item.quantity > 0 ? 'low' : 'out',
  }));

  const palette = [
    "#3b82f6", "#10b981", "#f59e0b",
    "#8b5cf6", "#ef4444", "#06b6d4",
    "#f97316", "#a855f7", "#22c55e"
  ];

  const categoryData = categoryStats.map((item, idx) => ({
    name: item.category,
    value: item.count,
    percentage: item.percentage,
    color: palette[idx % palette.length],
  }));

  const stockMovementData = [
    { month: 'Aug', added: 1200, sold: 950 },
    { month: 'Sep', added: 1400, sold: 1100 },
    { month: 'Oct', added: 1150, sold: 1250 },
    { month: 'Nov', added: 1600, sold: 1350 },
    { month: 'Dec', added: 1800, sold: 1650 },
    { month: 'Jan', added: 1350, sold: 1300 },
  ];

  const recentMovements = [
    { id: 1, product: 'Wireless Mouse', code: 'PO-2024-001', change: '+50 units', date: '2024-01-15 09:30', type: 'in' },
    { id: 2, product: 'USB-C Cable', code: 'SO-2024-089', change: '-25 units', date: '2024-01-15 11:45', type: 'out' },
    { id: 3, product: 'Office Chair', code: 'PO-2024-002', change: '+10 units', date: '2024-01-14 14:20', type: 'in' },
    { id: 4, product: 'Monitor 27"', code: 'SO-2024-090', change: '-5 units', date: '2024-01-14 16:00', type: 'out' },
    { id: 5, product: 'Notebook A5', code: 'PO-2024-003', change: '+100 units', date: '2024-01-13 10:15', type: 'in' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, bgColor, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium mt-2 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-orange-600'}`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              {trendValue}
            </div>
          )}
          {subtitle && (
            <p className={`text-sm font-medium mt-2 ${subtitle.includes('Critical') ? 'text-red-600' : 'text-orange-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={Product}
            icon={Package}
            trend="up"
            trendValue="+12% from last month"
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Inventory Value"
            value={`$${Total_Revenue}`}
            icon={DollarSign}
            trend="up"
            trendValue="+8.2% from last month"
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Low Stock Items"
            value={status.low_stock?.count || 0}
            icon={AlertTriangle}
            color="text-orange-600"
            bgColor="bg-yellow-100"
            subtitle="Needs attention"
          />
          <StatCard
            title="Out of Stock"
            value={status.out_stock?.count || 0}
            icon={XCircle}
            color="text-red-600"
            bgColor="bg-red-100"
            subtitle="Critical"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Stock Movement Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Stock Movement Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stockMovementData}>
                <defs>
                  <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="added" stroke="#10b981" fillOpacity={1} fill="url(#colorAdded)" name="Added" />
                <Area type="monotone" dataKey="sold" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSold)" name="Sold/Used" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Inventory by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to='/inventory' className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" /> Add Product
              </Link>
              <Link to='/inventory' className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-green-700 transition-colors">
                <Download className="w-5 h-5" /> Stock In
              </Link>
              <Link to='/billing' className="flex items-center justify-center gap-2 bg-orange-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-orange-700 transition-colors">
                <Upload className="w-5 h-5" /> Stock Out
              </Link>
              <button className="flex items-center justify-center gap-2 bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 transition-colors">
                <Scan className="w-5 h-5" /> Scan Item
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-700 text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-800 transition-colors">
                <FileText className="w-5 h-5" /> Generate Report
              </button>
              <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-indigo-700 transition-colors">
                <RefreshCw className="w-5 h-5" /> Sync Data
              </button>
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Stock Alerts</h2>
              </div>
              <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                {stockAlerts.length} items
              </span>
            </div>
            <div className="space-y-3">
              {stockAlerts.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${item.status === 'out' ? 'text-red-600' : 'text-orange-600'}`}>
                      {item.quantity} left
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors">
                Create Restock Order
              </button>
            </div>
          </div>
        </div>

        {/* Recent Stock Movements & Product Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Stock Movements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h2>
              <Link to='/billinghistory' className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {movement.type === 'in'
                      ? <TrendingDown className="w-5 h-5 text-green-600 rotate-180" />
                      : <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{movement.product}</p>
                    <p className="text-xs text-gray-500">{movement.code}</p>
                    <p className="text-xs text-gray-400 mt-1">{movement.date}</p>
                  </div>
                  <div className={`text-sm font-semibold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Inventory Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Product Inventory</h2>
              <Link to='/inventory' className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">Product</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">SKU</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">Category</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">Quantity</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">Price</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 px-2 text-sm text-gray-600">{product.sku}</td>
                      <td className="py-3 px-2 text-sm text-gray-600">{product.category}</td>
                      <td className="py-3 px-2">
                        <span className={`font-semibold text-sm ${product.status === 'out' ? 'text-red-600' : product.status === 'low' ? 'text-orange-600' : 'text-gray-900'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-gray-900">${product.price}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === 'in' ? 'bg-green-100 text-green-700' :
                          product.status === 'low' ? 'bg-yellow-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.status === 'in' ? 'In Stock' : product.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
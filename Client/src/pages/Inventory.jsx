import React, { useState, useEffect, use } from "react";
import AddProductModal from "../features/products/Addproduct";
import { getProducts, deleteProduct, updateProduct,getCategories } from "../services/ApiService";
import { buildFilterParams } from "../components/ui/Func";
import {FilterModal} from "../components/ui/Filter"
import {ActionMenu } from "../components/ui/ActionMenu"
import { useFetch } from "../hooks/UseHook";
import StockInPage from "../features/stock/StockIn";




const InventoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilteropen, setIsFilteropen] = useState(false);
  const [InStockopen, setInStockopen] = useState(false);

  const [inventoryData, setInventoryData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  const [productList, setProductList] = useState([]);

  const { data:categories, loading, error } = useFetch(getCategories, []);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    stock_status: "",
    category: [],
    min_price: "",
    max_price: "",
    min_quantity: "",
    max_quantity: "",
    quantity_range: "",
    ordering: "",
  });

  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchInventory = async (page = 1) => {
    try {
      const response = await getProducts({}, page);
      setTotalCount(response.data.count);

      const data = response.data.results || response.data;

      const mappedData = data.map((item) => ({
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
    fetchInventory(currentPage);
  }, [currentPage]);

  const filteredProducts = inventoryData.filter((product) => {
  const query = searchQuery.toLowerCase();
  return (
    product.name.toLowerCase().includes(query) ||
    product.sku.toLowerCase().includes(query)
  );
});

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(itemId);
        fetchInventory(currentPage);
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = async (itemId) => {
    try {
      const response = await getProducts({}, 1);
      const product = response.data.results.find((p) => p.id === itemId);

      setSelectedProduct(product);
      setModalMode("edit");
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error fetching product for edit:", error);
    }
  };

  const defaultFilters = {
    stock_status: "",
    category: [],
    min_price: "",
    max_price: "",
    min_quantity: "",
    max_quantity: "",
    quantity_range: "",
    ordering: "",
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    fetchInventory(1);
  };

  const handleFilterApply = async (incomingFilters) => {
    const params = buildFilterParams(incomingFilters);
    console.log("This one ",params)

    try {
      const response = await getProducts(params);
      console.log("Last : ",response);

      const data = response.data.results || response.data;

      const mappedData = data.map((item) => ({
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
      setTotalCount(response.data.count);
      setCurrentPage(1);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getStatusColor = (status) => {
    if (status === "In Stock") return "text-green-500";
    if (status === "Low Stock") return "text-amber-500";
    if (status === "Out of Stock") return "text-red-500";
    return "text-gray-500";
  };

  const getQuantityColor = (quantity) => {
    if (quantity === 0) return "text-red-500";
    if (quantity < 15) return "text-amber-500";
    return "text-gray-800";
  };

  return (
    <div className="p-3.5 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-3.5">
        <div className="relative w-96">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-3.5 pl-11 rounded-lg border border-gray-200 outline-none text-sm bg-white"
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsFilteropen(true)} 
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-2"
          >
            <span>🔽</span>Filter
          </button>
          
          <FilterModal
            isOpen={isFilteropen}
            onClose={() => setIsFilteropen(false)}
            categories={categories}
            onApplyFilter={handleFilterApply}
          />
          
          <button 
            onClick={clearFilters}
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium cursor-pointer"
          >
            Clear Filters
          </button>

          <button 
            onClick={() => {
              setInStockopen(true);
            }} 
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium cursor-pointer"
          >
            Stock in
          </button>
            <StockInPage
            isOpen={InStockopen}
            onClose={()=>setInStockopen(false)}
            head ="Stock in"

            />
          <button 
            onClick={() => {
              setModalMode("add");
              setSelectedProduct(null);
              setIsModalOpen(true);
            }} 
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium cursor-pointer"
          >
            + Add Product
          </button>

          <AddProductModal
            isOpen={isModalOpen}
            head={modalMode === "edit" ? "Edit Product" : "Add New Product"}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
            mode={modalMode}
            product={selectedProduct}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                PRODUCT NAME
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                SKU
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                CATEGORY
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selling Price
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Purchase Price
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                QUANTITY
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                STATUS
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ACTIONS
              </th>
            </tr>
          </thead>
          
          <tbody>
            {inventoryData.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-gray-200 transition-colors hover:bg-gray-50"
              >
                <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                  {item.name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {item.sku}
                </td>
                <td className="py-4 px-6">
                  <span className="py-1 px-3 bg-gray-100 rounded-md text-xs text-gray-600">
                    {item.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                  ${item.Sp}
                </td>
                <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                  ${item.Pp}
                </td>
                <td className={`py-4 px-6 text-sm ${item.quantity < 15 ? 'font-semibold' : 'font-normal'} ${getQuantityColor(item.quantity)}`}>
                  {item.quantity}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <ActionMenu
                    itemId={item.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between py-4 px-6 border-t border-gray-200">
          <span>Showing {start} – {end} of {totalCount} entries</span>

          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              className="py-2 px-4 bg-white border border-gray-200 rounded-md text-gray-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            
            {[...Array(totalPages || 0)].map((_, index) => {
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
    </div>
  );
};

export default InventoryPage;
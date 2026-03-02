import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AddProductModal from "../features/products/Addproduct";
import { getProducts, deleteProduct } from "../services/Apiservice";
import { buildFilterParams } from "../components/ui/Func";
import { FilterModal } from "../components/ui/Filter";
import { ActionMenu } from "../components/ui/ActionMenu";
import StockInPage from "../features/stock/StockIn";
import { useCategories, useSuppilier } from "../hooks/UseHook";

const PAGE_SIZE = 10;

const mapProduct = (item) => ({
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
});

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

const getStatusStyle = (status) => {
  if (status === "In Stock") return "bg-green-100 text-green-700";
  if (status === "Low Stock") return "bg-yellow-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const getQuantityColor = (quantity) => {
  if (quantity === 0) return "text-red-500 font-semibold";
  if (quantity < 15) return "text-amber-500 font-semibold";
  return "text-gray-800";
};

const InventoryPage = () => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { categories } = useCategories();
  const { suppliers } = useSuppilier();

  // ✅ React Query: fetch + cache products by page + filters
  const { data, isFetching } = useQuery({
    queryKey: ["products", currentPage, activeFilters],
    queryFn: async () => {
      const params = buildFilterParams(activeFilters);
      const response = await getProducts(params, currentPage);
      const results = response.data.results || response.data;
      return {
        products: results.map(mapProduct),
        totalCount: response.data.count || 0,
      };
    },
    keepPreviousData: true, // ✅ Keeps old data visible while fetching next page
    staleTime: 1000 * 60 * 2, // ✅ Cache considered fresh for 2 minutes
  });

  const inventoryData = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalCount);

  // ✅ Prefetch next page for snappy pagination
  const prefetchNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["products", currentPage + 1, activeFilters],
        queryFn: async () => {
          const params = buildFilterParams(activeFilters);
          const response = await getProducts(params, currentPage + 1);
          const results = response.data.results || response.data;
          return {
            products: results.map(mapProduct),
            totalCount: response.data.count || 0,
          };
        },
        staleTime: 1000 * 60 * 2,
      });
    }
  }, [currentPage, totalPages, activeFilters, queryClient]);

  // ✅ Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (itemId) => deleteProduct(itemId),
    onMutate: async (itemId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products", currentPage, activeFilters] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(["products", currentPage, activeFilters]);

      // Optimistically remove from cache
      queryClient.setQueryData(["products", currentPage, activeFilters], (old) => ({
        ...old,
        products: old.products.filter((p) => p.id !== itemId),
        totalCount: old.totalCount - 1,
      }));

      return { previousData };
    },
    onError: (_err, _itemId, context) => {
      // Rollback on failure
      queryClient.setQueryData(
        ["products", currentPage, activeFilters],
        context.previousData
      );
      alert("Failed to delete product");
    },
    onSettled: () => {
      // Always refetch after mutation settles to sync with server
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    deleteMutation.mutate(itemId);
  };

  const handleEdit = (itemId) => {
    const product = inventoryData.find((p) => p.id === itemId);
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // ✅ Invalidate cache so fresh data is fetched after add/edit
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleFilterApply = (incomingFilters) => {
    setActiveFilters(incomingFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
    // ✅ Invalidate old filter queries so new ones are fetched fresh
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const clearFilters = () => {
    setActiveFilters(defaultFilters);
    setSearchQuery("");
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  // ✅ Client-side search on current page data
  const displayedProducts = inventoryData.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  });

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="p-3.5 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-3.5 flex-wrap gap-3">
        <div className="relative w-96">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-3.5 pl-11 rounded-lg border border-gray-200 outline-none text-sm bg-white"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50"
          >
            🔽 Filter
          </button>

          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categories={categories}
            onApplyFilter={handleFilterApply}
          />

          <button
            onClick={clearFilters}
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Clear Filters
          </button>

          <button
            onClick={() => setIsStockInOpen(true)}
            className="py-2.5 px-5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Stock In
          </button>

          <StockInPage
            isOpen={isStockInOpen}
            onClose={() => {
              setIsStockInOpen(false);
              queryClient.invalidateQueries({ queryKey: ["products"] });
            }}
            head="Stock In"
            categories={categories}
            suppliers={suppliers}
          />

          <button
            onClick={() => {
              setModalMode("add");
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="py-2.5 px-5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Product
          </button>

          <AddProductModal
            isOpen={isModalOpen}
            head={modalMode === "edit" ? "Edit Product" : "Add New Product"}
            onClose={handleModalClose}
            mode={modalMode}
            product={selectedProduct}
            categories={categories}
            suppliers={suppliers}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Product Name", "SKU", "Category", "Selling Price", "Purchase Price", "Quantity", "Status", "Actions"].map((h) => (
                <th key={h} className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : displayedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              displayedProducts.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">{item.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{item.sku}</td>
                  <td className="py-4 px-6">
                    <span className="py-1 px-3 bg-gray-100 rounded-md text-xs text-gray-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">${item.Sp}</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">${item.Pp}</td>
                  <td className={`py-4 px-6 text-sm ${getQuantityColor(item.quantity)}`}>
                    {item.quantity}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
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
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center py-4 px-6 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Showing {totalCount === 0 ? 0 : start}–{end} of {totalCount} entries
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="py-2 px-3 bg-white border border-gray-200 rounded-md text-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              «
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="py-2 px-4 bg-white border border-gray-200 rounded-md text-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                onMouseEnter={prefetchNextPage} // ✅ Prefetch on hover
                className={`py-2 px-4 border border-gray-200 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              onMouseEnter={prefetchNextPage} // ✅ Prefetch on hover
              className="py-2 px-4 bg-white border border-gray-200 rounded-md text-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="py-2 px-3 bg-white border border-gray-200 rounded-md text-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
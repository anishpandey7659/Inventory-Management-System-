import React, { useEffect, useState } from "react";
import { createProduct,updateProduct } from "../../services/ApiService";
import { useCategories,useSuppilier } from "../../hooks/UseHook";

import { CreateCategoryModal } from "./CreateCategory"
import { CreateSupplierModal } from "./CreateSupplier"


const AddProductModal = ({ isOpen, onClose, head, mode = "add", product = null }) => {
  const { data: suppliers, loadingSup, errorSup  } =useSuppilier();
  const { data: categories, loading, error } = useCategories();
  console.log("Start categories: ",categories);


  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [PP, setPP] = useState("");
  const [SP, setSP] = useState("");
  const [quantity, setQuantity] = useState("");

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateSupplier, setShowCreateSupplier] = useState(false);

  const purchasePrice = Number(PP);
  const sellingPrice = Number(SP);
  const profit = purchasePrice && sellingPrice ? (sellingPrice - purchasePrice).toFixed(2) : 0;
  const profitMargin = purchasePrice ? (((sellingPrice - purchasePrice) / purchasePrice) * 100).toFixed(2) : 0;
  const isEdit = mode === "edit"

  
  useEffect(() => {
    if (mode === "edit" && product) {
      setName(product.product_name);
      setSku(product.sku);
      setCategory(product.category?.id || "");
      setSupplier(product.supplier?.id || "");
      setQuantity(product.quantity);
      setPP(product.purchase_price);
      setSP(product.selling_price);
    }
  }, [mode, product]);

  const resetForm = () => {
    setName("");
    setSku("");
    setCategory("");
    setSupplier("");
    setQuantity("");
    setPP("");
    setSP("");
    setSuccessMsg("");
    setErrorMsg("");
  };

    const handleCategoryChange = (e) => {
      const value = e.target.value;
      if (value === 'create_new') {
        setShowCreateCategory(true);
      } else {
        setCategory(value);
      }
    };

    const handleSupplierChange = (e) => {
      const value = e.target.value;
      if (value === 'create_new') {
        setShowCreateSupplier(true);
      } else {
        setSupplier(value);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!supplier || !category) {
    //   setErrorMsg("Please select supplier and category");
    //   return;
    // }

    const productData = {
      product_name: name,
      selling_price: SP,
      purchase_price: PP,
      category: Number(category),
      supplier: Number(supplier),
      quantity: Number(quantity),
      sku: sku,
    };
    console.log(productData)
    try {
      if (mode === "edit") {
        await updateProduct(product.id, productData);
        setSuccessMsg("Product updated successfully!");
      } else {
        await createProduct(productData);
        setSuccessMsg("Product created successfully!");
      }

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1200);

    } catch (err) {
      const errors = err.response?.data;
      let errorText = "Something went wrong.";
      console.log(err.response.data)
      setErrorMsg(err.response.data);
    }
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
    <div className="bg-white rounded-xl w-[90%] max-w-[700px] max-h-[90vh] overflow-auto shadow-2xl">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="m-0 text-[22px] font-semibold text-gray-800">
          {head}
        </h2>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-2xl text-gray-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 py-2.5 px-3.5 rounded-lg mb-4 text-sm">
          ✅ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-600 border border-green-200 text-gray-50 py-2.5 px-3.5 rounded-lg mb-4 text-sm">
          ❌ {errorMsg}
        </div>
      )}

      <form className="p-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="create_new" className="font-semibold text-blue-500">
                + Create New Category
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (optional)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder=""
              disabled={isEdit}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Price
            </label>
            <input
              type="number"
              step="0.01"
              value={PP}
              placeholder="0.00"
              onChange={(e) => setPP(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price
            </label>
            <input
              type="number"
              value={SP}
              step="0.01"
              onChange={(e) => setSP(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {PP && SP && (
          <div className={`rounded-lg py-3 px-4 mb-5 ${
            profit >= 0 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <span>Profit: </span>
                <strong>${profit}</strong>
              </div>
              <div>
                <span>Margin: </span>
                <strong>{profitMargin}%</strong>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier
          </label>
          <select
            value={supplier}
            onChange={handleSupplierChange}
            className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Supplier</option>
            {suppliers?.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
            <option value="create_new">+ Create New Supplier</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="py-2.5 px-6 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="py-2.5 px-6 bg-blue-500 border-none rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-blue-600"
          >
            {mode === "edit" ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>

    <CreateCategoryModal
      isOpen={showCreateCategory}
      onClose={() => setShowCreateCategory(false)}
    />

    <CreateSupplierModal
      isOpen={showCreateSupplier}
      onClose={() => setShowCreateSupplier(false)}
    />
  </div>
);
};


// export default Add;
export default AddProductModal;
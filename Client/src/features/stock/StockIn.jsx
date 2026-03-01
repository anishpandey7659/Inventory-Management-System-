import AddProductModal from "../products/Addproduct";
import { getProducts,createStockIn,getCategories,getSuppliers } from "../../services/ApiService";
import { useCategories,useSuppilier } from "../../hooks/UseHook";
import { useFetch } from "../../hooks/UseHook";
import { useState } from "react";

// Stockin
export default function StockInPage({isOpen, onClose,head,categories,suppliers}) {
  const [name,setName]=useState('');
  const [product, setproduct] = useState("");
  const [Supplier, setSupplier] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchase_price, setPurchase_price] = useState("");
  const { data, loading, error } = useFetch(getProducts, []);
  const [successMsg,setSuccessMsg]=useState('')
  const [errorMsg,setErrorMsg]=useState('')
  const [showCreateProduct,setshowCreateProduct]=useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);


  if (loading) return null;
  if (error) return null;
  // console.log("test: ",data);
  const productNames = data?.map(p => p.product_name);


  const handleProductChange = (e) => {
    const value = e.target.value;
      if (value === 'create_new') {
        setshowCreateProduct(true)
      } 
      else {
        setproduct(value);
      }
    };
  const resetForm = () => {
  setproduct("");
  setPurchase_price("");
  setQuantity("");
  setSupplier("");
};

  const handleSupplierChange = (e) => {
      const value = e.target.value;
      setSupplier(value);
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!product || !quantity ) {
          setErrorMsg("Please select all ");
          return;
        }
    
        const productData = {
          product: product, 
          purchase_price: purchase_price,
          quantity: quantity,
          supplier:Supplier
        
        };
        console.log(productNames);

    
        try {
            await createStockIn(productData);
            setSuccessMsg("Product created successfully!");
            setTimeout(() => {
            resetForm();
            onClose();
          }, 1200);
    
        } catch (err) {
          const errors = err.response?.data;
          let errorText = "Something went wrong.";
          if (errors) {
            errorText = Object.entries(errors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join(" | ");
          }
          setErrorMsg(errorText);
        }
      };

if (!isOpen) return null;



return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
    <div className="bg-white rounded-xl w-[90%] max-w-[700px] max-h-[90vh] overflow-auto shadow-2xl">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="m-0 text-[22px] font-semibold text-gray-800">
          Stock In
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

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 mb-3">
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>

            <select
              value={product}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "create_new") {
                  // Open modal to create new product
                  setModalMode("add");
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                  // Reset product selection
                  setproduct("");
                  return;
                }

                // Set selected product normally
                setproduct(value);
                // Only call handleProductChange if it exists
                if (typeof handleProductChange === 'function') {
                  handleProductChange(e);
                }
              }}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>

              {data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name}
                </option>
              ))}

              <option value="create_new">
                + Create New Product
              </option>
            </select>

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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>
            <select
              value={Supplier}
              onChange={handleSupplierChange}
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        
        </div>
          
        <div className="grid grid-cols-1 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity 
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              step="1"
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price 
            </label>
            <input
              type="number"
              value={purchase_price}
              onChange={(e) => setPurchase_price(e.target.value)}
              placeholder="Enter purchase price"
              min="0"
              step="0.01"
              className="w-full py-2.5 px-3.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              resetForm();
              if (typeof onClose === 'function') {
                onClose();
              }
            }}
            className="py-2.5 px-6 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 px-6 bg-blue-500 border-none rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>



  </div>
);
};
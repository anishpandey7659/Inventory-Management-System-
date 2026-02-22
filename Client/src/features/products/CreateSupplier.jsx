import { useState } from "react";
import { usePost } from "../../hooks/UseHook";
import { createSupplier , getCategories, getSuppliers } from "../../services/ApiService";


export const CreateSupplierModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setsuccessMsg] = useState('');
  const { loading: postLoading, error: postError, success, postData } = usePost(createSupplier);

  const handleSave = async(e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Supplier name is required');
      return;
    }
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    const supplier_data={name:name,phone:phone,email:email,address:address}
    try{
      const response =await postData(supplier_data)
      console.log("Success:", response);
      if (response){
        setsuccessMsg("Sucessfully created");
        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setError("");
        onClose();
        setTimeout(() => setsuccessMsg(""), 2000);
      }

    }catch(err){
      setError("Failed to create Supplier")
      console.log("Error:", err.response?.data || err.message);
    }
  };


  if (!isOpen) return null;

  return (
    <div style={{position: 'fixed',top: 0,left: 0,right: 0,bottom: 0,background: 'rgba(0, 0, 0, 0.6)',display: 'flex',alignItems: 'center',justifyContent: 'center',zIndex: 2000}}>
      <div style={{background: 'white',borderRadius: '12px',width: '90%',maxWidth: '500px',boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'}}>
        <form onSubmit={handleSave}>
          <div style={{padding: '20px 24px',borderBottom: '1px solid #e5e7eb',display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              Create New Supplier
            </h3>
              <button
              onClick={() => {
                onClose();
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setError('');
              }}
              style={{
                background: 'transparent',border: 'none',fontSize: '24px',color: '#9ca3af',cursor: 'pointer',padding: '0'
              }}
              >×</button>
        </div>

        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: '#fef2f2',border: '1px solid #fecaca',color: '#dc2626',padding: '10px 14px',borderRadius: '8px',marginBottom: '16px',fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}
          {successMsg && (
            <div style={{
              background: '#fef2f2',border: '1px solid #fecaca',color: '#dc2626',padding: '10px 14px',borderRadius: '8px',marginBottom: '16px',fontSize: '14px'
            }}>
              ❌ {successMsg}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',fontSize: '14px',fontWeight: '500',color: '#374151',marginBottom: '8px'
            }}>Supplier Name *</label>
            <input
              type="text"value={name}onChange={(e) => setName(e.target.value)}placeholder="e.g., ABC Suppliers"
              style={{
                width: '100%',padding: '10px 14px',border: '1px solid #d1d5db',borderRadius: '8px',fontSize: '14px',outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',fontSize: '14px',fontWeight: '500',color: '#374151',marginBottom: '8px'
            }}>Phone</label>
            <input
              type="tel"value={phone} onChange={(e) => setPhone(e.target.value)}placeholder="e.g., +1 234 567 8900"maxLength={15}
              style={{
                width: '100%',padding: '10px 14px',border: '1px solid #d1d5db',borderRadius: '8px',fontSize: '14px',outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',fontSize: '14px',fontWeight: '500',color: '#374151',marginBottom: '8px'
            }}>Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}placeholder="supplier@example.com"
              style={{
                width: '100%',padding: '10px 14px',border: '1px solid #d1d5db',borderRadius: '8px',fontSize: '14px',outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',fontSize: '14px',fontWeight: '500',color: '#374151',marginBottom: '8px'
            }}>Address</label>
            <textarea
              value={address} onChange={(e) => setAddress(e.target.value)}placeholder="123 Main St, City, Country"rows={3}
              style={{
                width: '100%',padding: '10px 14px',border: '1px solid #d1d5db',borderRadius: '8px',fontSize: '14px',outline: 'none',resize: 'vertical',fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{
            display: 'flex',justifyContent: 'flex-end',gap: '12px'
          }}>
            <button
              onClick={() => {
                onClose();
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setError('');
              }}
              style={{
                padding: '10px 20px',background: 'white',border: '1px solid #d1d5db',borderRadius: '8px',color: '#374151',fontSize: '14px',fontWeight: '500',cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',background: '#10b981',border: 'none',borderRadius: '8px',color: 'white',fontSize: '14px',fontWeight: '500',cursor: 'pointer'
              }}
            >
              Create Supplier
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};
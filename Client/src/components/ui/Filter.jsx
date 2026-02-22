import { useState } from "react";


export const FilterModal = ({ isOpen, onClose, onApplyFilter, categories }) => {
  const [Selectedorder, setSelectedorder] = useState([]);
  const [SelectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [quantityFilter, setQuantityFilter] = useState('');
  const [ordering, setOrdering] = useState('');
  const [Products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    stock_status: '',
    category: [],
    min_price: '',
    max_price: '',
    min_quantity:'',
    max_quantity:'',
    quantity_range: '',
    ordering: '',
  });

  const orderOptions = ['selling_price', '-selling_price', 'purchase_price','-purchase_price','quantity','-quantity'];
  

  const ordeingValue= [
    { label: 'Default', value: '' },
    { label: 'Selling Price (Asc)↑', value: 'selling_price' },
    { label: 'Selling Price (desc) ↓', value: '-selling_price' },
    { label: 'Purchase Price (Asc) ↑', value: 'purchase_price' },
    { label: 'Purchase Price (desc) ↓', value: '-purchase_price' },
    { label: 'Quantity (Asc) ↑', value: 'quantity' },
    { label: 'Quantity (desc) ↓', value: '-quantity' }
  ];

  const handleOrderToggle = (status) => {
    setSelectedorder(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };





  const handleApply = () => {
    onApplyFilter({
      categories: SelectedCategories,
      priceRange,
      quantityFilter,
      ordering,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedorder([]);
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setQuantityFilter('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>Filter Products</h2>
          
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1
            }}
          >×</button>
        </div>

        {/* Filter Content */}
        <div style={{ padding: '24px' }}>
          
          {/* Odering Filter  */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{fontSize: '14px',fontWeight: '600',color: '#374151',marginBottom: '12px',textTransform: 'uppercase',letterSpacing: '0.5px'}}>Ordering price and quality</h3>
                <select value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  style={{
                    width: '100%',padding: '12px 14px',border: '1px solid #e5e7eb',borderRadius: '8px',fontSize: '14px',
                    outline: 'none',background: 'white',cursor: 'pointer',color: '#6b7280'
                  }}
                >
                  {ordeingValue.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>CATEGORIES</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories?.map(category => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryToggle(category)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${SelectedCategories.includes(category) ? '#3b82f6' : '#e5e7eb'}`,
                    background: SelectedCategories.includes(category) ? '#eff6ff' : 'white',
                    color: SelectedCategories.includes(category) ? '#3b82f6' : '#6b7280',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: SelectedCategories.includes(category) ? '500' : '400',
                    transition: 'all 0.2s'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>PRICE RANGE</h3>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#6b7280'
                }}
              />
              <span style={{ color: '#6b7280', fontWeight: '500' }}>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#6b7280'
                }}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          gap: '12px'
        }}>
          <button
            onClick={handleClear}
            style={{
              padding: '12px 24px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleApply}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

import { useState } from "react";
import { Package ,Plus,X} from "lucide-react";
import  { useRef,useEffect } from 'react';

export const ActionMenu = ({ itemId, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    onEdit(itemId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(itemId);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#6b7280',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        ⋮
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: '4px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          minWidth: '140px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <button
            onClick={handleEdit}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '16px', color: '#3b82f6' }}>✏️</span>
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#374151';
            }}
          >
            <span style={{ fontSize: '16px', color: '#ef4444' }}>🗑️</span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};




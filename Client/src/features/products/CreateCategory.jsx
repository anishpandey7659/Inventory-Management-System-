import { usePost } from "../../hooks/UseHook";
import { createCategory } from "../../services/ApiService";
import { getCategories,getSuppliers } from "../../services/ApiService";
import { useState } from "react";


export const  CreateCategoryModal = ({ isOpen, onClose}) => {
  const { loading, error, success, postData } = usePost(createCategory);
  const [cat,setcat]=useState('')
  const [slug,setslug]=useState('')
  const [errormsg, setErrorMsg] = useState('');
  const [sucessmsg,setsuccessMsg] =useState('')


  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setcat(value);
    if (!slug || slug === generateSlug(cat)) {
      setslug(generateSlug(value));
    }
  };

const handleSave = async (e) => {
    e.preventDefault();

    if (!cat.trim()) {
      setErrorMsg("Category name is required");
      return;
    }

    const catdata = {
      name: cat,
      slug: slug || generateSlug(cat),
    };

    try {
      const response = await postData(catdata);
      console.log("Success:", response);

      if (response) {
        setsuccessMsg("Successfully created!");
        setcat("");
        setslug("");
        onClose();

        setTimeout(() => setsuccessMsg(""), 2000);
      }
    } catch (err) {
      setErrorMsg("Failed to create category");
      console.log("Error:", err.response.data);
    }
  };

  if (!isOpen) return null;

  return (
  <div
    style={{position: "fixed",top: 0,left: 0,right: 0,bottom: 0,background: "rgba(0, 0, 0, 0.55)",display: "flex",alignItems: "center",justifyContent: "center",zIndex: 2000,}}
  >
    <div
      style={{background: "white",borderRadius: "14px",width: "90%",maxWidth: "520px",boxShadow: "0 25px 60px rgba(0, 0, 0, 0.18)",overflow: "hidden",}}
    >
      <form onSubmit={handleSave}>
        <div
          style={{  padding: "22px 24px",borderBottom: "1px solid #e5e7eb",display: "flex",justifyContent: "space-between",alignItems: "center",gap: "12px",}}
        >
          <h3
            style={{margin: 0,fontSize: "20px",fontWeight: "650",color: "#1f2937",}}
          >
            Create New Category
          </h3>

          <button
            type="button"
            title="Close"
            onClick={() => {onClose();setcat("");setslug("");setErrorMsg("");}}
            style={{background: "transparent",border: "none",fontSize: "26px",color: "#111827",cursor: "pointer",padding: "0 6px",lineHeight: 1,}}
          >×
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {errormsg && (
            <div
              style={{background: "#fff1f2",border: "1px solid #fecaca",color: "#b91c1c",
                padding: "10px 14px",borderRadius: "10px",marginBottom: "16px",fontSize: "14px",
              }}
            >
              ❌ {errormsg}
            </div>
          )}
          {sucessmsg && (
            <div
              style={{background: "#fff1f2",border: "1px solid #fecaca",color: "#b91c1c",
                padding: "10px 14px",borderRadius: "10px",marginBottom: "16px",fontSize: "14px",
              }}
            >
              ❌ {sucessmsg}
            </div>
          )}

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{display: "block",fontSize: "14px",fontWeight: "600",color: "#374151",marginBottom: "8px",}}
            >
              Category Name *
            </label>
            <input
              type="text"
              value={cat}
              onChange={handleNameChange}
              placeholder="e.g., Electronics"
              style={{width: "100%",padding: "12px 14px",border: "1px solid #d1d5db",borderRadius: "10px",fontSize: "14px",outline: "none",transition: "0.2s",}}
              onFocus={(e) => (e.target.style.borderColor = "#60a5fa")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{display: "block",fontSize: "14px",fontWeight: "600",color: "#374151",marginBottom: "8px",}}
            >
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setslug(e.target.value)}
              placeholder="auto-generated-slug"
              style={{width: "100%",padding: "12px 14px",border: "1px solid #d1d5db",borderRadius: "10px",fontSize: "14px",outline: "none",background: "#f9fafb",transition: "0.2s",}}
              onFocus={(e) => (e.target.style.borderColor = "#60a5fa")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
            <p style={{fontSize: "12px",color: "#6b7280",margin: "6px 0 0 0",}}>
              Auto-generated from name, or customize
            </p>
          </div>

          <div
            style={{display: "flex",justifyContent: "flex-end",gap: "12px",}}
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                setcat("");
                setslug("");
                setErrorMsg("");
              }}
              style={{
                padding: "10px 22px",background: "white",border: "1px solid #d1d5db",borderRadius: "10px",color: "#374151",fontSize: "14px",
                fontWeight: "600",cursor: "pointer",transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{padding: "10px 22px",background: "#10b981",border: "none",borderRadius: "10px",color: "white",fontSize: "14px",fontWeight: "600",cursor: "pointer",transition: "0.2s",}}
              onMouseEnter={(e) => (e.target.style.background = "#0f9a70")}
              onMouseLeave={(e) => (e.target.style.background = "#10b981")}
            >
              Create Category
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);

};
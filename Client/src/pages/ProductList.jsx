import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/ApiService';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      const productsData = response.data.results || response.data;
    //   console.log("Respone =>",response)
      console.log("Products data =>",productsData[0])
      console.log("supplier =>",productsData[0]['supplier'])
      console.log("category =>",productsData[0]['category'])

      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts(); // Refresh list
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
<ul>
  {products.map(product => (
    <li key={product.id}>
      {product.product_name} - ${product.selling_price} - Quality: {product.quantity}

      <br />
      Category: {product.category.name}
      <br />
      Supplier: {product.supplier.name},Phone : {product.supplier.phone},Email : {product.supplier.email}
    </li>
  ))}
    </ul>

    </div>
  );
}

export default ProductList;

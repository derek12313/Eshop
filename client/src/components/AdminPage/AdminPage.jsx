import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

export default function AdminPage({ userName, onLogout }) {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products (same as ProductPage)
    fetch('https://fakestoreapi.com/products')
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      const newCategory = new Set(prev);
      if (newCategory.has(category)) {
        newCategory.delete(category);
        console.log(`toggled ${category} to off`);
      } else {
        newCategory.add(category);
        console.log(`toggled ${category} to on`);
      }
      return newCategory;
    });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  if (!products) return <div>Loading product info...</div>;

  return (
    <div className="admin-page">
      <header className="header">
        <div className="greeting">Hello, {userName}</div>
        <div className="header-right">
          <button onClick={() => alert("TODO: bring user to create item page")}>Add New Item</button>
          <button onClick={() => alert("TODO: bring user to remove item page")}>Remove Item</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="content-wrapper">
        <main className="admin-product-list">
          <h2>Product Management</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>
                    <button onClick={() => alert(`TODO: bring user to update product page for product ${product.id}`)}>Update</button>
                    {/* {TODO: bring the admin to the update page*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

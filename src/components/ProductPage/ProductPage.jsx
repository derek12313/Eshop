import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductPage.css';

export default function ProductPage({ userName, onLogout, addToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

// TODO: fetch from database instead
  useEffect(() => {
    console.log("fetching product...");
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);
  
  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = {};
      products.forEach(p => {
        initialQuantities[p.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const handleAddToCart = (product) => {
    const quantityToAdd = quantities[product.id] || 1;
    addToCart(product, quantityToAdd);
  };

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
    console.log("user logging out");
    navigate('/login', { replace: true });
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(product.category);
    const searchMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  
  return (
    <div className="product-page">
      <header className="header">
        <div className="greeting">Hello, {userName}</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <Link to="/cart" className="cart-icon" title="Go to cart">
            <img src="/src/img/shopping-cart-outline-svgrepo-com.svg" alt="Shopping Cart" />
          </Link>
        </div>
      </header>


      <div className="content-wrapper">
        <aside className="sidebar">
          <h3>Filter by Category</h3>
          <div className="category-list">
            {categories.map(category => (
              <label key={category} className="category-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </div>

          <h3>Search Products</h3>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </aside>

        <main className="product-list">
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <img src={product.image} alt={product.title} className="product-image" />
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">${product.price}</p>
                </Link>
              
                <div className="add-to-cart">
                  {/* TODO: notify the user the item has been added successfully */}
                  <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantities[product.id] || 1}
                    onChange={(e) => {
                      let val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) val = 1;
                      if (val > 50) val = 50;
                      setQuantities(prev => ({ ...prev, [product.id]: val }));
                    }}
                    className="quantity-input"
                  />
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

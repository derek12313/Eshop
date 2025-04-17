import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductPage.css';

export default function ProductPage({ userName, onLogout }) {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]); 
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

  const addToCart = (product) => {
    const quantityToAdd = quantities[product.id] || 1;
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantityToAdd, 50);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: Math.min(quantityToAdd, 50) }];
      }
    });
    // printCart won't print the last product added to the cart for some reason
    printCart();
  };
  
  const printCart = () => {
    console.log('Cart Contents:');
    if (cart.length === 0) {
      console.log('The cart is empty.');
      return;
    }
    cart.forEach(item => {
      console.log(`- ${item.title} (ID: ${item.id}): Quantity = ${item.quantity}, Price per item = $${item.price}`);
    });
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
                <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
                <img src={product.image} alt={product.title} className="product-image" />
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price}</p>

                {/* Add to Cart field */}
                <div className="add-to-cart">
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
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
              </Link>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

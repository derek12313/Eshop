import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductInfoPage.css';

export default function ProductInfoPage({ userName, onLogout, addToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [productId, navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (!product) return <div>Loading product info...</div>;

  return (
    <div className="product-info-page">
      <header className="header">
        <div className="greeting">Hello, {userName}</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <Link to="/cart" className="cart-icon" title="Go to cart">
            <img src="/src/img/shopping-cart-outline-svgrepo-com.svg" alt="Shopping Cart" />
          </Link>
        </div>
      </header>

      <main className="product-info-content">
        <div className="image-container">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="details-container">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-category"><strong>Category:</strong> {product.category}</p>
          <p className="product-price"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          {/* Quantity input and Add to Cart button */}
          <div className="add-to-cart">
            <input
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={e => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 50) val = 50;
                setQuantity(val);
              }}
              className="quantity-input"
            />
            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>

          <Link to="/" className="back-link">← Back to Products</Link>
        </div>
      </main>
    </div>
  );
}

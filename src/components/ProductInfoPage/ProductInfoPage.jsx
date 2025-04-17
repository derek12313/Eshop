import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductInfoPage.css';

export default function ProductInfoPage({ userName, onLogout }) {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`[ProductInfoPage]: fetching product with id ${productId}`);
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => {
        console.log(`[ProductInfoPage]: product with id ${productId} not found`);
        navigate('/', { replace: true });
      });
  }, [productId, navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  if (!product) return <div>Loading product info...</div>;

  return (
    <div className="product-info-page">
      {/* Maybe we should use outlet instead of copying the header but I'm too lazy to do it */}
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
          <Link to="/" className="back-link">go back to products</Link>
        </div>
      </main>
    </div>
  );
}

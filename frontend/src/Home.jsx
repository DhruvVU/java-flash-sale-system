import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './styles/Home.css';
import api from './api';

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get('/api/flashsale/products');
        const sortedData =  response.data.sort((a, b) => a.id - b.id);
        setProducts(sortedData);

        const auth = sessionStorage.getItem('isAuthenticated');
        const role = sessionStorage.getItem('role');
        const user = sessionStorage.getItem('username');

        // Check if already logged in
        if (auth == 'true' && role == 'CUSTOMER') {
          setIsLoggedIn(true);
          setUsername(user || "Customer");
        }

      } catch(error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProduct();
  }, []); // run once

  // Handle Buy Click
  const handleBuy = async (productId) => {
    try {
      const userId = sessionStorage.getItem('userId');

      if (!isLoggedIn || userId === null) {
        alert("Please login to buy items");
        navigate("/customerLogin");
        return;
      }

      const response = await api.post(`/api/flashsale/buy?userId=${userId}&productId=${productId}`);
      alert(response.data); 

      window.location.reload();

    } catch (error) {
      console.error("Purchase Error: ", error);
      alert("Purchase Failed");
    }
  };

  return (
    <div className="app-wrapper">

      {/* Header content */}
      <header className="site-header">

        <div className="container header-inner">
          <div 
            className="logo"
            onDoubleClick={() => navigate('/AdminLogin')}
            style={{cursor: 'pointer'}}
            title='Double click for admin'
          >
            ⚡ FlashSale
          </div>
          <div className="header-subtitle">Live Deals Ending soon</div>  
          <div className="nav-buttons" style={{ display: 'flex', gap: '15px',alignItems: 'center'}}>
            {isLoggedIn ? (
              <>
                <span style={{ color: 'white', fontWeight: 'bold', marginRight: '10px' }}>
                  Hello, {username}!
                </span>
                  <button 
                    className='login-btn'  
                    onClick={() => navigate('/customer-dashboard')}
                  >
                    My Orders
                  </button>

                  <button 
                    className='logout-btn'
                    onClick={() => {
                      sessionStorage.clear();
                      setIsLoggedIn(false);
                      window.location.reload()
                    }}
                  > 
                    Logout
                  </button>
              </>
            ) : (
              <button 
                className='login-btn'
                onClick={() => navigate("/customerLogin")}
              >
                Login
              </button>
            )}
          </div>
        </div>

      </header>

      {/* Main Content */}
      <main className="main-content">

        <div className="container">

          <h1 className='page-title'>
            Trending Now
          </h1>

          <div className="grid-container">
            {products.map((product) => (
              <div key={product.id} className="card">
                <div className="image-container">
                  <img 
                    src={product.imageUrl || "https://via.placeholder.com/300"} 
                    alt={product.name} 
                    className="product-image" />
                </div>

                <div className="card-details">
                  <h2>{product.name}</h2>

                  <p className="price">
                    {new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 0}).format(product.price)}
                  </p>

                  <div className={`stock-badge ${product.stockQuantity < 10 ? "low-stock" : ""}`}>
                    {product.stockQuantity > 0 
                      ? `${product.stockQuantity} Units Left`
                      : "Out of Stock"
                    }
                  </div>

                  <button
                    onClick={() => handleBuy(product.id)}
                    disabled={product.stockQuantity <= 0}
                    className={product.stockQuantity > 0 ? "buy-btn" : "sold-out-btn"}
                  >
                    {product.stockQuantity > 0 ? "Buy Now" : "Sold Out"}
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>

      </main>

    </div>
  );
}

export default Home;
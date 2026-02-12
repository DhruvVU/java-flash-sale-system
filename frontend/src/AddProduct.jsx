import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';
import api from './api';

const AddProduct = () => {
    const navigate = useNavigate();

    const[product, setProduct] = useState({
        name: '',
        price: '',
        stockQuantity: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setProduct({...product, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            const payload = {
                ...product,
                price: parseFloat(product.price),
                stockQuantity: parseInt(product.stockQuantity)
            }
            await api.post('/flashsale/products/add', payload);
            alert('Product added successfully');
            navigate('/admin')
        } catch (error) { 
            console.error("Error adding product:", error)
            alert("Failed to add product");
        }
    };

    return (
    <div className="admin-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="dashboard-card" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Add New Product</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            name="name" placeholder="Product Name" required 
            className="login-input" onChange={handleChange} 
          />
          <input 
            name="price" type="number" placeholder="Price (₹)" required 
            className="login-input" onChange={handleChange} 
          />
          <input 
            name="stockQuantity" type="number" placeholder="Stock Quantity" required 
            className="login-input" onChange={handleChange} 
          />
          <input 
            name="imageUrl" placeholder="Image URL (or /images/file.jpg)" required 
            className="login-input" onChange={handleChange} 
          />
          
          <button type="submit" className="buy-btn" style={{ background: '#111' }}>
            Save Product
          </button>
          
          <button type="button" onClick={() => navigate('/admin')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
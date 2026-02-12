import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css'; 

const Products = () => {
    const [data, setData] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    // Fetch Data
    useEffect(() => {

            const fetchProducts = () => {
                api.get('/api/flashsale/products')
                .then(res => {
                    const sortedData = res.data.sort((a, b) => a.id - b.id);
                    setData(sortedData)
                })
                .catch(err => console.error(err));
            };

            fetchProducts();
        }, []);

    // Editing Logic
    const handleUpdate = async () => {
        try {
            const response = await api.put('/api/flashsale/products/update/' + editingProduct.id, editingProduct);
            
            if (response.status === 200) {
                setData(data.map(item => 
                    item.id === editingProduct.id ? response.data : item
                ));

                setEditingProduct(null);

                alert("Update successful");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update");
        }
    };

    // Handle typing in inputs
    const handleEditChange = (e) => {
        setEditingProduct({
            ...editingProduct,
            [e.target.name]: e.target.value
        });
    };

    // Delete Logic
    const handleDelete = async (id) => {
            if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/api/flashsale/products/delete/${id}`);
                setData(data.filter(item => item.id !== id));
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Failed to delete");
            }
            }
        };

    return (
        <div className="admin-container">
            
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="sidebar-title">⚡ FlashAdmin</div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="nav-item" onClick={() => navigate('/admin')}>Dashboard</div>
                <div className="nav-item active">Products</div> 
                <div className="nav-item" onClick={() => navigate('/admin/orders')}>Orders</div>
                <div className="nav-item" onClick={() => navigate('/admin/customers')}>Customers</div>
                </nav>

                <button 
                className="btn-primary" 
                style={{ marginBottom: '15px' }}
                onClick={() => navigate('/admin/add')}
                >
                + Add Product
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-content">
                <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
                Product Inventory
                </h2>

                {/* THE TABLE */}
                <div className="dashboard-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                        <thead>
                        <tr style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            borderBottom: '2px solid #334155', 
                            textAlign: 'left' 
                        }}>
                            <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>ID</th>
                            <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Name</th>
                            <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Price</th>
                            <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Stock</th>
                            <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', textAlign: 'center' }} colSpan={2}>Action</th>
                        </tr>
                        </thead>

                        {/* Table data */}
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={{ padding: '15px', fontFamily: 'monospace' }}>#{item.id}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.name}</td>
                                    <td style={{ padding: '15px', color: 'var(--accent-success)' }}>₹{item.price}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            color: item.stockQuantity < 10 ? 'var(--accent-danger)' : 'var(--accent-success)',
                                            fontWeight: 'bold' 
                                        }}>
                                        {item.stockQuantity} Units
                                        </span>
                                    </td>
                                    
                                    {/* Edit button */}
                                    <td style={{ padding: '15px'}}>
                                        <button
                                            onClick={() => setEditingProduct(item)}
                                            style={{
                                                color: 'var(--accent-primary)',
                                                background: 'transparent',
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                border: '1px solid var(--accent-primary)',
                                                transition: 'all 0.2s',
                                                borderRadius: '6px'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = 'var(--accent-primary)';
                                                e.target.style.color = '#fff';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.color = 'var(--accent-primary)';
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    
                                    {/* Delete button */}
                                    <td style={{ padding: '15px'}}>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            style={{ 
                                                background: 'transparent', 
                                                border: '1px solid var(--accent-danger)', 
                                                color: 'var(--accent-danger)', 
                                                padding: '6px 12px', 
                                                borderRadius: '6px', 
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = 'var(--accent-danger)';
                                                e.target.style.color = '#fff';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.color = 'var(--accent-danger)';
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edit popup */}
                {
                    editingProduct && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div className="dashboard-card" style={{ width: '400px', background: '#1e293b' }}> 
                                <h3 style={{ marginBottom: '20px', color: '#fff' }}>
                                    Edit Product
                                </h3>

                                {/* Edit Name */}
                                <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Product Name</label>
                                <input 
                                    type="text"
                                    name="name"
                                    value={editingProduct.name}
                                    onChange={handleEditChange}
                                    style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#0f172a', border: '1px solid #334155', color: '#64748b'}}
                                />
                                
                                {/* Edit Price */}
                                <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Price (₹)</label>
                                <input 
                                    type="text"
                                    name="price"
                                    value={editingProduct.price}
                                    onChange={handleEditChange}
                                    style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#0f172a', border: '1px solid #334155', color: '#64748b'}}
                                />

                                {/* Edit Stock */}
                                <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Stock Quantity</label>
                                <input 
                                    type="text"
                                    name="stockQuantity"
                                    value={editingProduct.stockQuantity}
                                    onChange={handleEditChange}
                                    style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#0f172a', border: '1px solid #334155', color: '#64748b'}}
                                />

                                {/* Buttons */}
                                <div>
                                    <button
                                        onClick={handleUpdate}
                                        style={{ flex: 1, padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingProduct(null)}
                                        style={{ flex: 1, padding: '10px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer'}}
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )
                }
            </main>
        </div>
    );
};

export default Products;
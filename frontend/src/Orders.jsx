import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/flashsale/orders');
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
         };
        
        fetchOrders();

    }, []);

    
    return (
        <div className="admin-container">
            
            <aside className="admin-sidebar">

                <div className="sidebar-title">⚡ FlashAdmin</div>
                <div className="nav-item" onClick={() => navigate('/admin')}>Dashboard</div>
                <div className="nav-item" onClick={() => navigate('/admin/products')}>Products</div>
                <div className="nav-item active">Orders</div>
                <div className="nav-item" onClick={() => navigate('/admin/customers')}>
                    Customers
                </div>

            </aside>

            {/* Main content */}
            <main className="dashboard-content">
                <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
                    Transaction History
                </h2>

                {/* Table start */}
                <div className="dashboard-card" style={{ overflowX: 'auto'}}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)'}}>

                        <thead>
                            <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left'}}>
                                <th style={{ padding: '15px', color: 'var(--text-secondary)'}}>
                                    Order ID
                                </th>
                                <th style={{ padding: '15px', color: 'var(--text-secondary)'}}>
                                    Customer
                                </th>
                                <th style={{ padding: '15px', color: 'var(--text-secondary)'}}>
                                    Product
                                </th>
                                <th style={{ padding: '15px', color: 'var(--text-secondary)'}}>
                                    Price
                                </th>
                                <th style={{ padding: '15px', color: 'var(--text-secondary)'}}>
                                    Date
                                </th>
                                <th style={{ padding: '15px', color: 'var(--text-secondary)'}}>
                                    Status
                                </th>
                            </tr>
                        </thead>

                        {/* Order list */}
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                        No orders found. Go buy something!
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={{ padding: '15px', fontFamily: 'monospace' }}>#{order.id}</td>
                                        
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold' }}>
                                                {order.userName}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                ID: {order.userId}
                                            </div>
                                        </td>
                                        
                                        <td style={{ padding: '15px' }}>{order.productName}</td>
                                        
                                        <td style={{ padding: '15px', color: 'var(--accent-success)', fontWeight: 'bold' }}>
                                        ₹{order.pricePaid ? order.pricePaid.toLocaleString() : '0'}
                                        </td>
                                        
                                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>
                                            {new Date(order.orderTime).toLocaleString()}
                                        </td>
                                        
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ 
                                                background: 'rgba(16, 185, 129, 0.2)', 
                                                color: '#10b981', 
                                                padding: '4px 10px', 
                                                borderRadius: '4px',
                                                fontSize: '0.85rem'
                                            }}>
                                                {order.status || 'SUCCESS'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </main>

        </div>
    );   
};

export default Orders;
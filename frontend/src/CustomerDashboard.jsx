import React, { useState, useEffect } from "react";
//import axios from "axios";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./styles/CustomerDashboard.css"

const CustomerDashboard = () => { 
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [username] = useState(() => {
        return sessionStorage.getItem('username') || 'Customer';
    });

    useEffect(() => { 
        const userId = sessionStorage.getItem('userId');
        const auth = sessionStorage.getItem('isAuthenticated');

        if (!auth || !userId) {
            navigate('/customerLogin');
            return;
        }

        // Fetch Orders
        api.get(`/api/flashsale/orders/${userId}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
            });
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    }

    return (
        <div className="dashboard-wrapper">

            <header className="dashboard-header">
                <div className="header-left">
                    <span className="logo-text">⚡ FlashSale</span>
                </div>

                <div className="header-right">

                    <span className="welcome-text">Welcome, {username}</span>

                    <button 
                        className="nav-btn shop-btn"
                        onClick={() => navigate('/')}
                    >
                        🛍️ Shop
                    </button>
                    <button 
                        className="nav-btn logout-btn"
                        onClick={handleLogout}
                        >
                        Logout
                    </button>

                </div>
            </header>

            <div className="customer-container">
                <h2>My Order History</h2>

                {orders.length == 0 ? (
                    <div className="empty-state">
                        <p>No Orders found!</p>
                        <button onClick={() => navigate('/')} className="nav-btn shop-btn">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <table className="customer-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Date</th> 
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="id-col">#{order.id}</td>
                                    <td className="product-col">{order.productName || "Unknown"}</td>
                                    <td className="price-col">
                                        {new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 0
                                        }).format(order.pricePaid)}
                                    </td>
                                    <td>{new Date(order.orderTime).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${order.status === 'SUCCESS' ? 'success' : 'pending'}`}>
                                            {order.status || "CONFIRMED"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
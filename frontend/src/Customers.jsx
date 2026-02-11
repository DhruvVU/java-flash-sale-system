import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles/Admin.css";

const Customers = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try{
                const response = await axios.get('http://localhost:8080/flashsale/customers');
                setData(response.data);
            } catch(error) {
                console.error("Error fetching Customer List: ", error);
            }
        }

        fetchCustomers();
    }, []);

    return(
        <div className="admin-container">

            {/* Sidebar panel */}
            <aside className="admin-sidebar">

                <div className="sidebar-title">⚡ FlashAdmin</div>
                <div className="nav-item" onClick={() => navigate('/admin')}>Dashboard</div>
                <div className="nav-item" onClick={() => navigate('/admin/products')}>Products</div>
                <div className="nav-item" onClick={() => navigate('/admin/orders')}>Orders</div>
                <div className="nav-item active">Customers</div>

            </aside>

            {/* Main content of customers */}
            <main className="dashboard-content">
                <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
                    Customer Insights
                </h2>

                {/* Table content starts */}
                <div className="dashboard-card">
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)'}}>

                        <thead>
                            <tr style={{
                                background: 'rgba(255, 255, 255, 0.05)', 
                                borderBottom: '2px solid #334155', 
                                textAlign: 'left' 
                            }}>
                                <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                    Customer</th>
                                <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                    Orders</th>
                                <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                    Total Spent</th>
                                <th style={{ padding: '15px', color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                    Last Active</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((customer) => (
                                <tr key={customer.userId} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={{ padding: '15px' }}>{customer.userName}</td>
                                    <td style={{ padding: '15px' }}>{customer.orderCount}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            color: customer.totalSpent > 100000 ? 'var(--accent-success)' : '#fff',
                                            fontWeight: 'bold' 
                                        }}>
                                            ₹{customer.totalSpent.toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {customer.lastActive ? new Date(customer.lastActive).toLocaleString() : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </main>

        </div>
    );

}

export default Customers;
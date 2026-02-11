import React, {useState, useEffect} from "react";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Curve } from 'recharts';
import { useNavigate } from "react-router-dom";
import './styles/Admin.css'

const Admin = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/flashsale/products');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching admin data", error)
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000); // Update every 2s
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
      sessionStorage.removeItem('isAuthenticated');
      navigate('/');
    };

    // Calculate total stock
    const totalStock = data.reduce((sum,item) => sum + item.stockQuantity, 0);

    // Calculate total price 
    const totalValue = data.reduce((sum, item) => sum + (item.price * item.stockQuantity), 0);

    return (
    <div className="admin-container">
      
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-title">⚡ FlashAdmin</div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Active Tab Example: Add 'active' class conditionally if you want */}
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/admin/products')}>Products</div>
          <div className="nav-item" onClick={() => navigate('/admin/orders')}>Orders</div>
          <div className="nav-item" onClick={() => navigate('/admin/customers')}>Customers</div>
        </nav>

        {/* Buttons */}
        <button 
          className="btn-primary" 
          style={{ marginBottom: '15px' }}
          onClick={() => navigate('/admin/add')}
        >
          + Add Product
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        <h2>Dashboard Overview</h2>
      
        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            
            <div className="dashboard-card">
                <div className="stat-title">Total Products</div>
                <div className="stat-value">{data.length}</div>
            </div>

            <div className="dashboard-card">
                <div className="stat-title">Total Stock Units</div>
                <div className="stat-value">{totalStock}</div>
            </div>

            <div className="dashboard-card">
                <div className="stat-title">Total Inventory Value</div>
                <div className="stat-value money">
                    {new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 0}).format(totalValue)}
                </div>
            </div>

        </div>

        {/* CHART SECTION */}
        <div className="dashboard-card" style={{ height: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>Live Stock Levels</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /> 
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="stockQuantity" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
};

export default Admin;
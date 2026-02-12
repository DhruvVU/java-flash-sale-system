import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminLogin.css';
//import axios from 'axios';
import api from './api';

const Login = () => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // prevents page reload on form submit

        try { 
            const response = await api.post('/flashsale/auth/login', {
                username: username,
                password: password
            });
            
            if (response.status === 200) { 
                const user = response.data;

                if (user.role === 'CUSTOMER') {
                    alert("Customers must use customer login page!");
                    sessionStorage.clear();
                    return;
                }

                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('role', user.role);
                sessionStorage.setItem('userId', user.id);
                sessionStorage.setItem('username', user.username);


                navigate('/admin')

            }
        } catch (err) { 
            setError("Invalid username or password!");
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="login-container">

            <div className="header-logo" onClick={() => navigate('/')}>
                ⚡ FlashSale
            </div>
            <div className="login-box">
                <h2 style={{marginBottom: '20px' }}> 🔐 Admin Login</h2>

                    <input 
                        type="text"
                        placeholder="Username"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input 
                        type="password"
                        placeholder="password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    {error && <span className="error-msg">{error}</span>}

                    <button 
                        onClick={handleLogin} 
                        type="submit" 
                        className='login-btn'
                    >
                        Login
                    </button>
            </div>
        </div>
    )
};  

export default Login;
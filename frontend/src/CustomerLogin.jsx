import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
//import axios from 'axios';
import api from './api';
import './styles/CustomerLogin.css';

const Login = () => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
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

                if (user.role === 'ADMIN') {
                    toast.error("Admins must use admin login page!");
                    sessionStorage.clear();
                    return;
                }
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('role', user.role);
                sessionStorage.setItem('userId', user.id);
                sessionStorage.setItem('username', user.username);


                navigate('/customer-dashboard')

            }
        } catch (err) { 
            toast.error("Invalid username or password!");
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="login-container">
            
            <div className="header-logo" onClick={() => navigate('/')}>
                ⚡ FlashSale
            </div>
            

            <div className="login-box">
                <h2 style={{ marginBottom: '20px'}}>Customer Login</h2>

                    <input 
                        type="text"
                        placeholder="Username"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input 
                        type="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <button 
                        onClick={handleLogin}
                        className='login-btn' 
                        type="submit" 
                    >
                        Login
                    </button>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>New here?</p>
                        <button 
                            onClick={() => navigate('/register')}
                            className='account-btn'
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                            >
                            Create an Account
                        </button>
                    </div>
            </div>
        </div>
    )
};  

export default Login;
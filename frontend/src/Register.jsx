import React, { useState } from "react";    
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './styles/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8080/flashsale/register', 
                {
                    username, 
                    password,
                    role: "CUSTOMER"
                }
            );
            
            if (response.status === 200) {
                alert("Regsitration Successful");
                navigate('/customerLogin');
            }

        } catch (error) {
            console.error("Error registering user:", error);
            alert("Registration Failed");
            setErr("Invalid username or password! Please type a different username/password");
        }
    };

    return (
        <div className="register-wrapper">

            <div className="register-header" onClick={() => navigate('/')}>
                ⚡ FlashSale
            </div>

            <div className="register-box">
                <h2>Create Account</h2>
                <p className="subtitle">Join us to get exclusive flash deals</p>

                <form onSubmit={handleRegister}>

                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    {err & <div className="error-message">⚠️ {err}</div>}

                    <button className="register-btn" type="submit">
                        Sign Up
                    </button>

                </form>
                <div className="login-link">
                    Already have an account? <span onClick={() => navigate('/customerLogin')}>Login</span>
                </div>
            </div>
        </div>
    );
};

export default Register;

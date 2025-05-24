import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        setError(''); // Clear any previous errors
    
        try {
            // Make the API request
            const response = await axios.post('http://localhost:5000/manager/login', {
                email,
                password,
            });
    
            // Extract the token
            const token = response.data.token;
    
            if (!token) {
                throw new Error('Login successful, but no token received.');
            }
    
            console.log('Token received on login:', token); // Debug log
    
            // Save the token in localStorage
            localStorage.setItem('managerToken', token);
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Token saved:', localStorage.getItem('managerToken'));
            
            // Redirect to the dashboard
            navigate('/DashboardLayout');
            console.log('Redirecting to DashboardLayout...');

        } catch (err) {
            console.error('Login error:', err);
    
            // Handle Axios errors
            if (err.response) {
                setError(err.response.data.message || 'Failed to log in.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };
    
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{background:'#f5f5f5'}}>
            <h2 className="mb-4" style={{ color: '#007bff' }}>Employee Transfer Application</h2>
            <div className="card p-4 shadow-lg card-login" style={{width:'400px'}}>
            
            <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Admin Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>
        </div>
        </div>
    );
};

export default Login;

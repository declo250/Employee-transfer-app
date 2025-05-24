import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const EmployeeLogin=()=>{
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const navigate =useNavigate();

 const handleSubmit= async (e)=>{
    e.preventDefault();
    setError('');
    try{
        const response=await axios.post('http://localhost:5000/employee/login',{
            email,
            password,
        });
        // Store JWT in localStorage
        localStorage.setItem('token',response.data.token);
        // Redirect to the employee dashboard
        navigate('/employee-dashboard');
    }catch(err){
        console.error('Login error:', err);
        setError(err.response?.data?.message || 'Failed to log in.');
    }
 };
 return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{background:'#f5f5f5'}}>
        <h2 className="mb-4" style={{ color: '#007bff' }}>Employee Transfer Application</h2>
        <div className="card p-4 shadow-lg" style={{width:'400px'}}>
        <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Employee Login</h2>
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

}

export default EmployeeLogin;
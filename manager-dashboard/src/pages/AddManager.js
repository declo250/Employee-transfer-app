import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';


const AddManager = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validate form fields
        if (!name || !email || !password) {
            setError('All fields are required!');
            return;
        }

        try {
            // Send POST request to backend to create the manager
            const response = await axios.post('http://localhost:5000/manager/create', { name, email, password });
            setMessage(response.data.message); // Display success message
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error('Error:', err); // Log the error for debugging
            setError(err.response?.data?.message || 'Error creating User');
        }
    };

    return (
        <DashboardLayout>
        <div className="container mt-5">
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100">Add User</button>
            </form>

            {/* Add a link to view managers */}
    
        </div>
        </DashboardLayout>
    );
};

export default AddManager;

import React, { useState, useEffect } from "react";
import EmployeeDashboardLayout from "./EmployeeDashboardLayout";
import axios from "axios";

const EmployeeProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/employee/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setName(response.data.name);
                setEmail(response.data.email);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to fetch profile.');
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/employee/profile',
                { name, email, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
            setPassword(''); // Clear password field after update
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <EmployeeDashboardLayout>
            <h2>My Profile</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
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
                    <label className="form-label">Password (Leave blank to keep existing password)</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update Profile
                </button>
            </form>
        </EmployeeDashboardLayout>
    );
};

export default EmployeeProfile;

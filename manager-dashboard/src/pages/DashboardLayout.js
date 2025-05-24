import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../dashboard.css';
import axios from 'axios';

const DashboardLayout = ({ children }) => {
    const [stats, setStats] = useState({
        employees: 0,
        departments: 0,
        transfers: 0,
    });
    const [error, setError] = useState('');
    const token = localStorage.getItem('managerToken');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!token) {
                    navigate('/login'); // Redirect to login if token is missing
                    return;
                }

                const response = await axios.get('http://localhost:5000/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Failed to load dashboard stats.');
            }
        };

        fetchStats();
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('managerToken'); // Clear token on logout
        navigate('/login'); // Redirect to login
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-container__sidebar">
                <h3 className="dashboard-container__sidebar-title">Dashboard</h3>
                <ul className="dashboard-container__sidebar-menu">
                    <li onClick={() => navigate('/DashboardLayout')}><i className="fas fa-home"></i> Dashboard</li>
                    <li onClick={() => navigate('/employees')}><i className="fas fa-users"></i> Employees</li>
                    <li onClick={() => navigate('/department')}><i className="fas fa-building"></i> Departments</li>
                    <li onClick={() => navigate('/manager/transfers')}> <i className="fas fa-exchange-alt"></i> Transfers</li>
                    <li onClick={() => navigate('/managers')}><i className="fas fa-users"></i> Users</li>

                    <li onClick={handleLogout}> <i className="fas fa-sign-out-alt"></i> Logout</li>
                </ul>
            </div>
            <div className="dashboard-container__main-content">
                {location.pathname === '/DashboardLayout' && (
                    <div>
                        <div className="dashboard-container__main-header">
                            <h1>Welcome, Admin</h1>
                        </div>
                        <div className="dashboard-container__cards-container">
                            <div className="dashboard-container__card bg-primary text-white">
                                <h5 className="dashboard-container__card-title">Total Employees</h5>
                                <h2 className="dashboard-container__card-text">{stats.employees}</h2>
                            </div>
                            <div className="dashboard-container__card bg-success text-white">
                                <h5 className="dashboard-container__card-title">Total Departments</h5>
                                <h2 className="dashboard-container__card-text">{stats.departments}</h2>
                            </div>
                            <div className="dashboard-container__card bg-info text-white">
                                <h5 className="dashboard-container__card-title">Pending Transfers</h5>
                                <h2 className="dashboard-container__card-text">{stats.transfers}</h2>
                            </div>
                        </div>
                    </div>
                )}
                <div className="dashboard-container__main-body">{children}</div>
            </div>
        </div>
    );
};

export default DashboardLayout;

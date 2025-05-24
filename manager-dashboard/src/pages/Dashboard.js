import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const Dashboard = ({children}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        navigate('/login'); // Redirect to login page
    };

    return (
      <div className="dashboard-container">
        <div className="sidebar">
            <h3>Dashboard</h3>
            <ul>
                <li onClick={()=>navigate('/dashboard')}>Dashboard</li>
                <li onClick={()=>navigate('/employees')}>Employees</li>
                <li onClick={()=>navigate('/department')}>Departments</li>
                <li onClick={()=>navigate('/manager/transfers')}>Transfers</li>
                <li onClick={handleLogout}>Logout</li>

            </ul>
        </div>
        <div className="main-content">
                {children} {/* This will render the specific page content */}
            </div>
      </div>
    );
};

export default Dashboard;

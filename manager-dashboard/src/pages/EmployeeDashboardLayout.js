import React from "react";
import { Link } from "react-router-dom";


const EmployeeDashboardLayout=({children})=>{
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link className="navbar-brand" to="/employee-dashboard">
                         Dashboard
                    </Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/employee/profile">
                                    Profile
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/employee/transfers">
                                    Transfer
                                </Link>
                              
                            </li>
                            <li className="nav-item">
                                    <Link className="nav-link" to="/employee/my-transfers">My transfer</Link>
                                </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/employee/login"
                                    onClick={() => localStorage.removeItem('token')}
                                >
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">{children}</div>
        </div>
    );

};
export default EmployeeDashboardLayout
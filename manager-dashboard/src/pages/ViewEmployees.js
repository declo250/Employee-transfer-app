import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";
import { Link } from "react-router-dom";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [searchName, setSearchName] = useState(''); // Search by name
    const [searchDepartment, setSearchDepartment] = useState(''); // Search by department
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [loading, setLoading] = useState(false);

    const limit = 5; // Number of employees per page

    // Fetch employees
    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/employee/view', {
                params: {
                    name: searchName,
                    department: searchDepartment,
                    page: currentPage,
                    limit,
                },
            });

            console.log('Fetched Employees:', response.data);
            setEmployees(response.data.employees);
            setTotalPages(response.data.totalPages);
            setError('');
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    }, [searchName, searchDepartment, currentPage, limit]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handle search by name
    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page on a new search
        fetchEmployees();
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`http://localhost:5000/employee/delete/${id}`);
                alert('Employee deleted successfully!');
                fetchEmployees(); // Refresh the list after deletion
            } catch (err) {
                console.error('Error deleting employee:', err);
                alert('Failed to delete employee.');
            }
        }
    };

    return (
        <DashboardLayout>
            <Link to="/add-employee" className="btn btn-primary mb-3">Add New </Link>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Department"
                        value={searchDepartment}
                        onChange={(e) => setSearchDepartment(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <button className="btn btn-primary w-100" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.Department ? employee.Department.name : 'N/A'}</td>
                                    <td>{employee.role}</td>
                                    <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/edit-employee/${employee.id}`} className="btn btn-warning btn-sm me-2">
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(employee.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Pagination Controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i + 1}
                            className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </DashboardLayout>
    );
};

export default Employees;

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const ViewDepartment = () => {
    const [departments, setDepartments] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const limit = 5;

    // Define fetchDepartments with useCallback to prevent re-creation on every render
    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/department/view', {
                params: {
                    page: currentPage,
                    limit,
                    name: nameFilter,
                    availability: availabilityFilter,
                },
            });
            setDepartments(response.data.departments);
            setTotalPages(response.data.totalPages);
            setError('');
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to fetch departments. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, nameFilter, availabilityFilter]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]); // Include fetchDepartments as a dependency

    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page
        fetchDepartments(); // Fetch departments based on filters
    };

    return (
        <DashboardLayout>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Departments</h1>
                    <Link to="/add-department" className="btn btn-primary">
                        Add New
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <label className="form-label">Filter by Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter department name"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Filter by Availability</label>
                        <select
                            className="form-control"
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Departments Table */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Availability</th>
                            <th>Vacancies</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : departments.length > 0 ? (
                            departments.map((department) => (
                                <tr key={department.id}>
                                    <td>{department.id}</td>
                                    <td>{department.name}</td>
                                    <td>{department.location}</td>
                                    <td>{department.availability}</td>
                                    <td>{department.vacancies}</td>
                                    <td>
                                        <Link
                                            to={`/edit-department/${department.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={async () => {
                                                if (
                                                    window.confirm(
                                                        'Are you sure you want to delete this department?'
                                                    )
                                                ) {
                                                    try {
                                                        await axios.delete(
                                                            `http://localhost:5000/department/delete/${department.id}`
                                                        );
                                                        alert('Department deleted successfully!');
                                                        fetchDepartments(); // Refresh the list
                                                    } catch (err) {
                                                        console.error('Error deleting department:', err);
                                                        alert('Failed to delete department.');
                                                    }
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No departments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="d-flex justify-content-center">
                        <ul className="pagination">
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
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li
                                className={`page-item ${
                                    currentPage === totalPages ? 'disabled' : ''
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ViewDepartment;

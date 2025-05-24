import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const ViewManagers = () => {
    const [managers, setManagers] = useState([]);
    const [filter, setFilter] = useState(''); // Filter state
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total pages
    const [error, setError] = useState('');

    // Define fetchManagers with useCallback to avoid recreation on every render
    const fetchManagers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/manager/view', {
                params: { page, limit: 10, name: filter }, // Pass filter as query parameter
            });
            setManagers(response.data.managers); // Update state
            setTotalPages(response.data.totalPages);
            setError(''); // Clear error on success
        } catch (err) {
            console.error('Error fetching managers:', err);
            setError('Failed to fetch managers. Please try again later.');
        }
    }, [page, filter]);

    useEffect(() => {
        fetchManagers();
    }, [fetchManagers]); // Add fetchManagers to dependency array

    const handleFilterChange = (e) => {
        setFilter(e.target.value); // Update filter state
        setPage(1); // Reset to the first page when filtering
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            try {
                await axios.delete(`http://localhost:5000/manager/delete/${id}`);
                alert('Manager deleted successfully!');
                fetchManagers(); // Refresh the list after deletion
            } catch (err) {
                console.error('Error deleting manager:', err);
                alert('Failed to delete manager.');
            }
        }
    };

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1); // Increment page number
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1); // Decrement page number
        }
    };

    return (
        <DashboardLayout>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Link to="/add-manager" className="btn btn-primary">
                        Add New 
                    </Link>
                </div>

                {/* Filter Input */}
                <div className="mb-3">
                    <label className="form-label">Filter by Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter name to filter"
                        value={filter}
                        onChange={handleFilterChange}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {/* Managers Table */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managers.length > 0 ? (
                            managers.map((manager) => (
                                <tr key={manager.id}>
                                    <td>{manager.id}</td>
                                    <td>{manager.name}</td>
                                    <td>{manager.email}</td>
                                    <td>{new Date(manager.created_at).toLocaleString()}</td>
                                    <td>
                                        <Link
                                            to={`/edit-manager/${manager.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(manager.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No managers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={goToPreviousPage}
                            >
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i + 1}
                                className={`page-item ${page === i + 1 ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={goToNextPage}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </DashboardLayout>
    );
};

export default ViewManagers;

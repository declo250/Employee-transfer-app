import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from './DashboardLayout';

const TransferRequests = () => {
    const [transfers, setTransfers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch transfer requests when the component loads
        const fetchTransfers = async () => {
            try {
                const token = localStorage.getItem("managerToken"); // Retrieve the token
                console.log("Token being sent:", token); // Debug the token
                
                const response = await axios.get("http://localhost:5000/transfer/requests", {
                    headers: { Authorization: `Bearer ${token}` }, // Send token in the Authorization header
                });
                console.log("Fetched Transfers:", response.data); // Log the fetched data

                setTransfers(response.data);
            } catch (err) {
                console.error("Error fetching transfer requests:", err);
                setError("Failed to load transfer requests.");
            }
        };

        fetchTransfers();
    }, []);

    // Handle approve/reject actions
    const handleAction = async (id, action) => {
        setMessage('');
        setError('');
    
        try {
            const token = localStorage.getItem("managerToken"); // Retrieve token from localStorage
            if (!token) {
                console.error('Manager token is missing from localStorage.');
                setError('Access Denied: No token provided');
                return;
            }
    
            const response = await axios.put(
                `http://localhost:5000/transfer/request/${id}`,
                { status: action.toLowerCase() }, // Convert action to lowercase
                { headers: { Authorization: `Bearer ${token}` } } // Include token in header
            );
    
            setMessage(response.data.message);
    
            // Update the status of the transfer in the table
            setTransfers((prevTransfers) =>
                prevTransfers.map((transfer) =>
                    transfer.id === id ? { ...transfer, status: action } : transfer
                )
            );
        } catch (err) {
            console.error("Error updating transfer request:", err);
            setError(err.response?.data?.message || "Failed to update transfer request.");
        }
    };

    return (
        <DashboardLayout>
            <h2>Employee Transfer Requests</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Employee</th>
                        <th>From Department</th>
                        <th>To Department</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.length > 0 ? (
                        transfers.map((transfer, index) => (
                            <tr key={transfer.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {transfer.Employee?.name || "Unknown"} (
                                    {transfer.Employee?.email || "N/A"})
                                </td>
                                <td>{transfer.FromDepartment?.name || "Unknown"}</td>
                                <td>{transfer.ToDepartment?.name || "Unknown"}</td>
                                <td>{transfer.status}</td>
                                <td>{transfer.reason}</td>
                                <td>
                                    {transfer.status.toLowerCase() === "pending" ? (
                                        <>
                                    {console.log(`Rendering actions for transfer ID: ${transfer.id}`)}

                                    <button
                className="btn btn-success btn-sm me-2"
                onClick={() => handleAction(transfer.id, "approved")}
            >
                Approve
            </button>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => handleAction(transfer.id, "rejected")}
            >
                Reject
            </button>
                                        </>
                                    ):(        <span>No actions available</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No transfer requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </DashboardLayout>
    );
};

export default TransferRequests;

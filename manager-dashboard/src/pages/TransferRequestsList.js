import React, { useState, useEffect } from "react";
import EmployeeDashboardLayout from "./EmployeeDashboardLayout";
import axios from "axios";

const TransferRequestsList = () => {
    const [transfers, setTransfers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransfers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/transfer/my-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTransfers(response.data);
            } catch (err) {
                console.error('Error fetching transfer requests:', err);
                setError('Failed to load transfer requests.');
            }
        };

        fetchTransfers();
    }, []);

    return (
        <EmployeeDashboardLayout>
            <h2>My Transfer Requests</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>From Department</th>
                        <th>To Department</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer, index) => (
                        <tr key={transfer.id}>
                            <td>{index + 1}</td>
                            <td>{transfer.FromDepartment?.name || 'Unknown'}</td>
                            <td>{transfer.ToDepartment?.name || 'Unknown'}</td>
                            <td>{transfer.status}</td>
                            <td>{new Date(transfer.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </EmployeeDashboardLayout>
    );
};

export default TransferRequestsList;

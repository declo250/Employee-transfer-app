import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeDashboardLayout from "./EmployeeDashboardLayout";

const TransferRequest = () => {
    const [eligibleDepartments, setEligibleDepartments] = useState([]);
    const [toDepartmentId, setToDepartmentId] = useState('');
    //const[currentPosition,setPosition]=useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch token and employeeId
    const token = localStorage.getItem('token');
    const employeeId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    useEffect(() => {
        const fetchEligibleDepartments = async () => {
            if (!employeeId) {
                console.error('Employee ID is missing');
                setError('Failed to load eligible departments.');
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/department/eligible/${employeeId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEligibleDepartments(response.data);
            } catch (err) {
                console.error('Error fetching eligible departments:', err);
                setError('Failed to load eligible departments.');
            }
        };

        fetchEligibleDepartments();
    }, [employeeId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/transfer/transfer-request',
                { employee_id: employeeId, to_department_id: toDepartmentId, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
        } catch (err) {
            console.error('Error submitting transfer request:', err);
            setError(err.response?.data?.message || 'Failed to submit transfer request.');
        }
    };

    return (
        <EmployeeDashboardLayout>
            <h2>Request a Transfer</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Target Department</label>
                    <select
                        className="form-control"
                        value={toDepartmentId}
                        onChange={(e) => setToDepartmentId(e.target.value)}
                        required
                    >
                        <option value="">Select Department</option>
                        {eligibleDepartments.length > 0 ? (
                            eligibleDepartments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name} (Vacancies: {dept.vacancies})
                                </option>
                            ))
                        ) : (
                            <option disabled>No eligible departments found</option>
                        )}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit Request
                </button>
            </form>
        </EmployeeDashboardLayout>
    );
};

export default TransferRequest;

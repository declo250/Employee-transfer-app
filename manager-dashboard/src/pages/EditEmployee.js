import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";

const EditEmployee = () => {
    const { id } = useParams(); // Get employee ID from URL
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department_id, setDepartmentId] = useState('');
    const [role, setRole] = useState('');
    const [departments, setDepartments] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch employee details and departments
    useEffect(() => {
        const fetchEmployeesDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employee/view/${id}`);
                const employee = response.data;
                setName(employee.name);
                setEmail(employee.email);
                setDepartmentId(employee.department_id);
                setRole(employee.role);
            } catch (err) {
                console.error('Error fetching employee details:', err);
                setError('Failed to load employee details.');
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/department/view');
                console.log('Departments response:', response.data);
                setDepartments(response.data.departments || response.data);
            } catch (err) {
                console.error('Error fetching departments:', err);
                setError('Failed to load departments.');
            }
        };

        fetchEmployeesDetails();
        fetchDepartments();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.put(`http://localhost:5000/employee/update/${id}`, {
                name,
                email,
                password,
                department_id,
                role,
            });

            // Extract and display the success message
            setMessage(response.data.message);

            // Redirect to employees list after successful update
            setTimeout(() => {
                navigate('/employees');
            }, 2000);
        } catch (err) {
            console.error('Error updating employee:', err);
            setError(err.response?.data?.message || 'Failed to update employee.');
        }
    };

    return (
        <DashboardLayout>
            <h2>Edit Employee</h2>
            {message && typeof message === 'string' && <div className="alert alert-success">{message}</div>}
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
                        value={password || ''}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Department</label>
                    <select
                        className="form-control"
                        value={department_id}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                        type="text"
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update Employee
                </button>
            </form>
        </DashboardLayout>
    );
};

export default EditEmployee;

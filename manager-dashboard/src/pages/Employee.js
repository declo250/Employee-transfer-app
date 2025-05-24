import React,{useState,useEffect} from "react";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";

const Employee= ()=>{

    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [department_id,setDepartmentId]=useState('');
    const [role,setRole]=useState('employee');
    const[qualifications,setQualifications]=useState('');
    const [departments,setDepartments]=useState([]);
    const [message,setMessage]=useState('');
    const [error,setError]=useState('');

    // Fetch departments for the dropdown
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/department/view'); // Fetch departments
                console.log('Fetched departments:', response.data); // Debugging log
    
                // Update the state with the actual departments array
                setDepartments(response.data.departments);
            } catch (err) {
                console.error('Error fetching departments:', err);
                setError('Failed to fetch departments.'); // Set error message
            }
        };
    
        fetchDepartments();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/employee/create', {
                name,
                email,
                password,
                department_id,
                role,
                qualifications,
            });

            setMessage(response.data.message);
            setName('');
            setEmail('');
            setPassword('');
            setDepartmentId('');
            setQualifications('');
            setRole('employee');
        } catch (err) {
            console.error('Error adding employee:', err);
            setError(err.response?.data?.message || 'Failed to add employee.');
        }
    };

    return (
        <DashboardLayout>
            <h2>Manage Employees</h2>
            {message && <div className="alert alert-success">{message}</div>}
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
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                <div className="mb-3">
                    <label>Qualified</label>
                    <select 
                    className="form-control"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    required
                    >
                    <option value="">Select Department</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>HR</option>
                    <option>Accounting</option>
                    <option>Legal Affairs</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Add 
                </button>
            </form>
        </DashboardLayout>
    );
};

export default Employee


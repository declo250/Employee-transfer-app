import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";
const Department = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [availability, setAvailability] = useState('');
    const[vacancies,setVacancies]=useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Make API request to add a department
            const response = await axios.post('http://localhost:5000/department/create', {
                name, location, availability,vacancies,
            });

            // Handle the response and reset the form
            setMessage(response.data.message);
            setName(''); // Clear the name input
            setLocation(''); // Clear the location input
            setAvailability(''); // Clear the availability input
            setVacancies('');
        } catch (err) {
            console.error('Error adding department:', err);
            setError(err.response?.data?.message || 'Failed to add department.');
        }
    };

    return (
        <DashboardLayout>
            <h2>Manage Departments</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Department Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Department Location</label>
                    <input
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Department Availability</label>
                    <input
                        type="text"
                        className="form-control"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Department vacancies</label>
                    <input
                        type="text"
                        className="form-control"
                        value={vacancies}
                        onChange={(e) => setVacancies(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Department
                </button>
            </form>
            <div className="mt-3 text-center">
        </div>
        </DashboardLayout>
    );
};

export default Department;

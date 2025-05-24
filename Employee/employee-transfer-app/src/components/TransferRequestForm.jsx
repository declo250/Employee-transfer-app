import React, { useState } from "react";
import axios from "axios";

const TransferRequestForm = () => {
    const [formData, setFormData] = useState({
        employee_id: "",
        target_department: "",
        target_location: "",
        justification: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/transfer-requests", formData)
            .then(response => alert("Transfer request submitted!"))
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Submit Transfer Request</h2>
            <input name="employee_id" placeholder="Employee ID" onChange={handleChange} />
            <input name="target_department" placeholder="Target Department" onChange={handleChange} />
            <input name="target_location" placeholder="Target Location" onChange={handleChange} />
            <textarea name="justification" placeholder="Justification" onChange={handleChange}></textarea>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TransferRequestForm;

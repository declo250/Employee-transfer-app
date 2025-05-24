import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/employees")
            .then(response => setEmployees(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Employee List</h2>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>
                        {emp.name} - {emp.department} - {emp.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;

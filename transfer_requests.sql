CREATE TABLE transferRequests (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES Employees(id) ON DELETE CASCADE,
    desired_department_id INT REFERENCES Departments(id),
    desired_location VARCHAR(100),
    position VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

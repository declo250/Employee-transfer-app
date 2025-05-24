CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hashed password
    department_id INT REFERENCES departments(id),
    role VARCHAR(50) DEFAULT 'Employee', -- 'Employee', 'Manager', or 'HR'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

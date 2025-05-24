CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    availability BOOLEAN DEFAULT TRUE, -- Whether positions are open for transfer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

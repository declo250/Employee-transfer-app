const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// API Routes
app.get("/employees", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employees");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/transfer-requests", async (req, res) => {
    const { employee_id, target_department, target_location, justification } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO transfer_requests (employee_id, target_department, target_location, justification) VALUES ($1, $2, $3, $4) RETURNING *",
            [employee_id, target_department, target_location, justification]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

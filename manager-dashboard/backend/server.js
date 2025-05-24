require('dotenv').config({ path: '../.env' });  // Specify relative path to the .env file
// Access and log the JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', jwtSecret);  // This should print the secret key or 'undefined' if not loaded

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const managerRoutes = require('./routes/manager'); // Import the manager route
const departmentRoutes = require('./routes/department'); // Import the department route
const employeeRoutes=require('./routes/employee');
const employeeProfileRoutes=require('./routes/employeeProfile');
const transferRoutes=require('./routes/transfer');
const dashboardRoutes=require('./routes/dashboard');


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/manager', managerRoutes);  // Correct route registration for /manager
app.use('/department', departmentRoutes);  // Correct route registration for /department
app.use('/employee',employeeRoutes);
app.use('/employee',employeeProfileRoutes);
app.use('/transfer',transferRoutes);
app.use('/dashboard',dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

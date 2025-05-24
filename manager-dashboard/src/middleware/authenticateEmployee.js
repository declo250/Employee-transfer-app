const jwt = require('jsonwebtoken');
const Employee = require('../../models/Employee'); // Ensure the path is correct

const authenticateEmployee = async (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded data to the request object

        // Check if the user is an employee
        const employee = await Employee.findByPk(decoded.id); // Find employee in the database
        if (!employee) {
            return res.status(403).json({ message: 'Access denied. Invalid employee token.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateEmployee;

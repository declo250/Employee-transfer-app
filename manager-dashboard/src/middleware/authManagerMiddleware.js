const jwt = require('jsonwebtoken');
const Manager = require('../../models/Manager');

const authenticateManager = async (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get the Authorization header
const token = authHeader && authHeader.split(' ')[1]; // Extract the token
console.log('Extracted Token:', token); // Debug the extracted token

if (!token) {
    console.error('Token is missing in the request.');
    return res.status(401).json({ message: 'Access Denied: No token provided' });
}

    if (!token) {
        console.error('Token is missing in the request.');
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    console.log('Received Token:', token); // Debug log the received token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log('Decoded Token:', decoded); // Debug log the decoded token
        req.user = decoded; // Attach user data to the request object
        // Check if the manager exists in the database
        const manager = await Manager.findByPk(decoded.id);
        if (!manager) {
            console.error('Manager not found in the database.');
            return res.status(401).json({ message: 'Access Denied: Invalid manager' });
        }

     
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateManager;

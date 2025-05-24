const express = require('express');
const { Employee, Department, Transfer } = require('../../models/Associations');
const authenticateManager = require('../../src/middleware/authManagerMiddleware');

const router = express.Router();

// GET /dashboard/stats - Fetch statistics
router.get('/stats', authenticateManager, async (req, res) => {
    try {
        const employeesCount = await Employee.count();
        const departmentsCount = await Department.count();
        const transfersCount = await Transfer.count({ where: { status: 'Pending' } });

        res.status(200).json({
            employees: employeesCount,
            departments: departmentsCount,
            transfers: transfersCount,
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

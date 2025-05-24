const express =require ('express');
//const authenticate= require('../../src/middleware/authMiddleware');
const { Transfer, Employee, Department } = require('../../models/Associations'); // Centralized import
const authenticateManager=require('../../src/middleware/authManagerMiddleware');
const authenticateEmployee=require('../../src/middleware/authenticateEmployee');

const router=express.Router();

// POST /transfer/request - Create a transfer request
router.post('/transfer-request', authenticateEmployee, async (req, res) => {
    const { employee_id, to_department_id, reason } = req.body;

    console.log('Received Transfer Request:', { employee_id, to_department_id, reason });
    console.log('Authenticated User:', req.user);

    try {
        console.log('Middleware passed'); // Log when middleware succeeds
        if (!employee_id || !to_department_id || !reason) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate employee
        const employee = await Employee.findByPk(employee_id);
        if (!employee) {
            console.error('Employee not found for ID:', employee_id);
            return res.status(404).json({ message: 'Employee not found' });
        }

        console.log('Employee found:', employee);

        // Validate target department
        const toDepartment = await Department.findByPk(to_department_id);
        if (!toDepartment || toDepartment.availability !== 'Open') {
            console.error('Target department not available or invalid:', to_department_id);
            return res.status(404).json({ message: 'Target department not available' });
        }

        console.log('Target department found and available:', toDepartment);

        // Create transfer request
        const newTransfer = await Transfer.create({
            employee_id,
            from_department_id: employee.department_id, // Employee's current department
            to_department_id,
            reason,
            status: 'Pending',
        });

        console.log('New Transfer Request Created:', newTransfer);

        res.status(201).json({ message: 'Transfer request submitted successfully', transfer: newTransfer });
    } catch (err) {
        console.error('Error creating transfer request:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /transfer/my-requests - View logged-in employee's transfer requests
router.get('/my-requests', authenticateEmployee, async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access Forbidden: Employees only' });
    }

    try {
        const transfers = await Transfer.findAll({
            where: { employee_id: req.user.id },
            include: [
                { model: Department, as: 'FromDepartment', attributes: ['name'] }, // Include the name of the "from" department
                { model: Department, as: 'ToDepartment', attributes: ['name'] },   // Include the name of the "to" department
            ],
        });

        res.status(200).json(transfers);
    } catch (err) {
        console.error('Error fetching transfer requests:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /transfer/requests - Fetch all transfer requests
router.get('/requests', authenticateManager, async (req, res) => {
    try {
        const transfers = await Transfer.findAll({
            include: [
                { model: Employee, as: 'Employee', attributes: ['name', 'email'] },
                { model: Department, as: 'FromDepartment', attributes: ['name'] },
                { model: Department, as: 'ToDepartment', attributes: ['name'] },
            ],
        });

        res.status(200).json(transfers);
    } catch (err) {
        console.error('Error fetching transfer requests:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//PUT /TRANSFER/REQUEST/:ID -APPROVE OR REJECT A TRANSFER REQUEST
router.put('/request/:id',authenticateManager,async(req,res)=>{
    if(req.user.role !=='manager'){
        return res.status(403).json({message:'Acess forbidden: Managers only'});
    }
    const {id}=req.params;
    let {status}=req.body;
    status = status.toLowerCase();
    if(!['approved','rejected'].includes(status)){
        return res.status(400).json({message:'Invalid status. Must be "approved" or "rejected".'});
    }
    try{
       const transfer=await Transfer.findByPk(id);
       if(!transfer){
        return res.status(404).json({message:'Transfer request not found'});
       }
       transfer.status=status;
       await transfer.save();
       res.status(200).json({message: `Transfer request ${status} successfully`, transfer});
    }catch(err){
        console.error('Error updating transfer request:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});

module.exports=router;
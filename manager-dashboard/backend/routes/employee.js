const express=require('express');
const bcrypt=require('bcrypt');
const {Employee, Department } = require('../../models/Associations'); 
const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const router=express.Router();

//POST /employee/create -add a new employee
router.post('/create',async(req,res)=>{
    const {name,email,password,department_id,role,qualifications}=req.body;

    try{
        //validate required fields
        if(!name || !email ||!password||!department_id||!qualifications){
            return res.status(404).json({message:'All fields are required'});
        }
        //check if department exists 
        const department=await Department.findByPk(department_id);
        if(!department)
        {
            return res.status(400).json({message:'Invalid Department ID'});
        }
        // Check if the employee email is already in use
        const existingEmployee=await Employee.findOne({where:{email}});
        if(existingEmployee){
            return res.status(400).json({message:'Email already exists'});

        }
        // Hash the password before storing it
        const hashPassword=await bcrypt.hash(password,10);
        //create the employee
        const newEmployee=await Employee.create({
            name,
            email,
            password:hashPassword,
            department_id,
            role:role ||'employee', //default role is "employee"
            qualifications,

        });
        res.status(201).json({message:'Employee added successfully.',employee:newEmployee});

    }catch(err){
        console.error('Error adding employee:',err);
        res.status(500).json({message:'Internal server error'});

    }
});
// GET /employee/view - Fetch all employees
// GET /employee/view - Fetch all employees with filtering and pagination
router.get('/view', async (req, res) => {
    const { name, email, department, page = 1, limit = 10 } = req.query;

    try {
        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Construct where conditions dynamically
        const whereConditions = {};
        if (name) {
            whereConditions.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive name filtering
        }
        if (email) {
            whereConditions.email = { [Op.iLike]: `%${email}%` }; // Case-insensitive email filtering
        }

        // Fetch employees along with their department
        const { count, rows } = await Employee.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: Department,
                    as: 'Department',
                    attributes: ['id', 'name', 'location'],
                    where: department
                        ? { name: { [Op.iLike]: `%${department}%` } } // Filter by department name
                        : undefined,
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            total: count, // Total number of records
            page: parseInt(page), // Current page
            totalPages: Math.ceil(count / limit), // Total pages
            employees: rows, // Paginated employees
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, department_id, role } = req.body;

    try {
        // Find the employee by ID
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee details
        if (name) employee.name = name;
        if (email) employee.email = email;
        if (department_id) employee.department_id = department_id;
        if (role) employee.role = role;

        // If password is being updated, hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            employee.password = hashedPassword;
        }

        // Save the updated employee in the database
        await employee.save();
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// GET /employee/view/:id - Get a single employee by ID
router.get('/view/:id',async(req,res)=>{
    const {id}=req.params;
    try{
  // Fetch the employee by ID, including department details
  const employee=await Employee.findByPk(id,{
    include:[
        {
            model:Department,
            as:'Department',
            attributes:['id','name','location'],
        },
    ],
  });
// If employee is not found, return 404
  if(!employee){
    return res.status(404).json({ message: 'Employee not found' });
  }   
  //return employee data
  res.status(200).json(employee);  

    }catch(err){
        console.error('Error fetching employee:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});


// POST /employee/login - Employee login
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const employee=await Employee.findOne({where:{email}});
        if(!employee){
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const isPasswordValid=await bcrypt.compare(password,employee.password);
        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const token=jwt.sign(
            {id:employee.id,email:employee.email,role:'employee'},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: 'employee',
            },
        });
    }catch(err){
        console.error('Error during employee login:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});
router.delete('/delete/:id',async(req,res)=>{
const {id} = req.params;
try{
    const employee = await Employee.findByPk(id);
    if(!employee){
        return res.status(404).json({ message: 'Employee not found' });
    }
    //delete employee
   await employee.destroy();
    res.status(200).json({ message: 'Employee deleted successfully' });

}catch(err){
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}
});
module.exports = router;

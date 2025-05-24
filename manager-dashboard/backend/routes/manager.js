const express = require('express');
const bcrypt = require('bcrypt');
const Manager = require('../../models/Manager'); // Ensure you're using the correct model
const router = express.Router();
const { Op } = require('sequelize'); // Ensure Sequelize operators are imported
const jwt = require('jsonwebtoken');


// POST /manager/create - Add a new manager
router.post('/create', async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Received request to add manager:', email);

    try {
        // Validate fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if the manager already exists
        const existingManager = await Manager.findOne({ where: { email } });
        if (existingManager) {
            console.log('Manager already exists');
            return res.status(400).json({ message: 'Manager already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert new manager into the database
        const newManager = await Manager.create({
            name,
            email,
            password: hashedPassword,
            created_at: new Date(), // You can explicitly set the created_at field or let the database handle it
        });

        console.log('Manager created successfully:', newManager); // Log successful creation
        res.status(201).json({ message: 'Manager created successfully', manager: newManager });
    } catch (err) {
        console.error('Error creating manager:', err); // Log the full error stack
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// GET /manager/view - Fetch all managers or filter by name
router.get('/view', async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    

    try {
        //convert page and limit to numbers
        const offset=(page - 1) * limit; //skip records per previous pages
        let whereCondition={};

        if (name) {
            // Filter managers by name (case insensitive)
            whereCondition.name = {
                [Op.iLike]:`%${name}%`,
            };
        }
        // Fetch paginated results
        const { count, rows } = await Manager.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit), // Number of records per page
            offset: parseInt(offset), // Start position for fetching
        });

        res.status(200).json({
            total: count, // Total number of records
            page: parseInt(page), // Current page number
            totalPages: Math.ceil(count / limit), // Total number of pages
            managers: rows, // Records for the current page
        });
    } catch (err) {
        console.error('Error fetching managers:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update /manager/view /:id -update a manager
router.put('/update/:id',async (req,res)=>{
    const {id}=req.params;
    const {name,email,password}=req.body;
    try{
        //Find the manager by ID
        const manager = await Manager.findByPk(id);
        if(!manager){
            return res.status(404).json({message: 'Manager not found'})

        }
        //update manager details

        if(name) manager.name=name;
        if(email) manager.email=email;
        // Hash password if it's being updated
        if(password){
            const hashedPassword= await bcrypt.hash(password,10);
            manager.password=hashedPassword;
    }
    //save updated manager tot the database
    await manager.save();
    res.status(200).json({message:'Manager updated successfully',manager});
}catch (err){
    console.error('Error updating manager:',err);
    res.status(500).json({message:'Internal server error',error:err.message});
}

})

// GET /manager/view/:id - Get a manager by ID
router.get('/view/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the manager by ID
        const manager = await Manager.findByPk(id);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.status(200).json(manager);
    } catch (err) {
        console.error('Error fetching manager:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
 try{
    //check if the manager exists
    const manager=await Manager.findOne({where:{email}});
    if(!manager){
        return res.status(401).json({message:'Invalid email or password'});
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid=await bcrypt.compare(password,manager.password);
    if(!isPasswordValid){
        return res.status(401).json({message:'Invalid email or password'})
    }
     // Generate a JWT token
     const token = jwt.sign(
        { id: manager.id, email: manager.email, role: 'manager'},
        process.env.JWT_SECRET, // Replace with an environment variable for security
        { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ message: 'Login successful', token });

 }catch(err){
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
 }
});


router.delete('/delete/:id',async(req,res)=>{
const {id} = req.params;
try{
    const manager=await Manager.findByPk(id);
    if(!manager){
        return res.status(404).json({ message: 'User not found' });
    }
     //delete employee
     await manager.destroy();
   res.status(200).json({ message: 'User deleted successfully' });
}catch(err){
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}
});

module.exports = router;

const express = require('express');
const { Op } = require('sequelize'); // Ensure Sequelize operators are imported
const authenticateEmployee =require('../../src/middleware/authenticateEmployee');
const {Employee, Department } = require('../../models/Associations'); 
const router = express.Router();

// POST /department/create - Add a new department
router.post('/create', async (req, res) => {
  const { name, location, availability,vacancies } = req.body;
  try {
    // Validation
    if (!name || !location || !availability|| !vacancies) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the department already exists
    const existingDepartment = await Department.findOne({ where: { name } });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    // Insert the department into the database
    const newDepartment = await Department.create({ name, location, availability,vacancies });
    res.status(201).json({ message: 'Department added successfully', department: newDepartment });
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// GET /department/view - Fetch all department or filter by name

router.get('/view',async(req,res)=>{
  const {name,availability,page=1,limit=10}=req.query;

  try{
    //convert page and limit to numbers
    const offset=(page-1)*limit;
    let whereCondition={};
  
    if (name) {
      // Filter managers by name (case insensitive)
      whereCondition.name = {
          [Op.iLike]:`%${name}%`,
      };
  }
  // Filter by availability
  if (availability) {
    whereCondition.availability = availability; // Exact match
  }
  //fetch paginated results
  const{count,rows}=await Department.findAndCountAll({
    where:whereCondition,
    limit:parseInt(limit),
    offset:parseInt(offset),
   });

   res.status(200).json({
    total: count, // Total number of records
    page: parseInt(page), // Current page number
    totalPages: Math.ceil(count / limit), // Total number of pages
    departments: rows, // Records for the current page
});
  }catch(err){
    console.error('Error fetching managers:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//GET /department/view/:id -Get  a department by ID
router.get('/view/:id',async(req,res)=>{
 const {id}=req.params;
 try{
  //fetch department by ID
  const department=await Department.findByPk(id);
  if(!department){
    return res.status(404).json({message:'Department not found'});
  }
  res.status(200).json(department);
 }catch(err){
   console.error('Error fetching manager:',err);
   res.status(500).json({message:'Internal server error'});
 }
});

//Update /department/view/:id - Update department 
router.put('/update/:id',async(req,res)=>{
  const{id}=req.params;
  const {name,location,availability,vacancies}=req.body;
  try{
    //find department by id
    const department=await Department.findByPk(id);
    if(!department){
      return res.status(404).json({message:'Department not found'});
    }
    //Update department details
    if(name)department.name=name;
    if(location)department.location=location
    if(availability)department.availability=availability
    if(vacancies)department.vacancies=vacancies
    //save updated department to the detabase
    await department.save();
    res.status(200).json({message:'Department updated successfully',department});
  }catch(err){
    console.error('Error updating department:',err);
    res.status(500).json({message:'Internal server error',error:err.message});
  }

});
router.get('/eligible/:employeeId', authenticateEmployee, async (req, res) => {
  const { employeeId } = req.params;

  try {

      // Fetch employee details
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }


      const { qualifications } = employee;

      // Fetch eligible departments
      const eligibleDepartments = await Department.findAll({
          where: {
              availability: 'Open',
              vacancies: { [Op.gt]: 0 },
              name: { [Op.iLike]: `%${qualifications}%` }, // Match department name with qualifications
          },
          attributes: ['id', 'name', 'vacancies'], // Fetch only relevant fields
      });



      res.status(200).json(eligibleDepartments);
  } catch (err) {
      console.error('Error fetching eligible departments:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/delete/:id',async(req,res)=>{
  const{id}=req.params;
  try{
    //find department by ID
    const department=await Department.findByPk(id);
    if(!department){
      return res.status(404).json({ message: 'Department not found' });
    }
            // Delete the department
   await department.destroy();
   res.status(200).json({ message: 'Department deleted successfully' });

  }catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}
});

module.exports = router;

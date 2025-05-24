const express=require('express');
const bcrypt=require('bcrypt');
const Employee=require('../../models/Employee');
const authenticate=require('../../src/middleware/authMiddleware');
const router=express.Router();

//GET /employee/profile/ -fetch logged-in employee's profile

router.get('/profile',authenticate,async(req,res)=>{
 if(req.user.role !== 'employee'){
    return res.status(403).json({message:'Access forbidden: Employees only'});
 }
 try{
    const employee=await Employee.findByPk(req.user.id);
    if(!employee){
    return res.status(404).json({message:'Employee not found'});
    }
    res.status(200).json(employee);
 }catch(err){
    console.error('Error fetching employee profile:', err);
    res.status(500).json({ message: 'Internal Server Error' });
 }
});
// PUT /employee/profile - Update logged-in employee's profile

router.put('/profile',authenticate,async(req,res)=>{
if(req.user.role !=='employee'){
    return res.status(403).json({ message: 'Access Forbidden: Employees only' });

}
const {name,email,password}=req.body;
try{
    const employee= await Employee.findByPk(req.user.id);
    if(!employee){
    return res.status(404).json({ message: 'Employee not found' });

    }
    if(name) employee.name=name;
    if(email)employee.email=email;
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        employee.password = hashedPassword;
    }
    await employee.save();
    res.status(200).json({ message: 'Profile updated successfully', employee });

}catch(err){
    console.error('Error updating employee profile:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}
});
module.exports = router;

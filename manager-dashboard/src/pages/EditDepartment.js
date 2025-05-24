import React,{useEffect,useState} from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';

const EditDepartment=()=>{
   const {id}=useParams(); //Get id department from url
   const[department,setDepartment]=useState({name:'',location:'',availability:'',vacancies:''});
   const[error,setError]=useState('');
   const[message,setMessage]=useState('');
   const navigate=useNavigate();

   //fetch the department details when compoent load
   useEffect(()=>{
    const fetchDepartment=async()=>{
        try{
           const response=await axios.get(`http://localhost:5000/department/view/${id}`);
           setDepartment(response.data);
        }catch(err){
           console.log('Error fetching department');
           setError('Failed to load department details');
        }

    };
    fetchDepartment();
   },[id]);
//handle submission
const handleSubmit=async (e)=>{
    e.preventDefault();
    setError('');
    setMessage('');
    try{
        await axios.put(`http://localhost:5000/department/update/${id}`, department);
        setMessage('Department updated successfully');
        setTimeout(()=>navigate('/view-department'),2000);//redirect to view department
    }catch(err){
        console.error('Error Updating department',err);
        setError('Failed to update department. Please try again');
    }
};
//handle changes input
const handleChange=(e)=>{
    setDepartment({...department,[e.target.name]:e.target.value});
}
return(
    <DashboardLayout>
    <div className="container mt-5">
    <h2>Edit Department</h2>
    {error && <div className="alert alert-danger">{error}</div>}
    {message && <div className="alert alert-success">{message}</div>}
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label className="form-label">Name</label>
            <input
                type="text"
                name="name"
                className="form-control"
                value={department.name}
                onChange={handleChange}
                required
            />
        </div>
        <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={department.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Availability</label>
                    <input
                        type="text"
                        name="availability"
                        className="form-control"
                        value={department.availability}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vacancies</label>
                    <input
                        type="text"
                        name="vacancies"
                        className="form-control"
                        value={department.vacancies}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Department</button>
            </form>
            </div>
            </DashboardLayout>
);
};

export default EditDepartment;
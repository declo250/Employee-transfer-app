import React,{useEffect,useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";

const EditManager = ()=>{
    const {id}= useParams();//Get the manager ID from the url
    const [manager,setManager]=useState({name:'',email:'',password:''});
    const [error,setError]=useState('');
    const [message,setMessage]=useState('');
    const navigate = useNavigate();


    //fetch the manager details when component loads
    useEffect(()=>{
        const fetchManager= async () =>{
            try{
                const response = await axios.get(`http://localhost:5000/manager/view/${id}`);
                setManager(response.data);
            }catch (err){
                console.error('Error Fetching manager');
                setError('Failed to load manager details');
            }
        };
        fetchManager();
    },[id])

    //handle form submission
    const handleSubmit=async (e)=>{
        e.preventDefault();
        setError('');
        setMessage('');
        
        try{
            await axios.put(`http://localhost:5000/manager/update/${id}`, manager);
            setMessage('Manager Updated Successfully');
            setTimeout(()=>navigate('/view-managers'),2000); //redicrect to view managers

        }catch (err){
            console.error('Error Updating Manager',err);
            setError('Failed to update manager. Please try again');
        }
    };
    //handle input changes 
    const handleChange= (e)=>{
        setManager({...manager,[e.target.name]:e.target.value});
    }
    return(
        <div className="container mt-5">
            <h2>Edit Manager</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={manager.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={manager.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Leave blank to keep current password"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Manager</button>
            </form>
            </div>
    );
}
export default EditManager;
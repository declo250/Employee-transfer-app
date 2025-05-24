import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
//import ViewManagers from './pages/ViewManagers';
import PrivateRoute from './components/PrivateRoute';
import Employee from './pages/Employee'; 
import Department from './pages/Department';
//import Transfers from './pages/Transfers'; 
import Users from './pages/Users';
import ViewDepartment from './pages/ViewDepartment';
import ViewManagers from './pages/ViewManagers'
import EditDepartment from './pages/EditDepartment';
import ViewEmployees from './pages/ViewEmployees';
import EditEmployee from './pages/EditEmployee';
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeDashboardLayout from './pages/EmployeeDashboardLayout';
import TransferRequest from "./pages/TransferRequest"; // Import Transfer Request form
import TransferRequestsList from "./pages/TransferRequestsList"; // Import Transfer Requests list
import TransferRequests from './pages/TransferRequests';
import AddManager from './pages/AddManager'

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect root (/) to /login or another route */}
                {/* Define other routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/DashboardLayout"
                 element={ <PrivateRoute>
                    <DashboardLayout/>
                </PrivateRoute>}
                
                />

                 <Route path="/employee/login" element={<EmployeeLogin />} />
                 <Route
                    path="/employee-dashboard"
                    element={
                        <PrivateRoute requiredRole="employee">
                            <EmployeeDashboardLayout/>
                        </PrivateRoute>
                    }
                />  
                <Route
        path="/employee/profile"
        element={
            <PrivateRoute requiredRole="employee">
                <EmployeeProfile />
            </PrivateRoute>
        }
    />

                <Route
                    path="/employees"
                    element={
                        <PrivateRoute>
                            <ViewEmployees/>
                        </PrivateRoute>
                    }
                />
                  <Route
                    path="/add-employee"
                    element={
                        <PrivateRoute>
                            <Employee />
                        </PrivateRoute>
                    }
                />
                        <Route
                    path="/edit-employee/:id"
                    element={
                        <PrivateRoute>
                            <EditEmployee />
                        </PrivateRoute>
                    }
                />

<Route
        path="/employee/transfer-request"
        element={
            <PrivateRoute requiredRole="employee">
                <TransferRequest />
            </PrivateRoute>
        }
    />
    <Route
        path="/employee/transfers"
        element={
            <PrivateRoute requiredRole="employee">
                <TransferRequest />
            </PrivateRoute>
        }
    />
    <Route
        path="/employee/my-transfers"
        element={
            <PrivateRoute requiredRole="employee">
                <TransferRequestsList />
            </PrivateRoute>
        }
    />
                 <Route
                    path="/department"
                    element={
                        <PrivateRoute>
                            <ViewDepartment />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/add-department"
                    element={
                        <PrivateRoute>
                            <Department />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-department"
                    element={
                        <PrivateRoute>
                            <EditDepartment/>
                        </PrivateRoute>
                    }
                />
                
                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <Users />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/view-department"
                    element={
                        <PrivateRoute>
                            <ViewDepartment />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/view-managers"
                    element={
                        <PrivateRoute>
                            <ViewManagers />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/edit-department/:id"
                    element={
                        <PrivateRoute>
                            <EditDepartment />
                        </PrivateRoute>
                    }
                />
               <Route
    path="/manager/transfers"
    element={
        <PrivateRoute requiredRole="manager">
            <TransferRequests />
        </PrivateRoute>
    }
/> <Route
                    path="/managers"
                    element={
                        <PrivateRoute>
                            <ViewManagers/>
                        </PrivateRoute>
                    }
                />

<Route
                    path="/add-manager"
                    element={
                        <PrivateRoute>
                            <AddManager />
                        </PrivateRoute>
                    }
                />

            </Routes>
           
        </Router>
    );
}

export default App;

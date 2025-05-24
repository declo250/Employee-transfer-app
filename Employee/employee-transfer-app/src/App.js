import React from "react";
import EmployeeList from "./components/EmployeeList";
import TransferRequestForm from "./components/TransferRequestForm";

const App = () => {
    return (
        <div>
            <h1>Employee Transfer Application</h1>
            <EmployeeList />
            <TransferRequestForm />
        </div>
    );
};

export default App;

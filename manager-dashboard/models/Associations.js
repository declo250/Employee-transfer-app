const Transfer = require('./Transfer');
const Employee = require('./Employee');
const Department = require('./Department');

// Define associations
Transfer.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });
Transfer.belongsTo(Department, { foreignKey: 'from_department_id', as: 'FromDepartment' });
Transfer.belongsTo(Department, { foreignKey: 'to_department_id', as: 'ToDepartment' });


Employee.hasMany(Transfer, { foreignKey: 'employee_id', as: 'Transfers' });

Department.hasMany(Transfer, { foreignKey: 'from_department_id', as: 'OutgoingTransfers' });
Department.hasMany(Transfer, { foreignKey: 'to_department_id', as: 'IncomingTransfers' });

// Missing Association: Employee belongs to Department
Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'Department' });
Department.hasMany(Employee, { foreignKey: 'department_id', as: 'Employees' });

module.exports = { Transfer, Employee, Department };

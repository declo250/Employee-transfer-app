const {DataTypes}=require('sequelize');
const sequelize = require('./db');
const Department = require('./Department');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure emails are unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Department, // Reference the Department model
            key: 'id',
        },
        onDelete: 'CASCADE', // Delete employees if the department is deleted
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'employee', // Default role is "employee"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    qualifications:{
        type:DataTypes.TEXT, //// Example: 'Finance', 'Marketing', etc.
        allowNull:false,
    },
}, {
    tableName: 'employees',
    timestamps: false, // Disable Sequelize's automatic timestamps
});


module.exports = Employee;

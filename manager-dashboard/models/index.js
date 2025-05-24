const Sequelize = require('sequelize');
const sequelize = require('./db'); // Your database connection file

const Employee = require('./Employee');
const Department = require('./Department');

// Initialize models
const models = {
    Employee: Employee.init(sequelize, Sequelize),
    Department: Department.init(sequelize, Sequelize),
};

// Define associations
models.Employee.associate(models);
models.Department.associate(models);

module.exports = models;

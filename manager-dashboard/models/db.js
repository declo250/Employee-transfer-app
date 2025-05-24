const { Sequelize } = require('sequelize');

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize('employee_transfer', 'postgres', 'Muhayimana@1992', {
    host: 'localhost', // Replace with your host if needed
    dialect: 'postgres', // Specifies PostgreSQL
    logging: false, // Set to true if you want to see SQL queries in the console
});

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;

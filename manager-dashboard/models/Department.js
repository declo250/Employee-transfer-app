const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import your Sequelize instance
const Transfer = require('./Transfer'); // Import Transfer model


const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure department names are unique
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    availability: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'Open', //open or closed.
    },
    vacancies:{
        type:DataTypes.INTEGER, // number of open positions
        allowNull:false,
    },
}, {
    tableName: 'departments', // Match the database table name
    timestamps: false,        // Disable Sequelize's automatic timestamps
});

module.exports = Department;

const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import your sequelize instance

const Manager = sequelize.define('Manager', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increment the ID
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Make sure this is required
    },
    email: {
        type: DataTypes.STRING,
        unique: true, // Ensure email is unique
        allowNull: false, // Ensure email is required
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure password is required
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically set the created_at timestamp
        allowNull: false,
    },
}, {
    tableName: 'managers', // Ensure the table name matches
    timestamps: false, // Disable Sequelize's automatic creation of `createdAt` and `updatedAt`
});

module.exports = Manager;

const {Sequelize, DataTypes} = require('sequelize');
const sequelize=require('./db');
const Department=require('./Department');
const Employee = require('./Employee'); // Import Employee model

const Transfer = sequelize.define('Transfer',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    employee_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Employee',
            key:'id',
        },
    },
    from_department_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Department',
            key:'id',
        },
    },
    to_department_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Department',
            key:'id',

        },
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'Pending'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    reason:{
        type:DataTypes.STRING,
        allowNull:false,
    },
},{
   tableName:'transfers',
   timestamps:false,
});
module.exports=Transfer;
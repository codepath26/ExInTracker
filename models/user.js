const sequelize = require('../utils/database')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
  name : {
    type : DataTypes.STRING,
    allowNull : false,
    
  },
  email : {
    type : DataTypes.STRING,
    allowNull : false,
    unique : true,
    validate : {
      isEmail : true,
    },
  },
  password : {
    type :  DataTypes.TEXT ,
    allowNull : false,
  },
  ispremiumuser : DataTypes.BOOLEAN ,
  totalExpenses : DataTypes.INTEGER ,
  
})


module.exports = User;
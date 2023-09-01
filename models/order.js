const sequelize = require('../utils/database')
const {DataTypes} = require('sequelize')

const Order = sequelize.define('order',{
  pamentId : DataTypes.STRING,
  orderId : DataTypes.STRING,
  status : DataTypes.STRING,
})


module.exports = Order;
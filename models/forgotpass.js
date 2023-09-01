const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

//id, name , password, phone number, role

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: DataTypes.BOOLEAN,
    expiresby: DataTypes.DATE
})

module.exports = Forgotpassword;
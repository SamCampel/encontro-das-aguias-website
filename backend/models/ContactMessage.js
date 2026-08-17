const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  phone: { type: DataTypes.STRING(50), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = ContactMessage;

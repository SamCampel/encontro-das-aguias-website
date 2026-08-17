const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true },
  address: { type: DataTypes.STRING(255), allowNull: false },
  resetPasswordToken: { type: DataTypes.STRING(255), allowNull: true },
  resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  paranoid: false, // Não usar soft delete automático do Sequelize, controlar manualmente
});

module.exports = Customer;
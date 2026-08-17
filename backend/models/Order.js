const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
 
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: true }, // null = pedido feito sem login (checkout avulso)
  customerName: { type: DataTypes.STRING(150), allowNull: false },
  customerEmail: { type: DataTypes.STRING(150), allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  // Fluxo: pending -> awaiting_review -> paid -> preparing -> ready -> delivered
  // (ou "rejected" se o admin recusar o comprovante, voltando o cliente a poder reenviar)
  status: { type: DataTypes.STRING(50), defaultValue: 'pending' },
});
 
module.exports = Order;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GalleryImage = sequelize.define('GalleryImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(150), allowNull: true },
  image: { type: DataTypes.STRING(255), allowNull: false },
});

module.exports = GalleryImage;

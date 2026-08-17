const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING(255), allowNull: true },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = BlogPost;

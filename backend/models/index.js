const { sequelize } = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const GalleryImage = require('./GalleryImage');
const BlogPost = require('./BlogPost');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Admin = require('./Admin');
const ContactMessage = require('./ContactMessage');
const Feedback = require('./Feedback');
const Setting = require('./Setting');
const Customer = require('./Customer');
const PaymentProof = require('./PaymentProof');

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Customer.hasMany(Order, { foreignKey: 'customerId' });
Customer.hasMany(PaymentProof, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(PaymentProof, { foreignKey: 'orderId' });
PaymentProof.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
  sequelize,
  Category,
  Product,
  GalleryImage,
  BlogPost,
  Order,
  OrderItem,
  Admin,
  Customer,
  PaymentProof,
  ContactMessage,
  Feedback,
  Setting,
  Customer,
};
'use strict';

// This is a baseline migration: on an existing installation it records the
// current schema without replacing tables or data; on a new database it builds
// the complete schema.
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    const tables = await queryInterface.showAllTables();
    const exists = (name) => tables.some((table) => String(table).toLowerCase() === name);
    const id = { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false };
    const timestamps = {
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    };
    const create = async (name, fields) => {
      if (!exists(name)) await queryInterface.createTable(name, { ...fields, ...timestamps });
    };

    await create('admins', { id, username: { type: DataTypes.STRING(100), allowNull: false, unique: true }, password: { type: DataTypes.STRING(255), allowNull: false }, name: DataTypes.STRING(150) });
    await create('blogposts', { id, title: { type: DataTypes.STRING(255), allowNull: false }, slug: { type: DataTypes.STRING(255), allowNull: false, unique: true }, content: { type: DataTypes.TEXT, allowNull: false }, image: DataTypes.STRING(255), published: { type: DataTypes.BOOLEAN, defaultValue: true } });
    await create('categories', { id, name: { type: DataTypes.STRING(100), allowNull: false, unique: true }, slug: { type: DataTypes.STRING(100), allowNull: false, unique: true } });
    await create('contactmessages', { id, name: { type: DataTypes.STRING(150), allowNull: false }, email: { type: DataTypes.STRING(150), allowNull: false }, phone: DataTypes.STRING(50), message: { type: DataTypes.TEXT, allowNull: false } });
    await create('customers', { id, name: { type: DataTypes.STRING(150), allowNull: false }, email: { type: DataTypes.STRING(150), allowNull: false, unique: true }, password: { type: DataTypes.STRING(255), allowNull: false }, phone: { type: DataTypes.STRING(20), allowNull: false }, cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true }, address: { type: DataTypes.STRING(255), allowNull: false }, resetPasswordToken: DataTypes.STRING(255), resetPasswordExpires: DataTypes.DATE, deletedAt: DataTypes.DATE });
    await create('feedbacks', { id, name: { type: DataTypes.STRING(150), allowNull: false }, message: { type: DataTypes.TEXT, allowNull: false }, approved: { type: DataTypes.BOOLEAN, defaultValue: false } });
    await create('galleryimages', { id, title: DataTypes.STRING(150), image: { type: DataTypes.STRING(255), allowNull: false } });
    await create('settings', { id, key: { type: DataTypes.STRING(100), allowNull: false, unique: true }, value: DataTypes.TEXT });
    await create('products', { id, name: { type: DataTypes.STRING(255), allowNull: false }, slug: { type: DataTypes.STRING(255), allowNull: false, unique: true }, description: DataTypes.TEXT, price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }, image: DataTypes.STRING(255), categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'categories', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }, stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, featured: { type: DataTypes.BOOLEAN, defaultValue: false } });
    await create('orders', { id, customerId: { type: DataTypes.INTEGER, references: { model: 'customers', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' }, customerName: { type: DataTypes.STRING(150), allowNull: false }, customerEmail: { type: DataTypes.STRING(150), allowNull: false }, total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }, status: { type: DataTypes.STRING(50), defaultValue: 'pending' } });
    await create('orderitems', { id, orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }, productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }, quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 } });
    await create('paymentproofs', { id, orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }, customerId: { type: DataTypes.INTEGER, references: { model: 'customers', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' }, filePath: { type: DataTypes.STRING(255), allowNull: false }, originalName: DataTypes.STRING(255), status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' }, reviewedByAdminId: DataTypes.INTEGER, reviewedAt: DataTypes.DATE, rejectionReason: DataTypes.STRING(255) });
  },

  async down() {
    // The initial migration may have been baselined against a live database;
    // never delete application data automatically during an undo operation.
  },
};

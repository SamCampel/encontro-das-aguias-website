const { Order, OrderItem, Product, Customer, PaymentProof } = require('../models');
const { ORDER_STATUS, ADMIN_SETTABLE_STATUSES } = require('../utils/orderStatus');

// GET /admin/orders?status=preparing  (sem status = todos)
exports.listOrders = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};

  const orders = await Order.findAll({
    where,
    include: [
      { model: OrderItem, include: [Product] },
      { model: Customer, attributes: ['id', 'name', 'email', 'phone'] },
      { model: PaymentProof },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
};

// GET /admin/orders/receipts/pending
exports.listPendingReceipts = async (_req, res) => {
  const proofs = await PaymentProof.findAll({
    where: { status: 'pending' },
    include: [{ model: Order, include: [Customer] }],
    order: [['createdAt', 'ASC']],
  });
  res.json(proofs);
};

// PATCH /admin/orders/receipts/:id/approve
exports.approveReceipt = async (req, res) => {
  const proof = await PaymentProof.findByPk(req.params.id, { include: [Order] });
  if (!proof) return res.status(404).json({ message: 'Comprovante não encontrado' });

  proof.status = 'approved';
  proof.reviewedByAdminId = req.admin.id;
  proof.reviewedAt = new Date();
  await proof.save();

  proof.Order.status = ORDER_STATUS.PAID;
  await proof.Order.save();

  res.json({ message: 'Comprovante aprovado, pedido marcado como pago', proof });
};

// PATCH /admin/orders/receipts/:id/reject  body: { reason }
exports.rejectReceipt = async (req, res) => {
  const proof = await PaymentProof.findByPk(req.params.id, { include: [Order] });
  if (!proof) return res.status(404).json({ message: 'Comprovante não encontrado' });

  proof.status = 'rejected';
  proof.reviewedByAdminId = req.admin.id;
  proof.reviewedAt = new Date();
  proof.rejectionReason = req.body.reason || null;
  await proof.save();

  // Pedido volta para "rejected" para que o cliente possa reenviar o comprovante.
  proof.Order.status = ORDER_STATUS.REJECTED;
  await proof.Order.save();

  res.json({ message: 'Comprovante recusado, cliente poderá reenviar', proof });
};

// PATCH /admin/orders/:id/status  body: { status: 'preparing' | 'ready' | 'delivered' }
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!ADMIN_SETTABLE_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status inválido. Use um de: ${ADMIN_SETTABLE_STATUSES.join(', ')}` });
  }

  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });

  if (order.status !== ORDER_STATUS.PAID && status === ORDER_STATUS.PREPARING) {
    return res.status(400).json({ message: 'Só é possível iniciar o preparo de pedidos já pagos' });
  }

  order.status = status;
  await order.save();
  res.json(order);
};
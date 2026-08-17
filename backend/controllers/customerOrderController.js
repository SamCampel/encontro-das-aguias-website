const { Order, OrderItem, Product, PaymentProof } = require('../models');
const { ORDER_STATUS } = require('../utils/orderStatus');

exports.listMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { customerId: req.customer.id },
    include: [
      { model: OrderItem, include: [Product] },
      { model: PaymentProof },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
};

exports.getMyOrderById = async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, customerId: req.customer.id },
    include: [
      { model: OrderItem, include: [Product] },
      { model: PaymentProof },
    ],
  });
  if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
  res.json(order);
};

// Cliente envia o comprovante do Pix para um pedido que ainda não foi pago/aprovado.
exports.uploadReceipt = async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id, customerId: req.customer.id } });
  if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });

  if (![ORDER_STATUS.PENDING, ORDER_STATUS.REJECTED].includes(order.status)) {
    return res.status(400).json({ message: 'Este pedido não está aguardando comprovante' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Envie um arquivo de imagem ou PDF do comprovante' });
  }

  const proof = await PaymentProof.create({
    orderId: order.id,
    filePath: `/uploads/receipts/${req.file.filename}`,
    originalName: req.file.originalname,
    status: 'pending',
  });

  order.status = ORDER_STATUS.AWAITING_REVIEW;
  await order.save();

  res.status(201).json({ message: 'Comprovante enviado, aguardando confirmação', proof, order });
};
// Fluxo do pedido:
// PENDING -> AWAITING_REVIEW -> PAID -> PREPARING -> READY -> DELIVERED
//                             \-> REJECTED -> (cliente reenvia) -> AWAITING_REVIEW
const ORDER_STATUS = {
  PENDING: 'pending', // aguardando pagamento / comprovante
  AWAITING_REVIEW: 'awaiting_review', // comprovante enviado, aguardando aprovação do admin
  PAID: 'paid', // pagamento confirmado pelo admin
  PREPARING: 'preparing', // pedido em preparo
  READY: 'ready', // pronto para retirada/entrega
  DELIVERED: 'delivered', // finalizado
  REJECTED: 'rejected', // comprovante recusado
};

// Quais status o admin pode setar manualmente via PATCH /admin/orders/:id/status
const ADMIN_SETTABLE_STATUSES = [
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.DELIVERED,
];

module.exports = { ORDER_STATUS, ADMIN_SETTABLE_STATUSES };
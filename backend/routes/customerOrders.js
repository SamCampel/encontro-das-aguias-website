const express = require('express');
const router = express.Router();
const { verifyCustomerToken } = require('../middleware/customerAuth');
const uploadReceipt = require('../middleware/uploadReceipt');
const customerOrderController = require('../controllers/customerOrderController');

router.get('/mine', verifyCustomerToken, customerOrderController.listMyOrders);
router.get('/mine/:id', verifyCustomerToken, customerOrderController.getMyOrderById);
router.post(
  '/:id/receipt',
  verifyCustomerToken,
  uploadReceipt.single('receipt'),
  customerOrderController.uploadReceipt,
);

module.exports = router;
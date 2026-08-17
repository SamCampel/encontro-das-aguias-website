const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const adminOrderController = require('../controllers/adminOrderController');

router.get('/', verifyToken, adminOrderController.listOrders);
router.patch('/:id/status', verifyToken, adminOrderController.updateOrderStatus);

router.get('/receipts/pending', verifyToken, adminOrderController.listPendingReceipts);
router.patch('/receipts/:id/approve', verifyToken, adminOrderController.approveReceipt);
router.patch('/receipts/:id/reject', verifyToken, adminOrderController.rejectReceipt);

module.exports = router;
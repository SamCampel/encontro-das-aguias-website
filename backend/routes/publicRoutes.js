const express = require('express');
const { body, validationResult } = require('express-validator');
const publicController = require('../controllers/publicController');
const asyncHandler = require('../utils/asyncHandler');
const { verifyCustomerToken } = require('../middleware/customerAuth');

const router = express.Router();

router.get('/products', asyncHandler(publicController.getProducts));
router.get('/categories', asyncHandler(publicController.getCategories));
router.get('/products/:id', asyncHandler(publicController.getProductById));
router.get('/gallery', asyncHandler(publicController.getGallery));
router.get('/blog', asyncHandler(publicController.getBlogPosts));
router.get('/blog/:slug', asyncHandler(publicController.getBlogPostBySlug));
router.get('/feedbacks', asyncHandler(publicController.getFeedbacks));
router.get('/settings', asyncHandler(publicController.getSettings));
router.get('/pix/qrcode', verifyCustomerToken, asyncHandler(publicController.generatePixQrCode));
router.post('/pix/qrcode-total', verifyCustomerToken, [body('items').isArray({ min: 1 }).withMessage('Carrinho inválido')], asyncHandler(publicController.generatePixTotalQrCode));
router.get('/whatsapp/qrcode', asyncHandler(publicController.getWhatsAppQrCode));
router.get('/date', asyncHandler(publicController.getCurrentDate));

router.post('/feedbacks', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('message').notEmpty().withMessage('Mensagem é obrigatória'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, asyncHandler(publicController.createFeedback));

router.post('/contact', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('message').notEmpty().withMessage('Mensagem é obrigatória'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, asyncHandler(publicController.createContactMessage));

module.exports = router;

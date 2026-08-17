const express = require('express');
const { body } = require('express-validator');
const upload = require('../config/multer');
const { verifyToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Muitas tentativas. Tente novamente em alguns minutos.' } });

router.post('/login', loginLimiter, [
  body('username').notEmpty().withMessage('Usuário é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], asyncHandler(adminController.login));

router.get('/dashboard', verifyToken, asyncHandler(adminController.getDashboard));
router.get('/products', verifyToken, asyncHandler(adminController.getProducts));
const productValidation = [body('name').trim().notEmpty(), body('price').isFloat({ min: 0 }), body('categoryId').isInt({ min: 1 })];
router.get('/categories', verifyToken, asyncHandler(adminController.getCategories));
router.post('/products', verifyToken, upload.single('image'), productValidation, asyncHandler(adminController.createProduct));
router.put('/products/:id', verifyToken, upload.single('image'), productValidation, asyncHandler(adminController.updateProduct));
router.delete('/products/:id', verifyToken, asyncHandler(adminController.deleteProduct));

router.get('/posts', verifyToken, asyncHandler(adminController.getPosts));
const postValidation = [body('title').trim().notEmpty(), body('content').optional().isString()];
router.post('/posts', verifyToken, upload.single('image'), postValidation, asyncHandler(adminController.createPost));
router.put('/posts/:id', verifyToken, upload.single('image'), postValidation, asyncHandler(adminController.updatePost));
router.delete('/posts/:id', verifyToken, asyncHandler(adminController.deletePost));

router.get('/gallery', verifyToken, asyncHandler(adminController.getGallery));
router.post('/gallery', verifyToken, upload.array('images', 10), body('title').optional().trim(), asyncHandler(adminController.createGalleryImage));
router.delete('/gallery/:id', verifyToken, asyncHandler(adminController.deleteGalleryImage));

router.get('/feedbacks', verifyToken, asyncHandler(adminController.getFeedbacks));
router.put('/feedbacks/:id', verifyToken, asyncHandler(adminController.toggleFeedback));
router.delete('/feedbacks/:id', verifyToken, asyncHandler(adminController.deleteFeedback));
router.get('/messages', verifyToken, asyncHandler(adminController.getMessages));
router.delete('/messages/:id', verifyToken, asyncHandler(adminController.deleteMessage));
router.get('/settings', verifyToken, asyncHandler(adminController.getSettings));
router.post('/settings', verifyToken, asyncHandler(adminController.saveSettings));

module.exports = router;

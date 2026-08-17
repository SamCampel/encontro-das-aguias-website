const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { verifyCustomerToken } = require('../middleware/customerAuth');
const customerAuthController = require('../controllers/customerAuthController');
const { isValidCpf, removeCpfMask } = require('../utils/validateCpf');

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = {};
    errors.array().forEach((err) => {
      fieldErrors[err.param] = err.msg;
    });
    return res.status(400).json({ errors: fieldErrors });
  }
  next();
};

// Validações para cadastro
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Telefone é obrigatório'),
  body('cpf')
    .trim()
    .notEmpty()
    .withMessage('CPF é obrigatório')
    .custom((value) => {
      if (!isValidCpf(value)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Endereço é obrigatório'),
];

// Validações para atualização de perfil
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('email')
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('cpf')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isValidCpf(value)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),
  body('address')
    .optional()
    .trim(),
];

router.post('/register', registerValidation, handleValidationErrors, customerAuthController.register);
router.post('/login', customerAuthController.login);
router.post('/forgot-password', customerAuthController.forgotPassword);
router.post('/reset-password', customerAuthController.resetPassword);

router.get('/me', verifyCustomerToken, customerAuthController.me);
router.put('/me', verifyCustomerToken, updateProfileValidation, handleValidationErrors, customerAuthController.updateProfile);
router.delete('/me', verifyCustomerToken, customerAuthController.deleteAccount);

module.exports = router;
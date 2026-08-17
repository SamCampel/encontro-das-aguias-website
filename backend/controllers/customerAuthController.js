const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Customer } = require('../models');
const { removeCpfMask } = require('../utils/validateCpf');

function signCustomerToken(customer) {
  return jwt.sign(
    { id: customer.id, email: customer.email, role: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, cpf, address } = req.body;

    // Normalizar dados
    const normalizedEmail = String(email).trim().toLowerCase();
    const cleanCpf = removeCpfMask(cpf);

    // Verificar unicidade de e-mail
    const existingEmail = await Customer.findOne({ where: { email: normalizedEmail } });
    if (existingEmail) {
      return res.status(409).json({ errors: { email: 'Este e-mail já está cadastrado' } });
    }

    // Verificar unicidade de CPF
    const existingCpf = await Customer.findOne({ where: { cpf: cleanCpf } });
    if (existingCpf) {
      return res.status(409).json({ errors: { cpf: 'Este CPF já está cadastrado' } });
    }

    const hashed = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      phone: phone.trim(),
      cpf: cleanCpf,
      address: address.trim(),
    });

    const token = signCustomerToken(customer);
    res.status(201).json({
      token,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    res.status(500).json({ message: 'Erro ao processar cadastro' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
  }

  const customer = await Customer.findOne({ where: { email: String(email).trim().toLowerCase() } });
  if (!customer) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  // Verificar se a conta foi deletada (soft delete)
  if (customer.deletedAt) {
    return res.status(401).json({ message: 'Esta conta foi deletada' });
  }

  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const token = signCustomerToken(customer);
  res.json({
    token,
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
};

exports.me = async (req, res) => {
  const customer = await Customer.findByPk(req.customer.id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
  });
  if (!customer) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(customer);
};

exports.updateProfile = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customer.id);
    if (!customer) return res.status(404).json({ message: 'Cliente não encontrado' });

    const { name, email, phone, cpf, address, password, newPassword } = req.body;
    const updates = {};

    // Se o cliente está tentando alterar a senha
    if (password && newPassword) {
      const validPassword = await bcrypt.compare(password, customer.password);
      if (!validPassword) {
        return res.status(401).json({ errors: { currentPassword: 'Senha atual inválida' } });
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    // Normalizar e verificar unicidade de e-mail (se fornecido e diferente)
    if (email && email !== customer.email) {
      const normalizedEmail = String(email).trim().toLowerCase();
      const existingEmail = await Customer.findOne({ where: { email: normalizedEmail } });
      if (existingEmail) {
        return res.status(409).json({ errors: { email: 'Este e-mail já está cadastrado' } });
      }
      updates.email = normalizedEmail;
    }

    // Normalizar e verificar unicidade de CPF (se fornecido e diferente)
    if (cpf && cpf !== customer.cpf) {
      const cleanCpf = removeCpfMask(cpf);
      const existingCpf = await Customer.findOne({ where: { cpf: cleanCpf } });
      if (existingCpf) {
        return res.status(409).json({ errors: { cpf: 'Este CPF já está cadastrado' } });
      }
      updates.cpf = cleanCpf;
    }

    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (address) updates.address = address.trim();

    await customer.update(updates);

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
      address: customer.address,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao processar atualização' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customer.id);
    if (!customer) return res.status(404).json({ message: 'Cliente não encontrado' });

    // Soft delete - marcar como deletado
    customer.deletedAt = new Date();
    await customer.save();

    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ message: 'Erro ao processar exclusão da conta' });
  }
};

// Gera um token de recuperação de senha. Em produção, envie esse token por
// e-mail (ex: via nodemailer) em vez de devolvê-lo na resposta.
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const customer = await Customer.findOne({ where: { email: String(email).trim().toLowerCase() } });

  // Não revela se o e-mail existe ou não, por segurança.
  if (!customer) {
    return res.json({ message: 'Se o e-mail existir, um link de recuperação será enviado' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  customer.resetPasswordToken = resetToken;
  customer.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await customer.save();

  // TODO: enviar `resetToken` por e-mail para o cliente (nodemailer, SES, etc.)
  res.json({ message: 'Se o e-mail existir, um link de recuperação será enviado' });
};

exports.resetPassword = async (req, res) => {
  // Implementar conforme necessário
  res.status(501).json({ message: 'Endpoint não implementado' });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
  }

  const { Op } = require('sequelize');
  const customer = await Customer.findOne({
    where: { resetPasswordToken: token, resetPasswordExpires: { [Op.gt]: new Date() } },
  });

  if (!customer) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  customer.password = await bcrypt.hash(password, 10);
  customer.resetPasswordToken = null;
  customer.resetPasswordExpires = null;
  await customer.save();

  res.json({ message: 'Senha atualizada com sucesso' });
};
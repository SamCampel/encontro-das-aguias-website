const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./config/database');
require('./models');

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const customerAuthRoutes = require('./routes/customerAuth');
const customerOrderRoutes = require('./routes/customerOrders');
const adminOrderRoutes = require('./routes/adminOrders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/customers', customerAuthRoutes);
app.use('/api/orders', customerOrderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'MulterError') return res.status(400).json({ message: `Upload inválido: ${err.message}` });
  if (err.message === 'Somente imagens são permitidas') return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: 'Erro interno do servidor' });
});

sequelize.authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco:', error);
  });

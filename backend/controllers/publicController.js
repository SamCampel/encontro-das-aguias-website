const { Product, Category, BlogPost, GalleryImage, Feedback, ContactMessage, Setting, Order, OrderItem } = require('../models');
const QRCode = require('qrcode');
const moment = require('moment-timezone');
const { buildPixPayload } = require('../utils/pix');

async function paymentConfig() {
  const settings = await Setting.findAll({ where: { key: ['pixKey', 'pixName', 'pixCity', 'whatsappNumber'] } });
  const values = Object.fromEntries(settings.map((item) => [item.key, item.value]));
  return {
    pixKey: values.pixKey || process.env.PIX_KEY,
    pixName: values.pixName || process.env.PIX_NAME,
    pixCity: values.pixCity || process.env.PIX_CITY,
    whatsappNumber: values.whatsappNumber || process.env.WHATSAPP_NUMBER,
  };
}

exports.getHomeProducts = async (req, res) => {
  const category = req.query.category;
  const where = category ? { categoryId: category } : {};
  const products = await Product.findAll({ where, include: Category, order: [['createdAt', 'DESC']] });
  res.json(products);
};

exports.getProducts = async (req, res) => {
  const category = req.query.category;
  const where = category ? { categoryId: category } : {};
  const products = await Product.findAll({ where, include: Category, order: [['createdAt', 'DESC']] });
  res.json(products);
};

exports.getCategories = async (_req, res) => res.json(await Category.findAll({ order: [['name', 'ASC']] }));

exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: Category });
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json(product);
};

exports.getGallery = async (_req, res) => {
  const images = await GalleryImage.findAll({ order: [['createdAt', 'DESC']] });
  res.json(images);
};

exports.getBlogPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const posts = await BlogPost.findAndCountAll({ where: { published: true }, limit, offset, order: [['createdAt', 'DESC']] });
  res.json(posts);
};

exports.getBlogPostBySlug = async (req, res) => {
  const post = await BlogPost.findOne({ where: { slug: req.params.slug, published: true } });
  if (!post) return res.status(404).json({ message: 'Post não encontrado' });
  res.json(post);
};

exports.getFeedbacks = async (_req, res) => {
  const feedbacks = await Feedback.findAll({ where: { approved: true }, order: [['createdAt', 'DESC']] });
  res.json(feedbacks);
};

exports.createFeedback = async (req, res) => {
  const feedback = await Feedback.create({ name: req.body.name, message: req.body.message });
  res.status(201).json(feedback);
};

exports.createContactMessage = async (req, res) => {
  const message = await ContactMessage.create(req.body);
  res.status(201).json(message);
};

exports.getSettings = async (_req, res) => {
  const settings = await Setting.findAll();
  const payload = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  res.json(payload);
};

exports.generatePixQrCode = async (req, res) => {
  const { amount } = req.query;
  const productId = req.query.productId;
  const product = productId ? await Product.findByPk(productId) : null;
  if (productId && !product) return res.status(404).json({ message: 'Produto não encontrado' });
  const value = product ? Number(product.price) : Number(amount);
  const config = await paymentConfig();
  const payload = buildPixPayload({ key: config.pixKey, name: config.pixName, city: config.pixCity, amount: value });
  const dataUrl = await QRCode.toDataURL(payload);
  res.json({ payload, qrCode: dataUrl, value });
};

exports.generatePixTotalQrCode = async (req, res) => {
  const products = await Product.findAll({ where: { id: req.body.items.map((item) => item.id) } });
  if (products.length !== req.body.items.length) return res.status(400).json({ message: 'Um ou mais produtos não existem' });
  const quantities = new Map(req.body.items.map((item) => [Number(item.id), Number(item.quantity)]));
  if ([...quantities.values()].some((quantity) => !Number.isInteger(quantity) || quantity < 1)) return res.status(400).json({ message: 'Quantidades inválidas' });
  const total = products.reduce((sum, product) => sum + Number(product.price) * quantities.get(product.id), 0);
  const config = await paymentConfig();
  const payload = buildPixPayload({ key: config.pixKey, name: config.pixName, city: config.pixCity, amount: total });
  const dataUrl = await QRCode.toDataURL(payload);
  const order = await Order.create({ customerId: req.customer.id, customerName: 'Checkout Pix', customerEmail: 'nao-informado@local', total, status: 'pending' });
  await OrderItem.bulkCreate(products.map((product) => ({ orderId: order.id, productId: product.id, quantity: quantities.get(product.id), price: product.price })));
  res.json({ payload, qrCode: dataUrl, total, orderId: order.id });
};

exports.getWhatsAppQrCode = async (_req, res) => {
  const config = await paymentConfig();
  const payload = `https://wa.me/${config.whatsappNumber}`;
  const dataUrl = await QRCode.toDataURL(payload);
  res.json({ qrCode: dataUrl });
};

exports.getCurrentDate = (_req, res) => {
  res.json({ date: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss') });
};

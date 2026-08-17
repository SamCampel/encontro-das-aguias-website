const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Product, Category, BlogPost, GalleryImage, Feedback, ContactMessage, Setting } = require('../models');
const slugify = require('slugify');
const { validationResult } = require('express-validator');
const { sanitizeHtml } = require('../utils/sanitizeHtml');

const asBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(401).json({ message: 'Credenciais inválidas' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    res.json({ token, admin: { id: admin.id, username: admin.username, name: admin.name } });
};

exports.getDashboard = async (_req, res) => {
    const [products, posts, gallery, feedbacks, messages] = await Promise.all([
        Product.count(),
        BlogPost.count(),
        GalleryImage.count(),
        Feedback.count(),
        ContactMessage.count(),
    ]);

    res.json({ products, posts, gallery, feedbacks, messages });
};

exports.getProducts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const products = await Product.findAndCountAll({ include: Category, limit, offset, order: [['createdAt', 'DESC']] });
    res.json(products);
};

exports.getCategories = async (_req, res) => res.json(await Category.findAll({ order: [['name', 'ASC']] }));

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const payload = {
            name: req.body.name,
            slug: slugify(req.body.name, { lower: true, strict: true }),
            description: sanitizeHtml(req.body.description),
            price: req.body.price,
            stock: req.body.stock || 0,
            featured: asBoolean(req.body.featured),
            categoryId: req.body.categoryId,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        };

        const product = await Product.create(payload);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    const payload = {
        name: req.body.name || product.name,
        slug: req.body.name ? slugify(req.body.name, { lower: true, strict: true }) : product.slug,
        description: req.body.description !== undefined ? sanitizeHtml(req.body.description) : product.description,
        price: req.body.price !== undefined ? req.body.price : product.price,
        stock: req.body.stock !== undefined ? req.body.stock : product.stock,
        featured: req.body.featured !== undefined ? asBoolean(req.body.featured) : product.featured,
        categoryId: req.body.categoryId !== undefined ? req.body.categoryId : product.categoryId,
    };

    if (req.file) payload.image = `/uploads/${req.file.filename}`;

    await product.update(payload);
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    await product.destroy();
    res.json({ message: 'Produto removido' });
};

exports.getPosts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const posts = await BlogPost.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
    res.json(posts);
};

exports.createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = {
        title: req.body.title,
        slug: slugify(req.body.title, { lower: true, strict: true }),
        content: sanitizeHtml(req.body.content),
        image: req.file ? `/uploads/${req.file.filename}` : null,
        published: req.body.published !== undefined ? asBoolean(req.body.published) : true,
    };

    const post = await BlogPost.create(payload);
    res.status(201).json(post);
};

exports.updatePost = async (req, res) => {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });
    const payload = {
        title: req.body.title || post.title,
        slug: req.body.title ? slugify(req.body.title, { lower: true, strict: true }) : post.slug,
        content: req.body.content !== undefined ? sanitizeHtml(req.body.content) : post.content,
        published: req.body.published !== undefined ? asBoolean(req.body.published) : post.published,
    };
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    await post.update(payload);
    res.json(post);
};

exports.deletePost = async (req, res) => {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });
    await post.destroy();
    res.json({ message: 'Post removido' });
};

exports.getGallery = async (_req, res) => {
    const images = await GalleryImage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(images);
};

exports.createGalleryImage = async (req, res) => {
    if (!req.files?.length) return res.status(400).json({ message: 'Selecione ao menos uma imagem' });
    const images = await GalleryImage.bulkCreate(req.files.map((file) => ({
        title: req.body.title || '', image: `/uploads/${file.filename}`,
    })));
    res.status(201).json(images);
};

exports.deleteGalleryImage = async (req, res) => {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Imagem não encontrada' });
    await image.destroy();
    res.json({ message: 'Imagem removida' });
};

exports.getFeedbacks = async (_req, res) => {
    const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedbacks);
};

exports.toggleFeedback = async (req, res) => {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback não encontrado' });
    feedback.approved = !feedback.approved;
    await feedback.save();
    res.json(feedback);
};

exports.deleteFeedback = async (req, res) => {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback não encontrado' });
    await feedback.destroy();
    res.json({ message: 'Feedback removido' });
};

exports.getMessages = async (_req, res) => {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
};

exports.deleteMessage = async (req, res) => {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: 'Mensagem não encontrada' });
    await message.destroy();
    res.json({ message: 'Mensagem removida' });
};

exports.getSettings = async (_req, res) => {
    const settings = await Setting.findAll();
    res.json(settings);
};

exports.saveSettings = async (req, res) => {
    const allowedKeys = new Set(['about', 'whatsappNumber', 'pixKey', 'pixName', 'pixCity']);
    const entries = req.body.settings ? Object.entries(req.body.settings) : [[req.body.key, req.body.value]];
    if (entries.some(([key]) => !allowedKeys.has(key))) return res.status(400).json({ message: 'Configuração inválida' });
    const saved = await Promise.all(entries.map(async ([key, value]) => {
        const safeValue = key === 'about' ? sanitizeHtml(value) : String(value || '').trim();
        const [setting] = await Setting.findOrCreate({ where: { key }, defaults: { value: safeValue } });
        await setting.update({ value: safeValue });
        return setting;
    }));
    res.json(saved);
};

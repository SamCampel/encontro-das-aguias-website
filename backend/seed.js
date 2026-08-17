const bcrypt = require('bcryptjs');
const { Admin, Category } = require('./models');

async function seedAdmin() {
  const existing = await Admin.findOne({ where: { username: 'admin' } });
  if (existing) console.log('Admin já existe');
  else {
    const hashed = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashed, name: 'Administrador' });
  }
  await Category.bulkCreate([
    ['Personalizados', 'personalizados'], ['Canecas', 'canecas'], ['Camisetas', 'camisetas'], ['Joias', 'joias'], ['Ebooks', 'ebooks'],
  ].map(([name, slug]) => ({ name, slug })), { ignoreDuplicates: true });
  console.log('Categorias padrão verificadas com sucesso');
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});

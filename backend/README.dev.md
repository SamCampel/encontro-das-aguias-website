# Backend — Manual para desenvolvedores

## Visão geral da arquitetura

O backend usa um padrão MVC leve com camadas claras:
- `routes/` define as rotas da API.
- `controllers/` contém a lógica de negócio e respostas às requisições.
- `models/` define as tabelas do banco usando Sequelize.
- `middleware/` implementa autenticação e validação de uploads.
- `config/` guarda configurações de banco e upload.
- `utils/` traz helpers reutilizáveis: tratamento de async, geração de Pix e sanitização.

A aplicação é um servidor Express que expõe API REST consumida pelo frontend React.

## Stack e bibliotecas

- Node.js + Express: servidor HTTP e roteamento.
- MySQL via Sequelize: ORM principal.
- dotenv: configurações via `.env`.
- bcryptjs: hash de senha para admins e clientes.
- jsonwebtoken: autenticação JWT.
- express-validator: validações de dados nas requisições.
- multer: upload de arquivos.
- qrcode: geração de QR Code Pix e WhatsApp.
- slugify: gerar slugs amigáveis para URLs.
- moment-timezone: data/hora localizada.
- cors: permitir acesso do frontend.
- express-rate-limit: limitar tentativas de login.

## Estrutura de pastas

- `backend/`
  - `config/`
    - `database.js`: conecta o Sequelize ao MySQL usando variáveis de ambiente.
    - `multer.js`: configura upload de arquivos e diretório `uploads/`.
  - `controllers/`
    - `adminController.js`: ações do painel admin (produtos, blog, galeria, feedback, mensagens, settings).
    - `adminOrderController.js`: endpoints de pedidos e comprovantes para admin.
    - `customerAuthController.js`: registro, login, recuperação e perfil do cliente.
    - `publicController.js`: dados públicos do site, geração de QR Code Pix/WhatsApp, produtos, blog, galeria, feedback, contato.
  - `middleware/`
    - `auth.js`: valida token JWT admin e protege rotas `/api/admin`.
    - `customerAuth.js`: valida token JWT de cliente para rotas privadas de cliente.
    - `uploadReceipt.js`: valida uploads de comprovantes de pagamento (não utilizado diretamente no frontend).
  - `models/`
    - `Admin.js`, `Customer.js`, `Product.js`, `Category.js`, `BlogPost.js`, `GalleryImage.js`, `Feedback.js`, `ContactMessage.js`, `Setting.js`, `Order.js`, `OrderItem.js`, `PaymentProof.js`.
    - `index.js`: importa modelos e define relações.
  - `routes/`
    - `publicRoutes.js`: rotas abertas do site.
    - `adminRoutes.js`: rotas protegidas do painel admin.
    - `adminOrders.js`: rotas protegidas de pedidos/recibos.
    - `customerAuth.js`: rotas de cadastro/login/recuperação de clientes.
  - `utils/`
    - `asyncHandler.js`: captura erros de controllers assíncronos.
    - `pix.js`: monta payload Pix e CRC16.
    - `sanitizeHtml.js`: limpa HTML antes de salvar conteúdos.
  - `uploads/`: diretório para imagens e comprovantes enviados.
  - `seed.js`: inicializa admin padrão e categorias.
  - `server.js`: ponto de entrada do servidor.

## Onde encontrar

- Rotas API gerais: `backend/routes/publicRoutes.js`.
- Rotas admin: `backend/routes/adminRoutes.js`.
- Rotas de pedidos admin: `backend/routes/adminOrders.js`.
- Controllers: `backend/controllers/*.js`.
- Models: `backend/models/*.js`.
- Autenticação admin: `backend/middleware/auth.js`.
- Autenticação cliente: `backend/middleware/customerAuth.js`.
- Upload de imagens: `backend/config/multer.js`.
- Geração de Pix: `backend/utils/pix.js`.

## Como rodar localmente

1. Instale dependências:
   ```bash
   cd backend
   npm install
   ```
2. Crie o arquivo `.env` na raiz do backend com as variáveis necessárias:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=aguias_db
   DB_USER=root
   DB_PASS=senha
   JWT_SECRET=uma_chave_forte
   JWT_EXPIRES_IN=8h
   FRONTEND_URL=http://localhost:5173
   PIX_KEY=sua_chave_pix
   PIX_NAME=Nome Recebedor
   PIX_CITY=SAO PAULO
   WHATSAPP_NUMBER=5511999999999
   ```
3. Aplique as migrations antes de iniciar o servidor:
   ```bash
   npm run migrate
   ```
4. Rode a seed inicial:
   ```bash
   npm run seed
   ```
5. Inicie o servidor em desenvolvimento:
   ```bash
   npm run dev
   ```

> O servidor não altera o schema ao iniciar. Em qualquer ambiente, execute
> `npm run migrate` antes de subir uma versão que inclua migrations.

## Migrations do banco

As migrations ficam em `backend/migrations/` e são executadas com
`npm run migrate`. A migration inicial cria todas as tabelas e constraints em
um banco novo; em uma instalação já existente ela serve como baseline, sem
apagar ou recriar tabelas. Para alterar o schema, crie uma migration nova com:

```bash
npm run migration:generate -- --name descricao-da-mudanca
```

Não use `sequelize.sync({ alter: true })` para aplicar mudanças de schema.
Em produção o backend usa apenas `sequelize.authenticate()`; a estrutura é
mantida exclusivamente pelas migrations.

## Padrões de código

- Rota `GET` obtém dados, `POST` cria, `PUT` atualiza e `DELETE` remove.
- Controllers usam `asyncHandler` para tratar erros.
- Validações de request usam `express-validator` na rota antes de chamar controller.
- Texto HTML é sanitizado em `adminController` antes de salvar produtos e posts.
- Slugs de produto/post são gerados com `slugify`.
- Senhas são hashadas com `bcryptjs`.
- JWT de admin é gerado em `adminController.login` e verificado em `middleware/auth.js`.
- Uploads usam `multer`; imagens são salvas em `/uploads` e expostas via `app.use('/uploads', express.static(...))`.

## Endpoints principais da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/products` | não | lista produtos públicos por categoria |
| GET | `/api/products/:id` | não | obtém detalhes de um produto |
| GET | `/api/categories` | não | lista categorias de produtos |
| GET | `/api/gallery` | não | lista imagens da galeria |
| GET | `/api/blog` | não | lista posts publicados |
| GET | `/api/blog/:slug` | não | obtém um post pelo slug |
| GET | `/api/feedbacks` | não | lista feedbacks aprovados |
| POST | `/api/feedbacks` | não | cria novo feedback |
| POST | `/api/contact` | não | cria mensagem de contato |
| GET | `/api/settings` | não | obtém configurações do site |
| GET | `/api/pix/qrcode` | não | gera QR Code Pix para valor único/produto |
| POST | `/api/pix/qrcode-total` | não | gera QR Code Pix para total do carrinho |
| GET | `/api/whatsapp/qrcode` | não | gera QR Code para WhatsApp |
| POST | `/api/customers/register` | não | registra cliente |
| POST | `/api/customers/login` | não | login de cliente |
| POST | `/api/customers/forgot-password` | não | inicia recuperação de senha |
| POST | `/api/customers/reset-password` | não | redefine senha de cliente |
| GET | `/api/customers/me` | sim | obtém perfil do cliente |
| PUT | `/api/customers/me` | sim | atualiza perfil do cliente |
| POST | `/api/admin/login` | não | login de admin |
| GET | `/api/admin/dashboard` | sim | painel de estatísticas admin |
| GET | `/api/admin/products` | sim | lista produtos para admin |
| GET | `/api/admin/categories` | sim | lista categorias |
| POST | `/api/admin/products` | sim | cria produto |
| PUT | `/api/admin/products/:id` | sim | atualiza produto |
| DELETE | `/api/admin/products/:id` | sim | remove produto |
| GET | `/api/admin/posts` | sim | lista posts do blog |
| POST | `/api/admin/posts` | sim | cria post do blog |
| PUT | `/api/admin/posts/:id` | sim | atualiza post |
| DELETE | `/api/admin/posts/:id` | sim | remove post |
| GET | `/api/admin/gallery` | sim | lista imagens da galeria |
| POST | `/api/admin/gallery` | sim | envia imagens |
| DELETE | `/api/admin/gallery/:id` | sim | remove imagem |
| GET | `/api/admin/feedbacks` | sim | lista feedbacks |
| PUT | `/api/admin/feedbacks/:id` | sim | alterna aprovação |
| GET | `/api/admin/messages` | sim | lista mensagens de contato |
| GET | `/api/admin/settings` | sim | obtém configurações |
| POST | `/api/admin/settings` | sim | salva configurações |
| GET | `/api/admin/orders` | sim | lista pedidos admin |
| PATCH | `/api/admin/orders/:id/status` | sim | atualiza status do pedido |
| GET | `/api/admin/orders/receipts/pending` | sim | lista comprovantes pendentes |
| PATCH | `/api/admin/orders/receipts/:id/approve` | sim | aprova comprovante |
| PATCH | `/api/admin/orders/receipts/:id/reject` | sim | rejeita comprovante |

## Pontos de atenção / segurança

- `JWT_SECRET` deve ser forte e mantido fora do repositório.
- Senhas de admin e clientes são hashadas com `bcryptjs`.
- Rotas admin usam `verifyToken`; cliente usa token separado.
- Uploads aceitam imagens e comprovantes, mas o servidor precisa proteger diretórios públicos e validar tipos se ampliar.
- Todas as variáveis sensíveis devem estar em `.env`.
- O servidor não sincroniza nem altera o schema em produção; use migrations versionadas.

## Como adicionar uma nova funcionalidade

### 1. Nova rota pública
1. Criar controller em `backend/controllers/`.
2. Adicionar função exportada.
3. Registrar rota em `backend/routes/publicRoutes.js`.
4. Injetar validação com `express-validator` se necessário.
5. Testar no Postman ou frontend.

### 2. Nova funcionalidade admin
1. Criar/ajustar modelo em `backend/models/`.
2. Adicionar lógica no `backend/controllers/adminController.js` ou novo controller.
3. Registrar rota em `backend/routes/adminRoutes.js`.
4. Proteger com `verifyToken`.
5. Atualizar frontend para consumir a nova rota.

### 3. Novo modelo de dados
1. Criar arquivo em `backend/models/Nome.js`.
2. Importar em `backend/models/index.js`.
3. Definir relacionamentos necessários.
4. Criar e aplicar uma migration, depois testar.

## Referências importantes
- `backend/server.js`: configuração principal do Express, CORS e rotas.
- `backend/config/database.js`: conexão Sequelize.
- `backend/utils/pix.js`: geração do payload Pix.
- `backend/controllers/publicController.js`: lógica do site aberto.
- `backend/routes/adminOrders.js`: pedidos e comprovantes admin.

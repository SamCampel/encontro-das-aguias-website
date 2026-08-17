# Águias

**Águias** é um projeto de loja online com frontend em React/Vite e backend em Node.js/Express. Ele oferece catálogo de produtos, blog, galeria, carrinho de compras com Pix e WhatsApp, além de painel administrativo para gestão de conteúdo.

![screenshot](caminho/para/screenshot.png)

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Principais funcionalidades](#principais-funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Documentação técnica](#documenta%C3%A7%C3%A3o-t%C3%A9cnica)
- [Licença](#licen%C3%A7a)
- [Contato](#contato)

## Sobre o projeto

Águias é uma solução full-stack para varejo digital com foco em catálogo de produtos personalizados, blog, galeria e experiência de compra via Pix e WhatsApp. O sistema separa claramente:

- frontend React para a experiência do usuário;
- backend Express/Sequelize para APIs, autenticação e armazenamento de dados.

## Principais funcionalidades

- Vitrine de produtos por categoria.
- Página de produto com geração de QR Code Pix.
- Finalização de compra via Pix e WhatsApp.
- Blog com posts publicados.
- Galeria de imagens.
- Formulário de contato.
- Carrinho persistente em `localStorage`.
- Painel administrativo com login JWT.
- Editor WYSIWYG no admin para textos e posts.
- Upload de imagens para produtos e galeria.
- Gestão de feedbacks, mensagens e configurações do site.

## Tecnologias

- **Backend**: Node.js, Express, Sequelize, MySQL, JWT, bcryptjs, Multer.
- **Frontend**: React, Vite, React Router, Axios, Bootstrap, React Bootstrap, TinyMCE.
- **Extras**: QR Code Pix, integração WhatsApp, validação com express-validator.

## Estrutura do projeto

- `backend/`: API e lógica do servidor.
- `frontend/`: interface web pública e painel admin.
- `backend/README.dev.md`: manual técnico do backend.
- `frontend/README.dev.md`: manual técnico do frontend.

## Como rodar localmente

### Backend

```bash
cd backend
npm install
```

Configure o arquivo `backend/.env` a partir de `backend/.env.example`.

```bash
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse o frontend em `http://localhost:5173`.

## Documentação técnica

- Backend: [`backend/README.dev.md`](backend/README.dev.md)
- Frontend: [`frontend/README.dev.md`](frontend/README.dev.md)

## Licença

Licença não definida no repositório.

## Contato

Projeto Águias

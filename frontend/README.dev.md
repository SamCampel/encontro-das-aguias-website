# Frontend — Manual para desenvolvedores

## Visão geral da arquitetura

O frontend é uma aplicação React SPA usando Vite. Ele consome a API backend via Axios e organiza a interface em:
- `components/`: elementos reutilizáveis e layout.
- `pages/`: telas públicas e admin.
- `context/`: estado global para autenticação admin e carrinho.
- `services/`: configuração do cliente HTTP Axios.

A navegação é feita com `react-router-dom`, e o projeto usa `react-bootstrap` para estilos rápidos.

## Stack e bibliotecas

- React 18: biblioteca UI.
- Vite: bundler/Razor de desenvolvimento.
- React Router Dom: roteamento de páginas.
- Axios: chamadas HTTP para o backend.
- React Bootstrap + Bootstrap 5: componentes e grid.
- React Toastify: alertas e notificações.
- TinyMCE React: editor WYSIWYG no admin.

## Estrutura de pastas

- `frontend/`
  - `src/`
    - `components/`
      - `Navbar.jsx`: menu público.
      - `AdminNav.jsx`: navegação do painel admin.
      - `Footer.jsx`: rodapé público.
      - `ExitIntentModal.jsx`: modal de saída opcional.
      - `ProductCard.jsx`: cartão de produto reutilizável.
      - `ProtectedRoute.jsx`: bloqueia rotas admin sem login.
    - `context/`
      - `AuthContext.jsx`: controle de login admin e token JWT.
      - `CartContext.jsx`: gerenciamento do carrinho com `localStorage`.
    - `pages/`
      - `public/`: páginas visíveis sem autenticação.
      - `admin/`: telas do painel administrativo.
    - `routes/`: (vazio no momento) não usado.
    - `services/`
      - `api.js`: instância Axios com `baseURL` e interceptores.
    - `App.jsx`: definição das rotas e layout global.
    - `main.jsx`: bootstrap da aplicação.
  - `vite.config.js`: configuração do servidor de desenvolvimento.

## Onde encontrar

- Navbar/menu público: `frontend/src/components/Navbar.jsx`.
- Navbar admin: `frontend/src/components/AdminNav.jsx`.
- Páginas públicas principais: `frontend/src/pages/public/`.
- Painel admin: `frontend/src/pages/admin/`.
- Carrinho de compras: `frontend/src/pages/public/Cart.jsx` e `frontend/src/context/CartContext.jsx`.
- Modal de saída: `frontend/src/components/ExitIntentModal.jsx`.
- Integração com backend: `frontend/src/services/api.js`.

## Como rodar localmente

1. Instale dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. O frontend roda em `http://localhost:5173`.

> O backend deve estar rodando em `http://localhost:5000` ou `VITE_API_URL` configurado.

## Comunicação com o backend

- O frontend usa `axios` em `src/services/api.js`.
- A URL base é `VITE_API_URL` ou `http://localhost:5000/api`.
- Rotas de API usadas:
  - `/products`, `/categories`, `/gallery`, `/blog`, `/blog/:slug`, `/feedbacks`, `/settings`, `/pix/qrcode`, `/pix/qrcode-total`, `/whatsapp/qrcode`, `/date`.
  - Admin: `/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/posts`, `/admin/gallery`, `/admin/feedbacks`, `/admin/messages`, `/admin/settings`, `/admin/orders`, `/admin/orders/receipts/pending`.
- Autenticação admin: token JWT armazenado em `localStorage` e injetado no cabeçalho `Authorization`.

## Padrões de código

- Componentes React funcionais com hooks.
- Nomes de arquivos e rotas usam inglês e português mistos (`AdminNav`, `Products`, `Blog`).
- Classes Bootstrap aplicadas diretamente nos componentes.
- `NavLink` usado para navegação com link ativo automático.
- `AuthContext` e `CartContext` com hooks customizados (`useAuth`, `useCart`).
- Páginas admin separadas por área de responsabilidade.

## Como adicionar uma nova página/seção

1. Criar arquivo em `src/pages/public/` ou `src/pages/admin/`.
2. Adicionar imports em `src/App.jsx`.
3. Registrar rota em `<Routes>`.
4. Se for área admin, proteja com `<ProtectedRoute>`.
5. Se precisar de chamadas API, use `src/services/api.js`.
6. Se for estado compartilhado, estenda `AuthContext` ou `CartContext` se necessário.

## Resumo das páginas admin

- `Dashboard.jsx`: estatísticas rápidas do sistema.
- `Products.jsx`: CRUD de produtos com upload de imagem e TinyMCE para descrição.
- `Blog.jsx`: CRUD de posts com editor WYSIWYG.
- `Gallery.jsx`: upload e exclusão de imagens.
- `Feedbacks.jsx`: aprovação de feedbacks.
- `Messages.jsx`: visualização de mensagens de contato.
- `Settings.jsx`: configurações de WhatsApp, Pix e texto institucional.
- `Orders.jsx`: lista de pedidos com filtro de status.
- `ReceiptsPending.jsx`: aprovação/rejeição de comprovantes Pix.

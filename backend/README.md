# Backend do projeto Águias

## O que é esta parte do sistema?

O backend é a parte do site que roda "por trás das cortinas". É ele quem guarda produtos, posts de blog, imagens da galeria, mensagens de contato e quem controla o acesso do administrador.

### Para que serve

- Recebe pedidos do site e devolve informações sobre produtos, categorias e blog.
- Gera códigos Pix e códigos de WhatsApp para pagamentos e atendimento.
- Armazena mensagens enviadas pelo formulário de contato.
- Permite ao administrador entrar no painel e gerenciar o conteúdo.

## O que você pode fazer através dele

- Atualizar produtos e categorias.
- Publicar posts no blog.
- Adicionar/remover fotos da galeria.
- Ver e aprovar feedbacks e mensagens de contato.
- Alterar dados do WhatsApp e Pix usados no site.

## Onde ficam as configurações importantes

- `PIX_KEY`, `PIX_NAME`, `PIX_CITY`: dados usados para gerar o QR Code do Pix.
- `WHATSAPP_NUMBER`: número usado para redirecionar clientes ao WhatsApp.
- `JWT_SECRET`: chave usada para proteger o login do administrador.

## O que o backend faz por você

- Mantém o site atualizado sem precisar mexer diretamente nos arquivos do site.
- Garante que apenas o administrador autorizado consiga acessar o painel de controle.
- Processa solicitações de clientes e envia os dados de volta ao frontend.

## Se algo der errado

- Verifique se o servidor backend está em execução.
- Confira se as configurações de Pix e WhatsApp estão corretas.
- Para ajustes técnicos, peça ao desenvolvedor que revise `backend/server.js` e as rotas de admin.

## Observação prática

O backend não é a parte visual. Ele é o coração dos dados do site. Se você quiser mudar fotos, produtos ou textos, a maior parte será feita no painel administrativo, que conversa com este servidor.

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Águias</Link>
          <p>Produtos personalizados e conteúdo exclusivo para tornar suas ideias únicas.</p>
        </div>

        <nav className="footer-column" aria-label="Navegação do rodapé">
          <h2>Explore</h2>
          <Link to="/">Início</Link>
          <Link to="/galeria">Galeria</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/cursos">Cursos</Link>
        </nav>

        <nav className="footer-column" aria-label="Links da conta">
          <h2>Conta</h2>
          <Link to="/entrar">Entrar ou cadastrar</Link>
          <Link to="/minha-conta">Minha conta</Link>
          <Link to="/meus-pedidos">Meus pedidos</Link>
          <Link to="/carrinho">Carrinho</Link>
        </nav>

        <div className="footer-column footer-contact">
          <h2>Precisa de ajuda?</h2>
          <p>Fale com a gente para tirar dúvidas ou encontrar o produto ideal.</p>
          <Link to="/contato" className="btn btn-outline-light">Entrar em contato</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="mb-0">© 2026 Águias. Todos os direitos reservados.</p>
        <span>Feito para ideias que voam mais alto.</span>
      </div>
    </footer>
  );
}

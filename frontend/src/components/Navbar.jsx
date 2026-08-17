import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, Dropdown } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function Navbar() {
  const { items } = useCart();
  const { isAuthenticated, customer, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Águias</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink className="nav-link" to="/">Início</NavLink>
            <NavLink className="nav-link" to="/galeria">Galeria</NavLink>
            <NavLink className="nav-link" to="/sobre">Sobre</NavLink>
            <NavLink className="nav-link" to="/blog">Blog</NavLink>
            <NavLink className="nav-link" to="/cursos">Cursos</NavLink>
            <NavLink className="nav-link" to="/contato">Contato</NavLink>
          </Nav>
          <Nav className="ms-auto align-items-center gap-2">
            <NavLink className="nav-link" to="/carrinho">
              🛒 Carrinho ({items.length})
            </NavLink>

            {!isAuthenticated ? (
              <NavLink className="nav-link btn btn-outline-light btn-sm" to="/entrar">
                Entrar / Cadastrar
              </NavLink>
            ) : (
              <Dropdown className="d-inline-block">
                <Dropdown.Toggle
                  as="button"
                  className="nav-link bg-transparent border-0 d-flex align-items-center gap-1"
                  id="customer-dropdown"
                  style={{ cursor: 'pointer', textDecoration: 'none', color: '#fff', padding: 0 }}
                >
                  👤 {customer?.name || 'Minha Conta'}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="mt-2">
                  <Dropdown.Header>{customer?.email}</Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/meus-pedidos">
                    📦 Meus pedidos
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/minha-conta">
                    ⚙️ Minha conta
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Sair
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const exit = () => { logout(); navigate('/admin/login'); };
  return <Navbar bg="primary" variant="dark" expand="lg"><Container>
    <Navbar.Brand as={Link} to="/admin">Painel Águias</Navbar.Brand><Navbar.Toggle />
    <Navbar.Collapse><Nav className="me-auto">
      <NavLink className="nav-link" to="/admin">Início</NavLink><NavLink className="nav-link" to="/admin/products">Produtos</NavLink>
      <NavLink className="nav-link" to="/admin/blog">Blog</NavLink><NavLink className="nav-link" to="/admin/gallery">Galeria</NavLink>
      <NavLink className="nav-link" to="/admin/orders">Pedidos</NavLink><NavLink className="nav-link" to="/admin/orders/receipts/pending">Recibos pendentes</NavLink>
      <NavLink className="nav-link" to="/admin/feedbacks">Feedbacks</NavLink><NavLink className="nav-link" to="/admin/messages">Mensagens</NavLink>
      <NavLink className="nav-link" to="/admin/settings">Configurações</NavLink>
    </Nav><Button size="sm" variant="outline-light" onClick={exit}>Sair</Button></Navbar.Collapse>
  </Container></Navbar>;
}

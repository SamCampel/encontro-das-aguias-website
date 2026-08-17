import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', form);
      login(res.data.token, res.data.admin);
      toast.success('Login realizado');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: 420 }}>
        <Card.Body>
          <h3 className="mb-4">Acesso administrativo</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuário</Form.Label>
              <Form.Control value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Form.Group>
            <Button type="submit" className="w-100">Entrar</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

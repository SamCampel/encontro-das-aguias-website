import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { isValidCpf, isValidEmail, formatCpf, removeCpfMask } from '../../utils/validateCpf';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useCustomerAuth();
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    cpf: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Aplicar máscara de CPF
    if (name === 'cpf' && mode === 'register') {
      processedValue = formatCpf(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Validar e-mail ao sair do campo
    if (name === 'email' && value) {
      if (!isValidEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'E-mail inválido' }));
      }
    }

    // Validar CPF ao sair do campo
    if (name === 'cpf' && value) {
      if (!isValidCpf(value)) {
        setErrors((prev) => ({ ...prev, cpf: 'CPF inválido' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'login') {
      if (!formData.email) {
        newErrors.email = 'E-mail é obrigatório';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }

      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      }
    } else {
      // Validar cadastro
      if (!formData.name || formData.name.length < 3) {
        newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
      }

      if (!formData.email) {
        newErrors.email = 'E-mail é obrigatório';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }

      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (!formData.phone) {
        newErrors.phone = 'Telefone é obrigatório';
      }

      if (!formData.cpf) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (!isValidCpf(formData.cpf)) {
        newErrors.cpf = 'CPF inválido';
      }

      if (!formData.address) {
        newErrors.address = 'Endereço é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/customers/login', {
          email: formData.email,
          password: formData.password,
        });
        login(res.data.token, res.data.customer);
        toast.success('Login realizado com sucesso!');
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        const res = await api.post('/customers/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          cpf: removeCpfMask(formData.cpf),
          address: formData.address,
        });
        login(res.data.token, res.data.customer);
        toast.success('Cadastro realizado com sucesso!');
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        // Erros de validação por campo
        setErrors(errorData.errors);
        Object.values(errorData.errors).forEach((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error(errorData?.message || 'Erro ao processar requisição');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFormData({ email: '', password: '', name: '', phone: '', cpf: '', address: '' });
    setErrors({});
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="mb-4">
                <Nav variant="tabs" defaultActiveKey="login">
                  <Nav.Item>
                    <Nav.Link
                      active={mode === 'login'}
                      onClick={() => switchMode('login')}
                      style={{ cursor: 'pointer' }}
                    >
                      Entrar
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={mode === 'register'}
                      onClick={() => switchMode('register')}
                      style={{ cursor: 'pointer' }}
                    >
                      Cadastrar
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <h4 className="mb-4">{mode === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'}</h4>

              <Form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome completo *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>E-mail *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Senha *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Telefone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>CPF *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.cpf}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.cpf}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Endereço *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}

                {mode === 'login' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Senha</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}

                <Button
                  variant="primary"
                  className="w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
                </Button>

                {mode === 'login' && (
                  <Alert variant="info" className="mt-3 small">
                    Não tem conta? Clique na aba <strong>Cadastrar</strong> acima para se registrar.
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

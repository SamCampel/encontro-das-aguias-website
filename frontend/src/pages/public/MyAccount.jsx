import { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { isValidCpf, formatCpf, removeCpfMask } from '../../utils/validateCpf';

export default function MyAccount() {
  const navigate = useNavigate();
  const { customer, logout } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (!customer) {
      navigate('/entrar');
      return;
    }
    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      cpf: formatCpf(customer.cpf) || '',
      address: customer.address || '',
    });
  }, [customer, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (form.name && form.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (form.email && !form.email.includes('@')) {
      newErrors.email = 'E-mail inválido';
    }

    if (form.cpf && !isValidCpf(form.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (form.phone && form.phone.length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpar erro do campo ao começar a editar
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = formatCpf(value);
    setForm({ ...form, cpf: value });
    if (errors.cpf) {
      setErrors({ ...errors, cpf: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpf: removeCpfMask(form.cpf),
        address: form.address,
      };

      await api.put('/customers/me', updateData);
      toast.success('Dados atualizados com sucesso');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('Verifique os erros no formulário');
      } else {
        toast.error('Erro ao atualizar dados');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    return newErrors;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const newErrors = validatePasswordForm();
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.put('/customers/me', {
        password: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Senha alterada com sucesso');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    } catch (error) {
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
      } else {
        toast.error('Erro ao alterar senha');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/customers/me');
      toast.success('Conta deletada com sucesso');
      logout();
      navigate('/');
    } catch (error) {
      toast.error('Erro ao deletar conta');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="bg-dark text-white">
              <h2 className="mb-0">Minha Conta</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={handleCpfChange}
                    isInvalid={!!errors.cpf}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cpf}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Alterar senha
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Zona de Risco</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">
                Excluir sua conta é uma ação permanente. Todos os seus dados serão removidos,
                mas o histórico de pedidos será mantido para fins de relatório.
              </p>
              <Button
                variant="outline-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Excluir minha conta
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de alterar senha */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Senha atual</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                isInvalid={!!passwordErrors.currentPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nova senha</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                isInvalid={!!passwordErrors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar nova senha</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                isInvalid={!!passwordErrors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Atualizando...' : 'Atualizar senha'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Conta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold text-danger">
            ⚠️ Tem certeza que deseja excluir sua conta?
          </p>
          <p className="text-muted">
            Esta ação é permanente e não pode ser desfeita. Sua conta será removida do sistema,
            mas o histórico de pedidos será mantido.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? 'Deletando...' : 'Sim, excluir minha conta'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

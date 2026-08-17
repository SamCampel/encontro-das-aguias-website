import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.name) nextErrors.name = 'Nome é obrigatório';
    if (!form.email) nextErrors.email = 'E-mail é obrigatório';
    if (!form.message) nextErrors.message = 'Mensagem é obrigatória';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await api.post('/contact', form);
      toast.success('Mensagem enviada com sucesso');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Não foi possível enviar a mensagem');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Contato</h1>
      <Row className="g-4">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control isInvalid={Boolean(errors.name)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control isInvalid={Boolean(errors.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mensagem</Form.Label>
              <Form.Control as="textarea" rows={4} isInvalid={Boolean(errors.message)} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Enviar</Button>
          </Form>
        </Col>
        <Col md={6}>
          <Alert variant="light" className="border">
            <h5>Informações</h5>
            <p>contato@aguias.com.br</p>
            <p>(11) 99999-9999</p>
            <iframe title="Mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.999999999999!2d-46.6388!3d-23.5489!2m3!1f0!2f0!3f0!3m2!1s0x0%3A0x0!2zMjPCsDMyJzQxLjAiUyA0NsKwMzgnMDIuMCJQ!5e0!3m2!1spt-BR!2sbr!4v0" width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

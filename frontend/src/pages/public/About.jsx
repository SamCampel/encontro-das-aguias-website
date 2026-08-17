import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function About() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({ name: '', message: '' });

  useEffect(() => {
    Promise.all([api.get('/feedbacks'), api.get('/settings')]).then(([feedbackRes, settingsRes]) => {
      setFeedbacks(feedbackRes.data);
      setSettings(settingsRes.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedbacks', form);
      toast.success('Feedback enviado e aguardando aprovação');
      setForm({ name: '', message: '' });
    } catch (error) {
      toast.error('Não foi possível enviar o feedback');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Sobre nós</h1>
      <div dangerouslySetInnerHTML={{ __html: settings.about || '<p>Texto institucional</p>' }} />
      <h3 className="mt-5">Depoimentos</h3>
      <Row className="g-4 mt-2">
        {feedbacks.map((feedback) => (
          <Col md={4} key={feedback.id}>
            <div className="border rounded p-3 h-100">
              <strong>{feedback.name}</strong>
              <p className="mt-2 mb-0">{feedback.message}</p>
            </div>
          </Col>
        ))}
      </Row>
      <Form onSubmit={handleSubmit} className="mt-5">
        <h4>Envie seu feedback</h4>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mensagem</Form.Label>
          <Form.Control as="textarea" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </Form.Group>
        <Button type="submit">Enviar</Button>
      </Form>
    </Container>
  );
}

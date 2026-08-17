import { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Settings() {
  const [form, setForm] = useState({ about: '', whatsappNumber: '', pixKey: '', pixName: '', pixCity: '' });

  useEffect(() => {
    api.get('/admin/settings').then((res) => {
      const settings = res.data;
      setForm(Object.fromEntries(['about', 'whatsappNumber', 'pixKey', 'pixName', 'pixCity'].map((key) => [key, settings.find((item) => item.key === key)?.value || ''])));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/admin/settings', { settings: form }); toast.success('Configurações salvas'); }
    catch { toast.error('Não foi possível salvar as configurações'); }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Configurações</h2>
      <Form onSubmit={handleSubmit}>
        <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>WhatsApp (somente números, com DDI)</Form.Label><Form.Control value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label>Chave Pix</Form.Label><Form.Control value={form.pixKey} onChange={(e) => setForm({ ...form, pixKey: e.target.value })} /></Form.Group></Col></Row>
        <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Nome do recebedor Pix</Form.Label><Form.Control maxLength={25} value={form.pixName} onChange={(e) => setForm({ ...form, pixName: e.target.value })} /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label>Cidade do recebedor Pix</Form.Label><Form.Control maxLength={15} value={form.pixCity} onChange={(e) => setForm({ ...form, pixCity: e.target.value })} /></Form.Group></Col></Row>
        <Form.Group className="mb-3"><Form.Label>Texto institucional</Form.Label><Editor apiKey={import.meta.env.VITE_TINYMCE_API_KEY || ''} value={form.about} onEditorChange={(about) => setForm({ ...form, about })} init={{ height: 320, menubar: false }} /></Form.Group>
        <Button type="submit">Salvar</Button>
      </Form>
    </Container>
  );
}

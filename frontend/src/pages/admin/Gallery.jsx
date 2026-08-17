import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [imagesToUpload, setImagesToUpload] = useState([]);

  const loadImages = () => api.get('/admin/gallery').then((res) => setImages(res.data));
  useEffect(() => { loadImages(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    Array.from(imagesToUpload).forEach((image) => formData.append('images', image));
    await api.post('/admin/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Imagem enviada');
    setTitle(''); setImagesToUpload([]); loadImages();
  };

  const remove = async (id) => { await api.delete(`/admin/gallery/${id}`); loadImages(); };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Galeria</h2>
      <Form onSubmit={submit} className="mb-4">
        <Form.Group className="mb-3"><Form.Label>Legenda</Form.Label><Form.Control value={title} onChange={(e) => setTitle(e.target.value)} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Imagens</Form.Label><Form.Control type="file" multiple accept="image/*" required onChange={(e) => setImagesToUpload(e.target.files)} /></Form.Group>
        <Button type="submit">Enviar</Button>
      </Form>
      <Row className="g-3">
        {images.map((img) => <Col md={3} key={img.id}><img src={`http://localhost:5000${img.image}`} className="img-fluid rounded" alt={img.title} /><Button className="mt-2" size="sm" variant="danger" onClick={() => remove(img.id)}>Excluir</Button></Col>)}
      </Row>
    </Container>
  );
}

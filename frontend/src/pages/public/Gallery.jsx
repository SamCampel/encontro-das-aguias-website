import { useEffect, useState } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import api from '../../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.get('/gallery').then((res) => setImages(res.data));
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Galeria</h1>
      <Row xs={1} md={3} className="g-4">
        {images.map((image) => (
          <Col key={image.id}>
            <img src={`http://localhost:5000${image.image}`} alt={image.title} className="img-fluid rounded" style={{ cursor: 'pointer', width: '100%', height: 220, objectFit: 'cover' }} onClick={() => setSelectedImage(image)} />
          </Col>
        ))}
      </Row>
      <Modal show={Boolean(selectedImage)} onHide={() => setSelectedImage(null)} centered size="lg">
        <Modal.Body className="p-0">
          {selectedImage && <img src={`http://localhost:5000${selectedImage.image}`} alt={selectedImage.title} className="img-fluid w-100" />}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

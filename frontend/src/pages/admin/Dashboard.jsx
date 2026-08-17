import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data));
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row className="g-3">
        {Object.entries(stats).map(([key, value]) => (
          <Col md={4} key={key}>
            <Card>
              <Card.Body>
                <Card.Title>{key}</Card.Title>
                <h3>{value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

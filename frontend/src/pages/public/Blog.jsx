import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/blog').then((res) => setPosts(res.data.rows));
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Blog</h1>
      <Row className="g-4">
        {posts.map((post) => (
          <Col md={4} key={post.id}>
            <Card className="h-100">
              {post.image && <Card.Img variant="top" src={`http://localhost:5000${post.image}`} style={{ height: 180, objectFit: 'cover' }} />}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.content?.slice(0, 120)}...</Card.Text>
                <Link to={`/blog/${post.slug}`}><Button variant="primary">Ler mais</Button></Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

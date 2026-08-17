import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const categoryResponse = await api.get('/categories');
        const availableCategories = categoryResponse.data;
        const result = {};
        for (const category of availableCategories) {
          const res = await api.get('/products', { params: { category: category.id } });
          result[category.name] = res.data;
        }
        setCategories(availableCategories); setProductsByCategory(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Container className="py-5">
      <Alert variant="info">Bem-vindo à Águias — produtos personalizados e conteúdo exclusivo.</Alert>
      {loading ? <p>Carregando...</p> : categories.map((category) => (
        <section key={category.id} className="mb-5">
          <h2 className="mb-3">{category.name}</h2>
          <Row xs={1} md={3} className="g-4">
            {(productsByCategory[category.name] || []).slice(0, 3).map((product) => (
              <Col key={product.id}><ProductCard product={product} /></Col>
            ))}
          </Row>
        </section>
      ))}
    </Container>
  );
}

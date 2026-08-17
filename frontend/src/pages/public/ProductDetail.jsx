import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import api, { assetUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useCustomerAuth();
  const [product, setProduct] = useState(null);
  const [payment, setPayment] = useState(null);
  const [whatsappQr, setWhatsappQr] = useState('');
  const [settings, setSettings] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get('/settings'), api.get('/whatsapp/qrcode')]).then(([productResponse, settingsResponse, whatsappResponse]) => { setProduct(productResponse.data); setSettings(settingsResponse.data); setWhatsappQr(whatsappResponse.data.qrCode); });
  }, [id]);

  if (!product) return <Container className="py-5">Carregando...</Container>;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/entrar', { state: { from: location } });
    }
  };

  const payPix = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/entrar', { state: { from: location } });
      return;
    }

    try {
      const res = await api.get('/pix/qrcode', { params: { productId: product.id, amount: product.price } });
      setPayment(res.data);
    } catch {
      toast.error('Erro ao gerar QR Code');
    }
  };

  const openWhatsApp = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/entrar', { state: { from: location } });
      return;
    }

    const message = `Olá, estou interessado no produto ${product.name}`;
    window.open(`https://wa.me/${settings.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          {product.image && <img src={assetUrl(product.image)} alt={product.name} className="img-fluid rounded" />}
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <p className="text-muted">{product.Category?.name}</p>
          <h3 className="text-primary">R$ {Number(product.price).toFixed(2)}</h3>
          <div dangerouslySetInnerHTML={{ __html: product.description || '<p>Descrição não disponível</p>' }} />
          <div className="d-flex gap-2 mt-4">
            <Button onClick={() => addToCart(product)}>Adicionar ao carrinho</Button>
            <Button variant="success" onClick={payPix} disabled={!isAuthenticated}>Pagar com Pix</Button>
            <Button variant="outline-primary" onClick={openWhatsApp} disabled={!isAuthenticated}>Comprar pelo WhatsApp</Button>
          </div>
          {!isAuthenticated && (
            <div className="alert alert-warning mt-3">
              Você precisa estar logado para finalizar uma compra. <Button variant="link" onClick={() => navigate('/entrar', { state: { from: location } })}>Clique aqui para entrar</Button>
            </div>
          )}
          {payment && <div className="mt-4 border rounded p-3"><img src={payment.qrCode} alt="QR Code Pix" width="180" /><p className="small text-break mt-2">{payment.payload}</p><Button size="sm" onClick={() => navigator.clipboard.writeText(payment.payload)}>Copiar código Pix</Button></div>}
          {whatsappQr && <div className="mt-3"><small className="d-block text-muted">Ou aponte a câmera para falar pelo WhatsApp</small><img src={whatsappQr} alt="QR Code WhatsApp" width="110" /></div>}
        </Col>
      </Row>
    </Container>
  );
}

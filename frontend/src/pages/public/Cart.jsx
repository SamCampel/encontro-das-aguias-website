import { Container, Table, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [payment, setPayment] = useState(null);
  const [settings, setSettings] = useState({});
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/entrar', { state: { from: location } });
      return;
    }
  };

  const finishPix = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/entrar', { state: { from: location } });
      return;
    }

    try {
      const res = await api.post('/pix/qrcode-total', { items: items.map(({ id, quantity }) => ({ id, quantity })) });
      setPayment(res.data);
      toast.success('QR Code Pix gerado');
    } catch {
      toast.error('Erro ao gerar QR Code');
    }
  };

  const finishWhatsApp = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/entrar', { state: { from: location } });
      return;
    }

    const message = items.map((item) => `${item.name} x${item.quantity}`).join(', ');
    window.open(`https://wa.me/${settings.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999'}?text=${encodeURIComponent(`Pedido: ${message} - Total R$ ${total.toFixed(2)}`)}`, '_blank');
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Carrinho</h1>
      {!isAuthenticated && (
        <Alert variant="warning" className="mb-4">
          <strong>Atenção:</strong> Você precisa estar logado para finalizar uma compra. <Button variant="link" onClick={() => navigate('/entrar', { state: { from: location } })}>Clique aqui para entrar ou se cadastrar</Button>
        </Alert>
      )}
      {items.length === 0 ? <p>Carrinho vazio.</p> : (
        <>
          <Table responsive>
            <thead>
              <tr><th>Produto</th><th>Preço</th><th>Quantidade</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>R$ {Number(item.price).toFixed(2)}</td>
                  <td>
                    <Form.Control type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} style={{ width: 90 }} />
                  </td>
                  <td>R$ {(Number(item.price) * item.quantity).toFixed(2)}</td>
                  <td><Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>Remover</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: R$ {total.toFixed(2)}</h4>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={clearCart}>Limpar</Button>
              <Button variant="success" onClick={finishPix} disabled={!isAuthenticated}>Finalizar com Pix</Button>
              <Button variant="primary" onClick={finishWhatsApp} disabled={!isAuthenticated}>Finalizar pelo WhatsApp</Button>
            </div>
          </div>
          {payment && <div className="mt-4 border rounded p-3"><img src={payment.qrCode} alt="QR Code Pix" width="180" /><p className="small text-break mt-2">{payment.payload}</p><Button size="sm" onClick={() => navigator.clipboard.writeText(payment.payload)}>Copiar código Pix</Button></div>}
        </>
      )}
    </Container>
  );
}

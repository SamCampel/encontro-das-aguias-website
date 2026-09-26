import { Container, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import api, { assetUrl } from '../../services/api';
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
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-product">
                  {item.image ? <img src={assetUrl(item.image)} alt={item.name} className="cart-item-image" /> : <div className="cart-item-image cart-item-image-placeholder" aria-hidden="true" />}
                  <div className="cart-item-details">
                    <h2>{item.name}</h2>
                    {item.variant && <p>{item.variant}</p>}
                    <span>Preço unitário: R$ {Number(item.price).toFixed(2)}</span>
                  </div>
                </div>
                <div className="cart-item-quantity">
                  <span>Quantidade</span>
                  <div className="quantity-control" aria-label={`Quantidade de ${item.name}`}>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Diminuir quantidade de ${item.name}`}>-</button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Aumentar quantidade de ${item.name}`}>+</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <span>Subtotal</span>
                  <strong>R$ {(Number(item.price) * item.quantity).toFixed(2)}</strong>
                </div>
                <Button variant="outline-danger" size="sm" className="cart-remove" onClick={() => removeFromCart(item.id)}>Remover</Button>
              </article>
            ))}
          </div>
          <div className="cart-summary d-flex justify-content-between align-items-center mt-4">
            <h4>Total: R$ {total.toFixed(2)}</h4>
            <div className="d-flex gap-2">
              <Button variant="outline-danger" onClick={clearCart}>Limpar</Button>
              <Button variant="outline-primary" onClick={finishPix} disabled={!isAuthenticated}>Finalizar com Pix</Button>
              <Button variant="success" onClick={finishWhatsApp} disabled={!isAuthenticated}>Finalizar pelo WhatsApp</Button>
            </div>
          </div>
          {payment && <div className="mt-4 border rounded p-3"><img src={payment.qrCode} alt="QR Code Pix" width="180" /><p className="small text-break mt-2">{payment.payload}</p><Button size="sm" onClick={() => navigator.clipboard.writeText(payment.payload)}>Copiar código Pix</Button></div>}
        </>
      )}
    </Container>
  );
}

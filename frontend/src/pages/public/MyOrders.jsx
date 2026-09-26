import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';

const STATUS_LABELS = {
  pending: 'Aguardando pagamento',
  awaiting_review: 'Comprovante em análise',
  paid: 'Pagamento confirmado',
  preparing: 'Em preparação',
  ready: 'Pronto',
  delivered: 'Entregue',
  rejected: 'Comprovante recusado',
};

const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [receiptFiles, setReceiptFiles] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  const loadOrders = async () => {
    setError('');
    try {
      const response = await api.get('/orders/mine');
      setOrders(response.data);
    } catch {
      setError('Não foi possível carregar seus pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const uploadReceipt = async (event, orderId) => {
    event.preventDefault();
    const file = receiptFiles[orderId];
    if (!file) {
      toast.error('Selecione o comprovante antes de enviar');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);
    setUploadingId(orderId);
    try {
      await api.post(`/orders/${orderId}/receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Comprovante enviado para análise');
      setReceiptFiles((current) => ({ ...current, [orderId]: null }));
      await loadOrders();
    } catch (uploadError) {
      toast.error(uploadError.response?.data?.message || 'Erro ao enviar comprovante');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <Container className="py-5 my-orders-page">
      <div className="page-heading">
        <p className="eyebrow">Conta do cliente</p>
        <h1>Meus pedidos</h1>
        <p>Acompanhe seus pedidos e envie o comprovante de pagamento quando necessário.</p>
      </div>

      {loading && (
        <div className="orders-loading" role="status">
          <Spinner animation="border" size="sm" />
          <span>Carregando pedidos...</span>
        </div>
      )}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && orders.length === 0 && (
        <Card className="orders-empty">
          <Card.Body>
            <h2>Você ainda não tem pedidos</h2>
            <p>Quando finalizar uma compra, ela aparecerá aqui para acompanhamento.</p>
            <Button href="/" variant="primary">Conhecer produtos</Button>
          </Card.Body>
        </Card>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => {
            const canUploadReceipt = order.status === 'pending' || order.status === 'rejected';
            const latestProof = order.PaymentProofs?.[order.PaymentProofs.length - 1];

            return (
              <Card className="order-card" key={order.id}>
                <Card.Header className="order-card-header">
                  <div>
                    <span className="order-label">Pedido #{order.id}</span>
                    <small>{formatDate(order.createdAt)}</small>
                  </div>
                  <Badge className={`order-status status-${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <div className="order-items">
                    {order.OrderItems?.map((item) => (
                      <div className="order-item" key={item.id}>
                        <span>{item.Product?.name || `Produto #${item.productId}`}</span>
                        <span>{item.quantity} x R$ {Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-card-footer">
                    <strong>Total: R$ {Number(order.total).toFixed(2)}</strong>
                    {canUploadReceipt && (
                      <Form className="receipt-form" onSubmit={(event) => uploadReceipt(event, order.id)}>
                        <Form.Label htmlFor={`receipt-${order.id}`}>Comprovante Pix</Form.Label>
                        <Form.Control
                          id={`receipt-${order.id}`}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(event) => setReceiptFiles((current) => ({ ...current, [order.id]: event.target.files?.[0] || null }))}
                        />
                        <Button type="submit" variant="outline-primary" disabled={uploadingId === order.id}>
                          {uploadingId === order.id ? 'Enviando...' : 'Enviar comprovante'}
                        </Button>
                      </Form>
                    )}
                  </div>
                  {order.status === 'rejected' && latestProof?.rejectionReason && (
                    <Alert variant="warning" className="mt-3 mb-0">
                      Motivo da recusa: {latestProof.rejectionReason}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}

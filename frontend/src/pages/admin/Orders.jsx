import { useEffect, useState } from 'react';
import { Container, Table, Form } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

const STATUS_LABELS = {
  pending: 'Pendente',
  awaiting_review: 'Aguardando revisão',
  paid: 'Pago',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  rejected: 'Recusado',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const loadOrders = async () => {
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/admin/orders${query}`);
      setOrders(res.data);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Pedidos</h2>
        <Form.Select
          style={{ maxWidth: '280px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="awaiting_review">Aguardando revisão</option>
          <option value="paid">Pago</option>
          <option value="preparing">Preparando</option>
          <option value="ready">Pronto</option>
          <option value="delivered">Entregue</option>
          <option value="rejected">Recusado</option>
        </Form.Select>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>E-mail</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.Customer?.name || order.customerName}</td>
              <td>{order.Customer?.email || order.customerEmail}</td>
              <td>R$ {Number(order.total).toFixed(2)}</td>
              <td>{STATUS_LABELS[order.status] || order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

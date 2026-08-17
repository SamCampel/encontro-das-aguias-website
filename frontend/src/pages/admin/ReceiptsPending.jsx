import { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function ReceiptsPending() {
  const [proofs, setProofs] = useState([]);

  const loadProofs = async () => {
    try {
      const res = await api.get('/admin/orders/receipts/pending');
      setProofs(res.data);
    } catch (error) {
      toast.error('Erro ao carregar comprovantes');
    }
  };

  useEffect(() => {
    loadProofs();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/admin/orders/receipts/${id}/${action}`);
      toast.success(`Comprovante ${action === 'approve' ? 'aprovado' : 'recusado'}`);
      loadProofs();
    } catch (error) {
      toast.error('Erro ao atualizar comprovante');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Recibos pendentes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Arquivo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {proofs.map((proof) => (
            <tr key={proof.id}>
              <td>{proof.id}</td>
              <td>{proof.Order?.id || proof.orderId}</td>
              <td>{proof.Order?.Customer?.name || proof.Order?.customerName || '—'}</td>
              <td>{proof.status}</td>
              <td>
                {proof.filePath ? (
                  <a href={proof.filePath} target="_blank" rel="noreferrer">Ver arquivo</a>
                ) : '—'}
              </td>
              <td>
                <Button size="sm" variant="success" className="me-2" onClick={() => handleAction(proof.id, 'approve')}>
                  Aprovar
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleAction(proof.id, 'reject')}>
                  Recusar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

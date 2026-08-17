import { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import FullMessageModal from '../../components/FullMessageModal';
import { truncateText, shouldTruncate } from '../../utils/textUtils';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const load = () => api.get('/admin/feedbacks').then((res) => setFeedbacks(res.data));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => { await api.put(`/admin/feedbacks/${id}`); load(); };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este feedback?')) return;
    try {
      await api.delete(`/admin/feedbacks/${id}`);
      toast.success('Feedback removido');
      setFeedbacks(feedbacks.filter((item) => item.id !== id));
    } catch (error) {
      toast.error('Erro ao remover feedback');
    }
  };

  const openFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const closeFeedback = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Feedbacks</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered hover style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Nome</th>
              <th style={{ width: '60%' }}>Mensagem</th>
              <th style={{ width: '10%' }}>Status</th>
              <th style={{ width: '15%' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <span>{truncateText(item.message, 100)}</span>
                    {shouldTruncate(item.message, 100) && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => openFeedback(item)}
                        style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        Ver mais
                      </Button>
                    )}
                  </div>
                </td>
                <td>{item.approved ? 'Aprovado' : 'Pendente'}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => toggle(item.id)}
                    >
                      {item.approved ? 'Reprovar' : 'Aprovar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteFeedback(item.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {selectedFeedback && (
        <FullMessageModal
          show={showModal}
          onHide={closeFeedback}
          title="Feedback completo"
          message={selectedFeedback.message}
          senderName={selectedFeedback.name}
        />
      )}
    </Container>
  );
}

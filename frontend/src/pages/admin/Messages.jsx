import { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import FullMessageModal from '../../components/FullMessageModal';
import { truncateText, shouldTruncate } from '../../utils/textUtils';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    api.get('/admin/messages').then((res) => setMessages(res.data));
  }, []);

  const openMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const closeMessage = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      toast.success('Mensagem removida');
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (error) {
      toast.error('Erro ao remover mensagem');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Mensagens de contato</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered hover style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '14%' }}>Nome</th>
              <th style={{ width: '23%' }}>E-mail</th>
              <th style={{ width: '11%' }}>Telefone</th>
              <th style={{ width: '45%' }}>Mensagem</th>
              <th style={{ width: '7%' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.name}</td>
                <td style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{message.email}</td>
                <td>{message.phone || '—'}</td>
                <td style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <span>{truncateText(message.message, 80)}</span>
                    {shouldTruncate(message.message, 80) && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => openMessage(message)}
                        style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        Ver mais
                      </Button>
                    )}
                  </div>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => deleteMessage(message.id)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {selectedMessage && (
        <FullMessageModal
          show={showModal}
          onHide={closeMessage}
          title="Mensagem de contato completa"
          message={selectedMessage.message}
          senderName={selectedMessage.name}
        />
      )}
    </Container>
  );
}

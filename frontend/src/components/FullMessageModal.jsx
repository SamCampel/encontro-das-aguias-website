import { Modal, Button } from 'react-bootstrap';

export default function FullMessageModal({ show, onHide, title, message, senderName }) {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {senderName && (
          <p className="text-muted mb-3">
            <strong>De:</strong> {senderName}
          </p>
        )}
        <div
          className="bg-light p-3 rounded"
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.6',
          }}
        >
          {message}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

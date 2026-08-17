import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ExitIntentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verifica se o modal já foi mostrado nesta sessão
    const alreadyShown = sessionStorage.getItem('exitModalShown');
    if (alreadyShown) return;

    // Aguarda um pouco para garantir que o carregamento da página terminou
    // Isso evita disparar o modal em eventos de mouse durante o carregamento
    const timer = setTimeout(() => {
      const handleMouseLeave = (event) => {
        // Verifica se o mouse está saindo pela parte superior da página (y <= 0)
        // Isso indica intenção de sair da página
        if (event.clientY <= 0) {
          setShow(true);
          sessionStorage.setItem('exitModalShown', 'true');
          document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
        }
      };

      // Registra o listener no documento
      document.documentElement.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup: remove o listener quando o componente desmontar
      return () => {
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, 1000); // Aguarda 1 segundo após o carregamento

    // Limpa o timer ao desmontar
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Não sai ainda!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ganhe um cupom especial e descubra nossos produtos exclusivos.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}

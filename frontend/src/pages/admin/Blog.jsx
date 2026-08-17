import { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', published: true, image: null });
  const [editingId, setEditingId] = useState(null);

  const loadPosts = () => api.get('/admin/posts').then((res) => setPosts(res.data.rows));
  useEffect(() => { loadPosts(); }, []);

  const openNew = () => { setEditingId(null); setForm({ title: '', content: '', published: true, image: null }); setShow(true); };
  const openEdit = (post) => { setEditingId(post.id); setForm({ ...post, image: null }); setShow(true); };
  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (key !== 'image' && value !== null) formData.append(key, value); });
    if (form.image) formData.append('image', form.image);
    try {
      if (editingId) await api.put(`/admin/posts/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/admin/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Post salvo');
      setShow(false); loadPosts();
    } catch (error) { toast.error('Erro ao salvar post'); }
  };
  const remove = async (id) => { if (!window.confirm('Excluir este post?')) return; await api.delete(`/admin/posts/${id}`); toast.success('Post removido'); loadPosts(); };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Blog</h2>
        <Button onClick={openNew}>Novo post</Button>
      </div>
      <Table striped bordered hover>
        <thead><tr><th>Título</th><th>Status</th><th></th></tr></thead>
        <tbody>{posts.map((post) => <tr key={post.id}><td>{post.title}</td><td>{post.published ? 'Publicado' : 'Rascunho'}</td><td><Button size="sm" variant="outline-primary" onClick={() => openEdit(post)}>Editar</Button>{' '}<Button size="sm" variant="outline-danger" onClick={() => remove(post.id)}>Excluir</Button></td></tr>)}</tbody>
      </Table>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editingId ? 'Editar post' : 'Novo post'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3"><Form.Label>Título</Form.Label><Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Imagem</Form.Label><Form.Control type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Check type="checkbox" label="Publicado" checked={Boolean(form.published)} onChange={(e) => setForm({ ...form, published: e.target.checked })} /></Form.Group>
            <Editor apiKey={import.meta.env.VITE_TINYMCE_API_KEY || ''} value={form.content} onEditorChange={(content) => setForm({ ...form, content })} init={{ height: 300, menubar: false }} />
            <div className="mt-3"><Button type="submit">Salvar</Button></div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

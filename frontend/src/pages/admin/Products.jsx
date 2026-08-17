import { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', categoryId: 1, stock: 0, featured: false, image: null });
  const [editingId, setEditingId] = useState(null);

  const loadProducts = () => api.get('/admin/products').then((res) => setProducts(res.data.rows));

  useEffect(() => { loadProducts(); api.get('/admin/categories').then((res) => setCategories(res.data)); }, []);

  const openNew = () => { setEditingId(null); setForm({ name: '', price: '', description: '', categoryId: categories[0]?.id || '', stock: 0, featured: false, image: null }); setShow(true); };
  const openEdit = (product) => { setEditingId(product.id); setForm({ ...product, image: null }); setShow(true); };

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (key !== 'image' && value !== null) formData.append(key, value); });
    if (form.image) formData.append('image', form.image);
    try {
      if (editingId) await api.put(`/admin/products/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Produto salvo');
      setShow(false); loadProducts();
    } catch (error) { toast.error('Erro ao salvar produto'); }
  };

  const remove = async (id) => { await api.delete(`/admin/products/${id}`); toast.success('Produto removido'); loadProducts(); };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Produtos</h2>
        <Button onClick={openNew}>Novo produto</Button>
      </div>
      <Table striped bordered hover>
        <thead><tr><th>Nome</th><th>Preço</th><th>Estoque</th><th></th></tr></thead>
        <tbody>{products.map((p) => <tr key={p.id}><td>{p.name}</td><td>R$ {Number(p.price).toFixed(2)}</td><td>{p.stock}</td><td><Button size="sm" variant="outline-primary" onClick={() => openEdit(p)}>Editar</Button> <Button size="sm" variant="outline-danger" onClick={() => remove(p.id)}>Excluir</Button></td></tr>)}</tbody>
      </Table>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editingId ? 'Editar produto' : 'Novo produto'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3"><Form.Label>Nome</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Categoria</Form.Label><Form.Select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required><option value="">Selecione</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Preço</Form.Label><Form.Control type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Estoque</Form.Label><Form.Control type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Imagem</Form.Label><Form.Control type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Check type="checkbox" label="Destaque" checked={Boolean(form.featured)} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /></Form.Group>
            <Editor apiKey={import.meta.env.VITE_TINYMCE_API_KEY || ''} value={form.description} onEditorChange={(content) => setForm({ ...form, description: content })} init={{ height: 300, menubar: false }} />
            <div className="mt-3"><Button type="submit">Salvar</Button></div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

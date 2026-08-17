import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card h-100">
      {product.image && <img src={`http://localhost:5000${product.image}`} className="card-img-top" alt={product.name} style={{ height: 180, objectFit: 'cover' }} />}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="text-muted">{product.Category?.name || 'Categoria'}</p>
        <p className="fw-bold">R$ {Number(product.price).toFixed(2)}</p>
        <div className="mt-auto d-flex gap-2">
          <Link className="btn btn-outline-primary btn-sm" to={`/produto/${product.id}`}>Ver</Link>
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

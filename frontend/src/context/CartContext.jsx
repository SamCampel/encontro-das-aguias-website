import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cartItems') || '[]'));

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    toast.success('Produto adicionado ao carrinho');
  };

  const removeFromCart = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const updateQuantity = (id, quantity) => {
    const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: safeQuantity } : item));
  };
  const clearCart = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items]);

  const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, total }), [items, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

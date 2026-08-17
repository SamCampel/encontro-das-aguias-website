import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import GalleryPage from './pages/public/Gallery';
import AboutPage from './pages/public/About';
import BlogPage from './pages/public/Blog';
import BlogPostPage from './pages/public/BlogPost';
import CoursesPage from './pages/public/Courses';
import ContactPage from './pages/public/Contact';
import CartPage from './pages/public/Cart';
import ProductDetailPage from './pages/public/ProductDetail';
import CustomerLoginPage from './pages/public/CustomerLogin';
import MyAccountPage from './pages/public/MyAccount';
import LoginPage from './pages/admin/Login';
import DashboardPage from './pages/admin/Dashboard';
import ProductsPage from './pages/admin/Products';
import BlogAdminPage from './pages/admin/Blog';
import GalleryAdminPage from './pages/admin/Gallery';
import FeedbacksPage from './pages/admin/Feedbacks';
import MessagesPage from './pages/admin/Messages';
import SettingsPage from './pages/admin/Settings';
import OrdersPage from './pages/admin/Orders';
import ReceiptsPendingPage from './pages/admin/ReceiptsPending';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';
import AdminNav from './components/AdminNav';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && location.pathname !== '/admin/login' && <AdminNav />}
      <main className="min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/produto/:id" element={<ProductDetailPage />} />
          <Route path="/entrar" element={<CustomerLoginPage />} />
          <Route path="/minha-conta" element={<CustomerProtectedRoute><MyAccountPage /></CustomerProtectedRoute>} />
          <Route path="/meus-pedidos" element={<CustomerProtectedRoute><div className="container py-5"><h2>Meus Pedidos (em desenvolvimento)</h2></div></CustomerProtectedRoute>} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><BlogAdminPage /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><GalleryAdminPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/admin/orders/receipts/pending" element={<ProtectedRoute><ReceiptsPendingPage /></ProtectedRoute>} />
          <Route path="/admin/feedbacks" element={<ProtectedRoute><FeedbacksPage /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<div className="container py-5"><h2>Página não encontrada</h2></div>} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;

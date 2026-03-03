import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/public/Home';
import Login from './pages/public/auth/Login';
import Register from './pages/public/auth/Register';
import OTPVerification from './pages/public/auth/OTPVerification';
import ForgotPassword from './pages/public/auth/ForgotPassword';
import ResetPassword from './pages/public/auth/ResetPassword';
import Product from './pages/public/Product';
import Contact from './pages/public/Contact';
import Cart from './pages/authenticated/Cart';
import Profile from './pages/authenticated/profile/Profile';
import EditProfile from './pages/authenticated/profile/EditProfile';
import ChangePassword from './pages/authenticated/profile/ChangePassword';
import Addresses from './pages/authenticated/profile/Addresses';
import NotificationPreferences from './pages/authenticated/profile/NotificationPreferences';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile/addresses" element={<Addresses />} />
          <Route path="/profile/notifications" element={<NotificationPreferences />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

import { Link, useLocation } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
    
      <header className="p-2">

        <div className="flex items-center justify-between h-16">

          {/* Left side: Menu button and Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden "
              aria-label="Open menu"
            >
              <HiMenu className="w-6 h-6 text-gray-700" />
            </button>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="TEO Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Center: NavLinks */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                isActive('/')
                  ? 'text-brand-primary bg-brand-tint'
                  : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/product"
              className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                isActive('/product')
                  ? 'text-brand-primary bg-brand-tint'
                  : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              Product
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                isActive('/contact')
                  ? 'text-brand-primary bg-brand-tint'
                  : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right side: Avatar/Login and Cart */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Shopping cart"
                >
                  <FaShoppingCart className="w-6 h-6 text-gray-700" />
                </Link>
                {/* Avatar */}
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-primary text-white font-semibold">
                  {getInitials(user?.name || user?.email)}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
              >
                Login
              </Link>
            )}
          </div>

        </div>

      </header>

    </nav>
  );
};

export default Navbar;

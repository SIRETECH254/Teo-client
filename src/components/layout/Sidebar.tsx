import { Link, useLocation } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { FaHome, FaBox, FaEnvelope } from 'react-icons/fa';
import { FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/products/');
    }
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/products', label: 'Products', icon: FaBox },
    { path: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const authLinks = [
    { path: '/orders', label: 'My Orders', icon: FiShoppingBag },
    { path: '/profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <HiX className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                      isActive(path)
                        ? 'text-brand-primary bg-brand-tint'
                        : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}

              {isAuthenticated && (
                <>
                  <div className="pt-4 pb-2 px-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account</p>
                  </div>
                  {authLinks.map(({ path, label, icon: Icon }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                          isActive(path)
                            ? 'text-brand-primary bg-brand-tint'
                            : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

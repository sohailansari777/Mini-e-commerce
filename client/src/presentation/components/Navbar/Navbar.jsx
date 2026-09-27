import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import BrandLogo from '../BrandLogo/BrandLogo';
import { ShoppingBag, PlusCircle, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Pickella Brand Logo */}
          <Link to="/products" className="flex items-center group transition-transform hover:scale-102">
            <BrandLogo variant="full" theme="light" size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
                isActive('/products') ? 'bg-purple-50' : 'hover:bg-purple-50/50'
              }`}
              style={{
                color: isActive('/products') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/products/add"
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
                    isActive('/products/add') ? 'bg-purple-50' : 'hover:bg-purple-50/50'
                  }`}
                  style={{
                    color: isActive('/products/add') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                  }}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
                    isActive('/profile') ? 'bg-purple-50' : 'hover:bg-purple-50/50'
                  }`}
                  style={{
                    color: isActive('/profile') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                  }}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: 'var(--color-border)' }}>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-purple-50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {getInitial(user?.name)}
                  </div>
                  <span className="text-sm font-semibold max-w-[120px] truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {user?.name || 'User'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors hover:bg-purple-50"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-all hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-purple-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 pt-2 pb-4 flex flex-col gap-2" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            <span>Products</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/products/add"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <PlusCircle className="w-5 h-5 text-purple-600" />
                <span>Add Product</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <User className="w-5 h-5 text-purple-600" />
                <span>Profile ({user?.name})</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 text-left w-full mt-2 border-t pt-3"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl border border-purple-200 hover:bg-purple-50"
                style={{ color: 'var(--color-primary)' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

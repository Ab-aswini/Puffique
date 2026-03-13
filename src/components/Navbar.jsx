import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Our Story', path: '/about' },
    { name: 'Stores', path: '/locations' },
    { name: 'Contact', path: '/contact' },
  ];

  if (location.pathname === '/admin') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        PUFFIQUE
      </Link>

      {/* Desktop Menu */}
      <div style={{ display: 'none' }} className="md-flex">
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{ 
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease'
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Mobile Toggle */}
        <button 
          style={{ color: 'var(--color-text-primary)' }} 
          className="md-hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: 0, right: 0,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--color-border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center'
        }}>
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={{ 
                fontSize: '1rem',
                fontWeight: 500,
                color: location.pathname === link.path ? 'var(--color-accent)' : 'var(--color-text-primary)'
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
          .md-hidden { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

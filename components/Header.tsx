import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo, MenuIcon, CloseIcon, CartIcon } from './icons';
import { CONTACT_INFO } from '../constants';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Leather Details', path: '/leather-details' },
  { name: 'Contact Us', path: '/contact' },
];

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>      
      <header className={`sticky top-0 z-50 bg-neutral-100 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
              <Logo className={`${scrolled ? 'h-12' : 'h-16'} w-auto transition-all duration-300`} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => 
                    `font-serif text-base lg:text-lg hover:text-primary transition-colors relative
                    ${isActive ? 'text-primary font-medium' : 'text-primary-dark'}`
                  }
                  end
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary transform scale-x-75 mx-auto" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-6">
              {/* Phone number (desktop only) */}
              <a 
                href={`tel:${CONTACT_INFO.phone}`} 
                className="hidden lg:flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-serif">{CONTACT_INFO.phone}</span>
              </a>
              
              {/* Cart button */}
              <button
                className="relative p-2 hover:bg-neutral-200 rounded-full transition-colors"
                aria-label="View cart"
                onClick={onCartClick}
              >
                <CartIcon className="h-6 w-6 text-primary" />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-accent-dark text-neutral-100 text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md animate-pulse"
                    key={cartCount} // This key helps React identify when cartCount changes to trigger re-render
                  >
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                  className="p-2 text-primary hover:bg-neutral-200 rounded-full transition-colors"
                >
                  {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-100 border-t border-neutral-200 animate-fadeIn">
            <div className="container mx-auto px-4 sm:px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-md text-base font-serif
                    ${isActive 
                      ? 'text-primary font-medium bg-neutral-200' 
                      : 'text-primary-dark hover:bg-neutral-200'}`
                  }
                  end
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="pt-4 border-t border-neutral-200 mt-4">
                <a 
                  href={`tel:${CONTACT_INFO.phone}`} 
                  className="flex items-center gap-3 py-2 px-4 text-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{CONTACT_INFO.phone}</span>
                </a>
                
                <a 
                  href={`mailto:${CONTACT_INFO.email}`} 
                  className="flex items-center gap-3 py-2 px-4 text-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{CONTACT_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;


import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import LeatherDetails from './components/LeatherDetails';
import Contact from './components/Contact';
import AdminOrders from './components/AdminOrders';
import AdminStatus from './components/AdminStatus';
import AdsExport from './components/AdsExport';
import { API_ENDPOINT } from './constants';

const ANALYTICS_ENDPOINT = API_ENDPOINT; // unified backend endpoint

import Cart from './components/Cart';
import { CartItem } from './types.cart';
import ThankYouModal from './components/ThankYouModal';

const App: React.FC = () => {
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    return window.localStorage.getItem('cookieAccepted') === 'true';
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  useEffect(() => {
    // Fetch country using geo-IP API
    fetch('https://ipapi.co/country/')
      .then(res => res.text())
      .then(country => {
        const payload = {
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          language: navigator.language,
          country,
        };
  fetch(`${ANALYTICS_ENDPOINT}?action=analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      })
      .catch(() => {
        // fallback if country fetch fails
        const payload = {
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          language: navigator.language,
        };
  fetch(`${ANALYTICS_ENDPOINT}?action=analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      });

    // Global link click tracking
    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      // Traverse up to find <a> tag
      while (target && target.tagName !== 'A' && target.parentElement) {
        target = target.parentElement;
      }
      if (target && target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href;
        // Send analytics for link click
  fetch(`${ANALYTICS_ENDPOINT}?action=analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            language: navigator.language,
            clicked_link: href,
          }),
        }).catch(() => {});
      }
    };
    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen text-chocolate">
  <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setShowCart(true)} />
        {!cookieAccepted && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-chocolate text-cream px-4 py-3 flex flex-col md:flex-row items-center justify-between shadow-lg">
            <span className="text-sm md:text-base font-medium">
              This website uses cookies for harmless analytics to help us understand visitor numbers and improve our sales. No personal or sensitive data is collected. Please accept cookies to help us grow!
            </span>
            <button
              className="mt-2 md:mt-0 md:ml-6 bg-cream text-chocolate font-bold px-4 py-2 rounded shadow hover:bg-chocolate-light hover:text-cream transition-colors"
              onClick={() => {
                window.localStorage.setItem('cookieAccepted', 'true');
                setCookieAccepted(true);
              }}
            >
              Accept Cookies
            </button>
          </div>
        )}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products cart={cart} setCart={setCart} setShowCart={setShowCart} />} />
            <Route path="/leather-details" element={<LeatherDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/status" element={<AdminStatus />} />
            <Route path="/ads" element={<AdsExport />} />
          </Routes>
        </main>
        {showCart && (
          <Cart
            items={cart}
            onRemove={productId => setCart(cart.filter(item => item.product.id !== productId))}
            onUpdateQuantity={(productId, quantity) => setCart(cart.map(item => item.product.id === productId ? { ...item, quantity } : item))}
            onPlaceOrder={async ({ name, address, phone, email, note, deliveryArea }) => {
              try {
                const items = cart;
                const subtotal = items.reduce((sum, { product, quantity }) => sum + (product.salePrice || product.price) * quantity, 0);
                const delivery_fee = (deliveryArea === 'outside') ? 120 : 60;
                const total = subtotal + delivery_fee;
                const payload = {
                  name,
                  address,
                  phone,
                  email: email || '',
                  note: note || '',
                  deliveryArea: deliveryArea || 'dhaka',
                  subtotal,
                  delivery_fee,
                  total,
                  items: items.map(({ product, quantity }) => ({
                    productId: product.id,
                    name: product.name,
                    price: product.salePrice || product.price,
                    quantity,
                  })),
                  source: 'cart',
                };
                await fetch(`${ANALYTICS_ENDPOINT}?action=order`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
              } catch {}
              setCart([]);
              setShowCart(false);
      setShowThankYou(true);
            }}
            onClose={() => setShowCart(false)}
          />
        )}
    <ThankYouModal open={showThankYou} onClose={() => setShowThankYou(false)} />
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;

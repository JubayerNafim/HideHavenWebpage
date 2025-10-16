import Captcha from './Captcha';
import React, { useEffect, useState } from 'react';
import { CartItem } from '../types.cart';

interface CartProps {
  items: CartItem[];
  onRemove: (productId: number) => void;
  onPlaceOrder?: (order: { name: string; address: string; phone: string; email?: string; note?: string; deliveryArea?: 'dhaka' | 'outside' }) => void;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onPlaceOrder, onUpdateQuantity, onClose }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState('dhaka');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (items.length === 0) return null;
  const canPlaceOrder = name.trim() && address.trim() && phone.trim() && captchaValid;
  const deliveryFee = deliveryArea === 'dhaka' ? 29 : 99;

  const handlePlaceOrder = () => {
    if (canPlaceOrder && onPlaceOrder) {
      onPlaceOrder({ name, address, phone, email, note, deliveryArea });
      setOrderPlaced(true);
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setNote('');
    }
  };

  return (
    <div
  className="fixed top-4 right-4 bg-white border border-chocolate/20 rounded-lg shadow-lg p-4 w-80 z-[100] max-h-[85vh] overflow-y-auto"
      role="dialog"
      aria-modal="false"
      aria-label="Shopping cart"
    >
      <button
        aria-label="Close cart"
        className="absolute top-2 right-2 text-chocolate hover:text-red-600 text-3xl leading-none font-bold"
        onClick={onClose}
        title="Close"
      >
        &times;
      </button>
  <h3 className="text-lg font-bold mb-4 text-chocolate pr-8">Your Cart</h3>
      <ul className="mb-4">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex justify-between items-center mb-2 gap-2">
            <span>{product.name}</span>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={e => onUpdateQuantity && onUpdateQuantity(product.id, Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-12 border rounded px-1 py-0.5 text-center"
            />
            <button className="text-red-600 ml-2" onClick={() => onRemove(product.id)}>&times;</button>
          </li>
        ))}
      </ul>
      <div className="font-semibold text-chocolate mb-2">
        Subtotal: ৳ {items.reduce((sum, { product, quantity }) => sum + (product.salePrice || product.price) * quantity, 0)}
      </div>
      <div className="mb-2 text-chocolate-light text-sm">
        Delivery Fee: <span className="font-semibold">৳ {deliveryFee}</span>
      </div>
      <div className="font-bold text-chocolate mb-2">
        Total: ৳ {items.reduce((sum, { product, quantity }) => sum + (product.salePrice || product.price) * quantity, 0) + deliveryFee}
      </div>
      <div className="mt-4">
        <label className="block mb-1 text-chocolate font-semibold">Delivery Area</label>
        <select
          className="w-full border rounded px-2 py-1 mb-2"
          value={deliveryArea}
          onChange={e => setDeliveryArea(e.target.value)}
        >
          <option value="dhaka">Inside Dhaka (৳29)</option>
          <option value="outside">Outside Dhaka / Suburban (৳99)</option>
        </select>
        <label className="block mb-1 text-chocolate font-semibold">Name</label>
        <input type="text" className="w-full border rounded px-2 py-1 mb-2" value={name} onChange={e => setName(e.target.value)} />
        <label className="block mb-1 text-chocolate font-semibold">Address</label>
        <input type="text" className="w-full border rounded px-2 py-1 mb-2" value={address} onChange={e => setAddress(e.target.value)} />
        <label className="block mb-1 text-chocolate font-semibold">Phone Number</label>
        <input type="text" className="w-full border rounded px-2 py-1 mb-2" value={phone} onChange={e => setPhone(e.target.value)} />
  <label className="block mb-1 text-chocolate font-semibold">Email (for confirmation)</label>
  <input type="email" className="w-full border rounded px-2 py-1 mb-2" value={email} onChange={e => setEmail(e.target.value)} />
  <label className="block mb-1 text-chocolate font-semibold">Order Note (optional)</label>
  <textarea className="w-full border rounded px-2 py-1 mb-2" value={note} onChange={e => setNote(e.target.value)} />
        <Captcha onValidate={setCaptchaValid} />
        <button
          className={`w-full mt-2 py-2 rounded font-bold ${canPlaceOrder ? 'bg-chocolate text-cream hover:bg-chocolate-light' : 'bg-gray-400 text-white cursor-not-allowed'}`}
          disabled={!canPlaceOrder}
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
        {orderPlaced && (
          <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-sm">
            An agent from Hide Haven will call you within 24 hours to confirm your order.
          </div>
        )}
        <div className="mt-2 text-xs text-chocolate-light">
          <strong>Note:</strong> Cash on delivery only. Please provide accurate information. <br />
          After placing your order, <strong>an agent from Hide Haven will call you within 24 hours to confirm your order</strong>.
        </div>
      </div>
    </div>
  );
};

export default Cart;

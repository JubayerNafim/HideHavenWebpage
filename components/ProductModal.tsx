import ReviewForm from './ReviewForm';
import Comments from './Comments';
import Captcha from './Captcha';
import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { API_ENDPOINT } from '../constants';
import MediaCarousel from './MediaCarousel';
import MediaPlayer from './MediaPlayer';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: { product: Product; quantity: number }) => void;
  onPlaceOrder: (order: { product: Product; name: string; address: string; phone: string; email?: string; note?: string; deliveryArea?: 'dhaka' | 'outside' }) => void;
}


// Placeholder product details/specs/reviews
const PRODUCT_DETAILS = {
  'Premium Crosshatched Long Wallet': {
    description: 'A stylish long wallet made from premium crosshatched leather. Fits bills, cards, and more.',
    specs: [
      'Material: Full-grain crosshatched leather',
      'Color: Black',
      'Compartments: 8 card slots, 2 bill pockets, 1 zip pocket',
      'Size: 19cm x 9cm',
    ],
    reviews: [
      { name: 'Aminul', text: 'Very premium feel and looks great. Highly recommended!' },
      { name: 'Rafiq', text: 'Perfect for gifting. The leather quality is top notch.' },
    ],
  },
  'Auto Gear Belt (Black)': {
    description: 'Automatic buckle belt with a sleek black finish. Easy to adjust and durable.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black',
      'Buckle: Auto-lock, metal',
      'Length: Adjustable',
    ],
    reviews: [
      { name: 'Shuvo', text: 'The auto buckle is very convenient. Good value.' },
    ],
  },

  // Moving belt products with reversible buckle note
  'Embossed Stitched Moving Belt (Black)': {
    description: 'Premium moving belt with reversible buckle. By rotating the buckle, you can wear the opposite side of the belt in another color.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Chocolate (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Embossed Stitched Moving Belt (Chocolate)': {
    description: 'Premium moving belt with reversible buckle. By rotating the buckle, you can wear the opposite side of the belt in another color.',
    specs: [
      'Material: Top-grain leather',
      'Color: Chocolate & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Woven Pattern Moving Belt (Black)': {
    description: 'Woven pattern moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Chocolate (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Woven Pattern Moving Belt (Chocolate)': {
    description: 'Woven pattern moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Chocolate & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Formal Moving Belt (Chocolate+Black)': {
    description: 'Formal moving belt with reversible buckle. Rotate the buckle to switch between chocolate and black sides.',
    specs: [
      'Material: Top-grain leather',
      'Color: Chocolate & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Gridlock Moving Belt (Chocolate)': {
    description: 'Gridlock moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Chocolate & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Formal Moving Belt (Black + Mustard)': {
    description: 'Formal moving belt with reversible buckle. Rotate the buckle to switch between black and mustard sides.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Mustard (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Basketweave Moving Belt (Chocolate)': {
    description: 'Basketweave moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Chocolate & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Double Stitched Moving Belt (Chocolate)': {
    description: 'Double stitched moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Chocolate & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Basketweave Moving Belt (Black)': {
    description: 'Basketweave moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Chocolate (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Gridlock Moving Belt (Black)': {
    description: 'Gridlock moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Chocolate (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Dot Moving Black Belt': {
    description: 'Dot pattern moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Brown (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Premium Dot Moving Brown Belt': {
    description: 'Dot pattern moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Brown & Black (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
  'Double Stitched Moving Belt (Black)': {
    description: 'Double stitched moving belt with reversible buckle. Rotate the buckle to wear the opposite color side.',
    specs: [
      'Material: Top-grain leather',
      'Color: Black & Chocolate (reversible)',
      'Buckle: Reversible, metal',
      'Length: Adjustable',
      'Reversible buckle: Rotate to use the other color side',
    ],
    reviews: [],
  },
};

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, onPlaceOrder }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState('dhaka');
  const [quantity, setQuantity] = useState(1);

  const [captchaValid, setCaptchaValid] = useState(false);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  if (!isOpen) return null;
  const canPlaceOrder = name.trim() && address.trim() && phone.trim() && captchaValid;
  const deliveryFee = deliveryArea === 'dhaka' ? 29 : 99;

  // Handle media navigation
  const mediaCount = product.media?.length || 0;
  const handlePrev = () => setCurrentMediaIdx(idx => (idx > 0 ? idx - 1 : idx));
  const handleNext = () => setCurrentMediaIdx(idx => (idx < mediaCount - 1 ? idx + 1 : idx));
  useEffect(() => { setCurrentMediaIdx(0); }, [product]);

  const handlePlaceOrder = () => {
    if (canPlaceOrder) {
      onPlaceOrder({ product, name, address, phone, email, note, deliveryArea });
      setOrderPlaced(true);
    }
  };

  // Get details for this product (fallback to generic)
  const [userReviews, setUserReviews] = useState<Array<{ name: string; text: string }>>([]);
  // Load approved reviews from backend on open
  useEffect(() => {
    if (!isOpen) return;
  (async () => {
      try {
    const res = await fetch(`${API_ENDPOINT}?action=review_list&productId=${product.id}`, { method: 'GET' });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.reviews && Array.isArray(data.reviews)) {
          setUserReviews(data.reviews.map((r: any) => ({ name: r.name, text: r.text })));
        }
      } catch {}
    })();
  }, [isOpen, product?.id]);
  const details = PRODUCT_DETAILS[product.name] || {
    description: 'Premium quality leather product from Hide Haven.',
    specs: [
      'Material: Leather',
      'Handcrafted',
      'Made in Bangladesh',
    ],
    reviews: [
      { name: 'Customer', text: 'Great product and fast delivery!' },
    ],
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl md:max-w-6xl p-0 relative overflow-hidden">
        <button
          className="absolute top-4 right-4 z-50 bg-chocolate text-cream hover:bg-chocolate-dark rounded-full p-1 leading-none w-8 h-8 flex items-center justify-center text-2xl transition-all duration-200"
          onClick={onClose}
          aria-label="Close order window"
          title="Close"
        >
          &times;
        </button>
        
        <div className="flex flex-col md:flex-row h-[95vh]">
          {/* Media Gallery - Left Side */}
          <div className="md:w-1/2 h-full bg-chocolate/5 flex flex-col p-6 relative overflow-y-auto">
            <div className="flex-grow flex items-center justify-center relative">
              {/* Media carousel display */}
              <MediaCarousel
                media={product.media}
                productName={product.name}
                className="max-h-[70vh] w-full"
                aspectRatio="1/1"
                initialIndex={currentMediaIdx}
                onMediaChange={setCurrentMediaIdx}
                thumbnailsPosition="bottom"
                showControls={true}
              />
            </div>
            
            {/* Product details & specs */}
            <div className="mt-6 border-t border-chocolate/10 pt-4">
              <h2 className="text-2xl font-serif font-bold text-chocolate">{product.name}</h2>
              
              <div className="mt-2 flex items-baseline">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="line-through text-chocolate-light mr-3 text-lg">৳ {product.price}</span>
                    <span className="text-red-600 font-bold text-2xl">৳ {product.salePrice}</span>
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-chocolate font-semibold text-2xl">৳ {product.price}</span>
                )}
              </div>
              
              <p className="mt-4 text-chocolate-light">{details.description}</p>
              
              <div className="mt-4">
                <h3 className="text-chocolate font-medium text-sm uppercase tracking-wide mb-2">Product Specifications</h3>
                <ul className="bg-cream/50 rounded-lg p-3 space-y-1 text-sm">
                  {details.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-baseline">
                      <span className="text-chocolate mr-2">•</span>
                      <span className="text-chocolate-light">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Quantity selector and add to cart */}
              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-chocolate font-medium">Quantity:</label>
                  <div className="flex items-center border border-chocolate/20 rounded-lg">
                    <button
                      className="px-2 py-1 text-chocolate hover:bg-chocolate/10"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                      className="w-10 text-center border-none focus:ring-0 p-1"
                    />
                    <button
                      className="px-2 py-1 text-chocolate hover:bg-chocolate/10"
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  className="flex-grow bg-chocolate text-cream py-2 rounded-lg hover:bg-chocolate-dark transition-colors duration-200 font-medium"
                  onClick={() => {
                    onAddToCart({ product, quantity });
                    // Show feedback toast
                    const toast = document.createElement('div');
                    toast.className = 'fixed bottom-4 right-4 bg-chocolate text-cream py-2 px-4 rounded-lg shadow-lg z-[200] animate-fadeIn';
                    toast.innerHTML = `<div class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>${quantity} item${quantity > 1 ? 's' : ''} added to cart</span>
                    </div>`;
                    document.body.appendChild(toast);
                    setTimeout(() => {
                      toast.classList.add('animate-fadeOut');
                      setTimeout(() => document.body.removeChild(toast), 500);
                    }, 2000);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Reviews section */}
            <div className="mt-8 pt-4 border-t border-chocolate/10">
              <h3 className="text-chocolate font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Customer Reviews
              </h3>
              <div className="max-h-40 overflow-y-auto mt-2 pr-2 custom-scrollbar">
                {[...details.reviews, ...userReviews].length > 0 ? (
                  <ul className="space-y-2">
                    {[...details.reviews, ...userReviews].map((review, idx) => (
                      <li key={idx} className="bg-cream/50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <div className="w-8 h-8 bg-chocolate/20 rounded-full flex items-center justify-center text-chocolate font-medium">
                            {review.name.charAt(0)}
                          </div>
                          <span className="ml-2 font-medium text-chocolate">{review.name}</span>
                        </div>
                        <p className="text-chocolate-light text-sm">{review.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-chocolate-light text-sm">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Form - Right Side */}
          <div className="md:w-1/2 h-full bg-white border-l border-chocolate/10 flex flex-col p-6 overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-chocolate mb-6">Complete Your Order</h2>
            
            {orderPlaced ? (
              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-chocolate mb-2">Order Placed Successfully!</h3>
                <p className="text-center text-chocolate-light mb-6">
                  An agent from Hide Haven will call you within 24 hours to confirm your order.
                </p>
                <button
                  className="bg-chocolate text-cream px-6 py-2 rounded-lg hover:bg-chocolate-dark"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if(canPlaceOrder) handlePlaceOrder(); }}>
                {/* Order summary */}
                <div className="bg-cream/50 rounded-lg p-4">
                  <h3 className="font-medium text-chocolate mb-3">Order Summary</h3>
                  <div className="flex justify-between py-2 border-b border-chocolate/10">
                    <span className="text-chocolate-light">{product.name} x {quantity}</span>
                    <span className="font-medium text-chocolate">৳ {(product.salePrice || product.price) * quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-chocolate/10">
                    <span className="text-chocolate-light">Delivery Fee</span>
                    <span className="font-medium text-chocolate">৳ {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg">
                    <span className="font-medium text-chocolate">Total</span>
                    <span className="font-bold text-chocolate">৳ {(product.salePrice || product.price) * quantity + deliveryFee}</span>
                  </div>
                </div>
                
                {/* Delivery method */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-chocolate">Delivery Area</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        deliveryArea === 'dhaka'
                          ? 'bg-chocolate text-cream border-chocolate'
                          : 'border-chocolate/20 hover:border-chocolate/40'
                      }`}
                      onClick={() => setDeliveryArea('dhaka')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={deliveryArea === 'dhaka'}
                          onChange={() => setDeliveryArea('dhaka')}
                          className="mr-2"
                        />
                        <div>
                          <p className={deliveryArea === 'dhaka' ? 'font-medium text-cream' : 'font-medium text-chocolate'}>Inside Dhaka</p>
                          <p className={`text-xs ${deliveryArea === 'dhaka' ? 'text-cream/80' : 'text-chocolate-light'}`}>৳ 29 - 1-2 days</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        deliveryArea === 'outside'
                          ? 'bg-chocolate text-cream border-chocolate'
                          : 'border-chocolate/20 hover:border-chocolate/40'
                      }`}
                      onClick={() => setDeliveryArea('outside')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={deliveryArea === 'outside'}
                          onChange={() => setDeliveryArea('outside')}
                          className="mr-2"
                        />
                        <div>
                          <p className={deliveryArea === 'outside' ? 'font-medium text-cream' : 'font-medium text-chocolate'}>Outside Dhaka</p>
                          <p className={`text-xs ${deliveryArea === 'outside' ? 'text-cream/80' : 'text-chocolate-light'}`}>৳ 99 - 3-5 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-chocolate">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      className="w-full border border-chocolate/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-chocolate/40 focus:border-transparent outline-none"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-chocolate">Phone Number</label>
                    <input
                      id="phone"
                      type="text"
                      className="w-full border border-chocolate/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-chocolate/40 focus:border-transparent outline-none"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-chocolate">Email (optional)</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full border border-chocolate/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-chocolate/40 focus:border-transparent outline-none"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-chocolate">Delivery Address</label>
                    <textarea
                      id="address"
                      className="w-full border border-chocolate/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-chocolate/40 focus:border-transparent outline-none"
                      rows={3}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="note" className="block mb-2 text-sm font-medium text-chocolate">Order Notes (optional)</label>
                    <textarea
                      id="note"
                      className="w-full border border-chocolate/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-chocolate/40 focus:border-transparent outline-none"
                      rows={2}
                      placeholder="Any special instructions or requests"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Verification & Place order */}
                <div className="pt-2">
                  <div className="mb-6">
                    <Captcha onValidate={setCaptchaValid} />
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-medium text-lg transition-all duration-200 ${
                      canPlaceOrder 
                        ? 'bg-chocolate text-cream hover:bg-chocolate-dark shadow-md hover:shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!canPlaceOrder}
                  >
                    Place Order
                  </button>
                  
                  <div className="mt-4 text-sm text-chocolate-light">
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cash on delivery only. Our agent will call you within 24 hours to confirm.
                    </p>
                  </div>
                </div>
              </form>
            )}
            
            {/* Review form */}
            <div className="mt-6 pt-6 border-t border-chocolate/10">
              <h3 className="font-medium text-chocolate mb-3">Write a Review</h3>
              <ReviewForm 
                onSubmit={async review => {
                  setUserReviews(revs => [...revs, review]);
                  try {
                    await fetch(`${API_ENDPOINT}?action=review_add`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ productId: product.id, name: review.name, text: review.text }),
                    });
                  } catch {}
                }}
              />
              
              <div className="mt-4">
                <Comments productId={product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

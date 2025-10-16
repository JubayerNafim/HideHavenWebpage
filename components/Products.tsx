
import React, { useState } from 'react';
import { PRODUCTS, MESSENGER_LINK, LOGO_URL, API_ENDPOINT } from '../constants';
import { ExternalLinkIcon, ShippingIcon, FilterIcon, GridIcon, ListIcon } from './icons';
import ProductModal from './ProductModal';
import ThankYouModal from './ThankYouModal';
import MediaPlayer from './MediaPlayer';
import MediaCarousel from './MediaCarousel';
import { CartItem } from '../types.cart';

// Product types and colors for filtering
const PRODUCT_TYPES = [
  { label: 'All Products', value: '' },
  { label: 'Belts', value: 'belt' },
  { label: 'Wallets', value: 'wallet' },
  { label: 'Passport Holders', value: 'passport' },
  { label: 'Card Holders', value: 'card' },
];

const PRODUCT_COLORS = [
  { label: 'All Colors', value: '' },
  { label: 'Black', value: 'black' },
  { label: 'Brown', value: 'brown' },
  { label: 'Chocolate', value: 'chocolate' },
  { label: 'Mustard', value: 'mustard' },
  { label: 'Tan', value: 'tan' },
  { label: 'Red', value: 'red' },
];

// Get unique categories and colors from products
const AVAILABLE_CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];
const AVAILABLE_COLORS = [...new Set(PRODUCTS.flatMap(p => p.color || []))].sort();

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
];

const Products: React.FC<{ cart: CartItem[]; setCart: (c: CartItem[]) => void; setShowCart: (b: boolean) => void }> = ({ cart, setCart, setShowCart }) => {
  const [modalProduct, setModalProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Auto-open modal if product param is present in URL hash
  React.useEffect(() => {
    const openFromHash = () => {
      try {
        const hash = window.location.hash;
        if (!hash.includes('product=')) return;
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const pid = params.get('product');
        if (!pid) return;
        const prod = PRODUCTS.find(p => String(p.id) === String(pid));
        if (prod) setModalProduct(prod);
      } catch {}
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  const handleAddToCart = ({ product, quantity }) => {
    setCart((prev) => {
      const found = prev.find((item) => item.product.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + (quantity || 1) } : item
        );
      }
      return [...prev, { product, quantity: quantity || 1 }];
    });
    
    // Show feedback toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-chocolate text-cream py-2 px-4 rounded-lg shadow-lg z-[200] animate-fadeIn';
    toast.innerHTML = `<div class="flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${quantity || 1} item${(quantity || 1) > 1 ? 's' : ''} added to cart</span>
    </div>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = async (order: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    note?: string;
    deliveryArea?: 'dhaka' | 'outside';
    items: CartItem[];
  }) => {
    try {
      const subtotal = order.items.reduce(
        (sum, { product, quantity }) => sum + (product.salePrice || product.price) * quantity,
        0
      );
      const delivery_fee = order.deliveryArea === 'outside' ? 99 : 29;
      const total = subtotal + delivery_fee;
      const payload = {
        name: order.name,
        address: order.address,
        phone: order.phone,
        email: order.email || '',
        note: order.note || '',
        deliveryArea: order.deliveryArea || 'dhaka',
        subtotal,
        delivery_fee,
        total,
        items: order.items.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          quantity,
        })),
        source: 'products',
      };
      const res = await fetch(`${API_ENDPOINT}?action=order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // ignore response body; assume backend emails admin/customer
      if (!res.ok) throw new Error('Order failed');
      setLastOrder({
        ...order,
        subtotal,
        delivery_fee,
        total,
        createdAt: new Date().toISOString(),
      });
      setShowThankYou(true);
    } catch (e) {
      // Swallow errors for now; could show toast
      console.error(e);
    }
  };

  // Filter and sort products
  const filteredProducts = PRODUCTS.filter(product => {
    // Search filter
    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description?.toLowerCase().includes(search.toLowerCase())) ||
      (product.media && product.media.some(m => m.url.toLowerCase().includes(search.toLowerCase())));
    
    // Type filter - use category field
    const matchType = typeFilter ? product.category === typeFilter : true;
    
    // Color filter - use color array field
    const matchColor = colorFilter ? product.color?.includes(colorFilter) : true;
    
    // Price filter
    const price = product.salePrice || product.price;
    let matchPrice = true;
    if (priceFilter === 'low') matchPrice = price <= 700;
    else if (priceFilter === 'mid') matchPrice = price > 700 && price <= 1000;
    else if (priceFilter === 'high') matchPrice = price > 1000;
    
    // Stock filter
    const matchStock = stockFilter === 'in' ? product.stock : stockFilter === 'out' ? !product.stock : true;
    
    return matchSearch && matchType && matchColor && matchPrice && matchStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    
    switch (sortOption) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        // Featured - keep original order which should be curated
        return 0;
    }
  });

  return (
    <div className="pb-12">
      {/* Page Title */}
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-12 text-primary">Our Collection</h1>

      {/* Product Filters - Desktop */}
      <div className="hidden md:block mb-10">
        <div className="bg-neutral-100 rounded-lg p-6 shadow-subtle mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button 
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-neutral-100' : 'bg-neutral-200 text-primary'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button 
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-neutral-100' : 'bg-neutral-200 text-primary'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <ListIcon className="h-5 w-5" />
              </button>
              <span className="ml-4 text-sm text-neutral-600">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex gap-4">
              <div className="relative inline-block">
                <select
                  className="appearance-none bg-white border border-neutral-300 rounded-md py-2 pl-4 pr-10 text-sm text-primary focus:outline-none focus:border-primary"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Product Type</label>
              <select
                className="w-full bg-white border border-neutral-300 rounded-md py-2 px-3 text-sm"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                {PRODUCT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Color</label>
              <select
                className="w-full bg-white border border-neutral-300 rounded-md py-2 px-3 text-sm"
                value={colorFilter}
                onChange={e => setColorFilter(e.target.value)}
              >
                {PRODUCT_COLORS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range</label>
              <select
                className="w-full bg-white border border-neutral-300 rounded-md py-2 px-3 text-sm"
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="low">৳0-700</option>
                <option value="mid">৳701-1000</option>
                <option value="high">৳1001+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Availability</label>
              <select
                className="w-full bg-white border border-neutral-300 rounded-md py-2 px-3 text-sm"
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
              >
                <option value="">All Items</option>
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full bg-white border border-neutral-300 rounded-md py-2 px-3 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Filters - Mobile */}
      <div className="md:hidden mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-full bg-white border border-neutral-300 rounded-md py-2 px-3 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-primary text-neutral-100 rounded-md p-2 flex items-center justify-center"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <FilterIcon className="h-5 w-5" />
            <span className="sr-only">Toggle filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-neutral-100 rounded-lg p-4 shadow-subtle mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Product Type</label>
                <select
                  className="w-full bg-white border border-neutral-300 rounded-md py-1.5 px-2 text-sm"
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                >
                  {PRODUCT_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Color</label>
                <select
                  className="w-full bg-white border border-neutral-300 rounded-md py-1.5 px-2 text-sm"
                  value={colorFilter}
                  onChange={e => setColorFilter(e.target.value)}
                >
                  {PRODUCT_COLORS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Price Range</label>
                <select
                  className="w-full bg-white border border-neutral-300 rounded-md py-1.5 px-2 text-sm"
                  value={priceFilter}
                  onChange={e => setPriceFilter(e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="low">৳0-700</option>
                  <option value="mid">৳701-1000</option>
                  <option value="high">৳1001+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Availability</label>
                <select
                  className="w-full bg-white border border-neutral-300 rounded-md py-1.5 px-2 text-sm"
                  value={stockFilter}
                  onChange={e => setStockFilter(e.target.value)}
                >
                  <option value="">All Items</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button 
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-primary text-neutral-100' : 'bg-neutral-200 text-primary'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <GridIcon className="h-4 w-4" />
                </button>
                <button 
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-primary text-neutral-100' : 'bg-neutral-200 text-primary'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="relative inline-block">
                <select
                  className="appearance-none bg-white border border-neutral-300 rounded-md py-1.5 pl-3 pr-8 text-sm"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-sm text-neutral-600 mb-4">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedProducts.map((product) => {
            // Use first image/video for preview in message
            const firstMedia = product.media?.[0];
            const previewUrl = firstMedia ? firstMedia.url : LOGO_URL;
            const refPayload = {
              id: product.id,
              name: product.name,
              price: product.salePrice || product.price,
              image: previewUrl,
            };
            const messengerHref = `${MESSENGER_LINK}?ref=${encodeURIComponent(JSON.stringify(refPayload))}`;
            const message = `Hi Hide Haven! I'm interested in this product:\n• Name: ${product.name}\n• Price: ৳${product.salePrice || product.price}\n• Image: ${new URL(previewUrl, window.location.origin).toString()}`;

            // Track current media index for each product card
            const [currentMediaIdx, setCurrentMediaIdx] = React.useState(0);
            const mediaCount = product.media?.length || 0;
            React.useEffect(() => { setCurrentMediaIdx(0); }, [product.id]);
            const handlePrev = (e) => { e.stopPropagation(); setCurrentMediaIdx(idx => (idx > 0 ? idx - 1 : idx)); };
            const handleNext = (e) => { e.stopPropagation(); setCurrentMediaIdx(idx => (idx < mediaCount - 1 ? idx + 1 : idx)); };

            return (
              <div key={product.id} className="card product-premium">
                {/* Sale badge */}
                {product.onSale && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-neutral-100 text-xs font-bold px-3 py-1 rounded-full shadow-lg">SALE</span>
                  </div>
                )}

                {/* Product image */}
                <div 
                  className="aspect-square w-full overflow-hidden flex items-center justify-center cursor-pointer relative" 
                  onClick={() => setModalProduct(product)}
                >
                  {/* Navigation arrows */}
                  {mediaCount > 1 && (
                    <>
                      <button
                        className="absolute left-2 z-20 bg-neutral-100/90 hover:bg-primary text-primary hover:text-neutral-100 rounded-full p-2 shadow text-lg font-bold border border-neutral-300 transition-colors"
                        onClick={handlePrev}
                        disabled={currentMediaIdx === 0}
                        aria-label="Previous image"
                      >
                        &#8592;
                      </button>
                      
                      <button
                        className="absolute right-2 z-20 bg-neutral-100/90 hover:bg-primary text-primary hover:text-neutral-100 rounded-full p-2 shadow text-lg font-bold border border-neutral-300 transition-colors"
                        onClick={handleNext}
                        disabled={currentMediaIdx === mediaCount - 1}
                        aria-label="Next image"
                      >
                        &#8594;
                      </button>
                    </>
                  )}

                  {/* Media display with optimized player */}
                  {product.media && product.media.length > 0 ? (
                    <MediaPlayer
                      media={product.media[currentMediaIdx]}
                      alt={product.name + ' image ' + (currentMediaIdx + 1)}
                      className="w-full h-full object-contain object-center"
                      priority={currentMediaIdx === 0}
                      preload="metadata"
                      width={400}
                      height={400}
                      objectFit="contain"
                      posterImage={product.media[0]?.type === 'image' ? product.media[0].url : undefined}
                    />
                  ) : (
                    <img
                      src={LOGO_URL}
                      alt={product.name}
                      className="w-full h-full object-contain object-center"
                      loading="lazy"
                      width={400}
                      height={400}
                    />
                  )}
                </div>

                {/* Product info */}
                <div className="p-5">
                  <h3 className="font-serif font-medium text-lg text-primary mb-1">{product.name}</h3>
                  
                  {/* Price display */}
                  <div className="mb-4">
                    {product.stock ? (
                      product.onSale && product.salePrice ? (
                        <div className="flex items-center">
                          <span className="text-neutral-500 font-medium line-through mr-3">৳ {product.price}</span>
                          <span className="text-accent-dark font-bold text-lg">৳ {product.salePrice}</span>
                        </div>
                      ) : (
                        <span className="text-primary font-bold text-lg">৳ {product.price}</span>
                      )
                    ) : (
                      <span className="text-accent-dark font-medium">Currently Unavailable</span>
                    )}
                  </div>
                  
                  {/* Media indicator dots */}
                  {mediaCount > 1 && (
                    <div className="flex justify-center gap-1.5 mb-4">
                      {Array.from({ length: mediaCount }).map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-colors ${currentMediaIdx === idx ? 'bg-primary' : 'bg-neutral-300'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentMediaIdx(idx);
                          }}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      className="btn btn-primary flex-1 py-2 text-sm"
                      onClick={() => setModalProduct(product)}
                      disabled={!product.stock}
                    >
                      {product.stock ? 'Order Now' : 'Sold Out'}
                    </button>
                    
                    <a
                      href={messengerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          navigator.clipboard?.writeText(message);
                        } catch {}
                      }}
                    >
                      <span>Inquire</span>
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {sortedProducts.map((product) => {
            // Use first image/video for preview in message
            const firstMedia = product.media?.[0];
            const previewUrl = firstMedia ? firstMedia.url : LOGO_URL;
            const refPayload = {
              id: product.id,
              name: product.name,
              price: product.salePrice || product.price,
              image: previewUrl,
            };
            const messengerHref = `${MESSENGER_LINK}?ref=${encodeURIComponent(JSON.stringify(refPayload))}`;
            const message = `Hi Hide Haven! I'm interested in this product:\n• Name: ${product.name}\n• Price: ৳${product.salePrice || product.price}\n• Image: ${new URL(previewUrl, window.location.origin).toString()}`;

            // Track current media index for each product card
            const [currentMediaIdx, setCurrentMediaIdx] = React.useState(0);
            const mediaCount = product.media?.length || 0;
            React.useEffect(() => { setCurrentMediaIdx(0); }, [product.id]);
            const handlePrev = (e) => { e.stopPropagation(); setCurrentMediaIdx(idx => (idx > 0 ? idx - 1 : idx)); };
            const handleNext = (e) => { e.stopPropagation(); setCurrentMediaIdx(idx => (idx < mediaCount - 1 ? idx + 1 : idx)); };

            return (
              <div key={product.id} className="card flex flex-col md:flex-row product-premium">
                {/* Product image */}
                <div className="relative w-full md:w-1/3 overflow-hidden">
                  {/* Sale badge */}
                  {product.onSale && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-red-600 text-neutral-100 text-xs font-bold px-3 py-1 rounded-full shadow-lg">SALE</span>
                    </div>
                  )}
                  
                  <div 
                    className="aspect-square w-full overflow-hidden flex items-center justify-center cursor-pointer relative" 
                    onClick={() => setModalProduct(product)}
                  >
                    {/* Navigation arrows */}
                    {mediaCount > 1 && (
                      <>
                        <button
                          className="absolute left-2 z-20 bg-neutral-100/90 hover:bg-primary text-primary hover:text-neutral-100 rounded-full p-2 shadow text-lg font-bold border border-neutral-300 transition-colors"
                          onClick={handlePrev}
                          disabled={currentMediaIdx === 0}
                          aria-label="Previous image"
                        >
                          &#8592;
                        </button>
                        
                        <button
                          className="absolute right-2 z-20 bg-neutral-100/90 hover:bg-primary text-primary hover:text-neutral-100 rounded-full p-2 shadow text-lg font-bold border border-neutral-300 transition-colors"
                          onClick={handleNext}
                          disabled={currentMediaIdx === mediaCount - 1}
                          aria-label="Next image"
                        >
                          &#8594;
                        </button>
                      </>
                    )}

                    {/* Media display */}
                    {product.media && product.media[currentMediaIdx] ? (
                      product.media[currentMediaIdx].type === 'image' ? (
                        <img
                          src={product.media[currentMediaIdx].url}
                          alt={product.name + ' image ' + (currentMediaIdx + 1)}
                          className="w-full h-full object-contain object-center"
                          loading={currentMediaIdx > 0 ? 'lazy' : 'eager'}
                          width={400}
                          height={400}
                        />
                      ) : (
                        <video
                          src={product.media[currentMediaIdx].url}
                          controls
                          className="w-full h-full object-contain object-center"
                          preload="metadata"
                        />
                      )
                    ) : (
                      <img
                        src={LOGO_URL}
                        alt={product.name}
                        className="w-full h-full object-contain object-center"
                        loading="lazy"
                        width={400}
                        height={400}
                      />
                    )}
                  </div>
                  
                  {/* Media indicator dots */}
                  {mediaCount > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {Array.from({ length: mediaCount }).map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-colors ${currentMediaIdx === idx ? 'bg-primary' : 'bg-neutral-300'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentMediaIdx(idx);
                          }}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Product info */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif font-medium text-xl text-primary mb-2">{product.name}</h3>
                    
                    {/* Price display */}
                    <div className="mb-4">
                      {product.stock ? (
                        product.onSale && product.salePrice ? (
                          <div className="flex items-center">
                            <span className="text-neutral-500 font-medium line-through mr-3">৳ {product.price}</span>
                            <span className="text-accent-dark font-bold text-xl">৳ {product.salePrice}</span>
                          </div>
                        ) : (
                          <span className="text-primary font-bold text-xl">৳ {product.price}</span>
                        )
                      ) : (
                        <span className="text-accent-dark font-medium">Currently Unavailable</span>
                      )}
                    </div>
                    
                    <p className="text-neutral-600 mb-6">
                      {product.description || `Premium quality ${product.name.toLowerCase()} crafted from genuine leather. Perfect for everyday use with elegant design and durable construction.`}
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <button
                      className="btn btn-primary flex-1 py-2.5"
                      onClick={() => setModalProduct(product)}
                      disabled={!product.stock}
                    >
                      {product.stock ? 'Order Now' : 'Sold Out'}
                    </button>
                    
                    <a
                      href={messengerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 py-2.5 flex items-center justify-center gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          navigator.clipboard?.writeText(message);
                        } catch {}
                      }}
                    >
                      <span>Ask Questions</span>
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {sortedProducts.length === 0 && (
        <div className="bg-neutral-100 rounded-lg p-8 text-center">
          <h3 className="font-serif text-xl text-primary mb-2">No Products Found</h3>
          <p className="text-neutral-600 mb-4">Try adjusting your filters or search criteria.</p>
          <button 
            className="btn btn-outline"
            onClick={() => {
              setSearch('');
              setTypeFilter('');
              setColorFilter('');
              setPriceFilter('');
              setStockFilter('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modals */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          isOpen={!!modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={handleAddToCart}
          onPlaceOrder={({ name, address, phone, email, note, deliveryArea, product }) => {
            const items = cart.length ? cart : [{ product: product || modalProduct, quantity: 1 }];
            handlePlaceOrder({ name, address, phone, email, note, deliveryArea, items });
            setModalProduct(null);
          }}
        />
      )}
      
      <ThankYouModal open={showThankYou} onClose={() => setShowThankYou(false)} order={lastOrder} />
    </div>
  );
};

export default Products;

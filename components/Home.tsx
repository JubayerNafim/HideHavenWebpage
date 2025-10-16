import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogoWatermark, ShippingIcon } from './icons';
import { PRODUCTS, LOGO_URL, LEATHER_INFO } from '../constants';

const Home: React.FC = () => {
  // Get featured products with a valid image in media
  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.stock && p.onSale && Array.isArray(p.media) && p.media.length > 0)
      .slice(0, 4);
  }, []);
  
  const topSix = useMemo(() => {
    return PRODUCTS.filter(p => Array.isArray(p.media) && p.media.some(m => m.type === 'image')).slice(0, 6);
  }, []);
  
  // For the hero image slider
  const heroImages = [
    'products/premium-crosshatched-long-wallet.jpg',
    'products/new-premium-gridlock-reversible-chocolate-belt.jpg',
    'products/mens-premium-black-belt.jpg',
  ];
  
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section aria-label="Hero Banner" className="relative overflow-hidden">
        <div className="h-[70vh] min-h-[500px] max-h-[700px] relative">
          {/* Hero image slider */}
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                ${index === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}
              >
                <img
                  src={image}
                  alt={`Featured product ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/60 to-neutral-900/30" />
          </div>
          
          {/* Hero content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-neutral-100 mb-4 leading-tight">
                  Premium Leather <span className="text-accent-light">Craftsmanship</span>
                </h1>
                <p className="text-lg text-neutral-200 mb-8 font-light">
                  Handcrafted by Leather Engineering graduates with passion and precision. Experience the perfect blend of style, comfort, and durability.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/products"
                    className="btn btn-primary btn-lg"
                  >
                    Explore Collection
                  </Link>
                  <Link
                    to="/leather-details"
                    className="btn btn-outline-light btn-lg"
                  >
                    Our Leather Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">Featured Collection</h2>
            <div className="w-24 h-1 bg-primary-light mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => {
              const firstMedia = product.media?.[0];
              const imgSrc = firstMedia ? firstMedia.url : LOGO_URL;
              
              return (
                <Link 
                  to={`/products?product=${product.id}`}
                  key={product.id}
                  className="group product-card"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg shadow-subtle">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.onSale && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-accent-dark text-neutral-100 text-xs font-bold px-3 py-1 rounded-full">SALE</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-serif text-lg text-primary group-hover:text-primary-dark transition-colors">{product.name}</h3>
                    <div className="mt-1">
                      {product.onSale ? (
                        <div className="flex items-center justify-center">
                          <span className="text-neutral-500 line-through mr-2">৳{product.price}</span>
                          <span className="text-accent-dark font-bold">৳{product.salePrice}</span>
                        </div>
                      ) : (
                        <span className="text-primary font-medium">৳{product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn btn-outline inline-flex items-center"
            >
              <span>View All Products</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Animated Products Showcase */}
      <section aria-label="Products Showcase" className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-56 md:h-64 rounded-xl overflow-hidden shadow-lg">
            {/* Animated product banner background */}
            <div className="product-banner">
              <div className="product-banner__track" aria-hidden>
                {[...topSix, ...topSix].map((p, i) => {
                  // Use first image from media array
                  const imgMedia = p.media.find(m => m.type === 'image');
                  const imgSrc = imgMedia ? imgMedia.url : LOGO_URL;
                  return (
                    <div className="product-banner__item" key={`${p.id}-${i}`}> 
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="product-banner__img"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="product-banner__fade" />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Features */}
      <section className="py-16 bg-gradient-to-b from-neutral-100 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">Why Choose Hide Haven</h2>
            <p className="max-w-3xl mx-auto text-neutral-600">
              Our leather products are crafted with expertise and passion, designed to elevate your everyday experiences.
            </p>
            <div className="w-24 h-1 bg-primary-light mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {LEATHER_INFO.qualityHallmarks.map((hallmark, idx) => (
              <div key={idx} className="text-center p-6 bg-white rounded-lg shadow-subtle hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {idx === 0 ? (
                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v6h2v-6zm0 8h-2v2h2v-2z" />
                    </svg>
                  ) : idx === 1 ? (
                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-5h10v2H7zm3.3-3.8L8.4 9.3 7 10.7l3.3 3.3L17 7.3l-1.4-1.4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M3 17h18v2H3zm0-7h18v5H3zm18-4H3v2h18z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-serif font-medium text-primary mb-2">{hallmark.hallmark}</h3>
                <p className="text-neutral-600 text-sm">{hallmark.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About section */}
      <section className="relative py-16 md:py-20">
        <LogoWatermark />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-6">
              Our Leather Heritage
            </h2>
            <p className="text-lg text-neutral-700 mb-8">
              Run by a group of Leather Engineering graduates, our mission is simple - delivering genuine, quality, and convenient leather products for everyday use. With our technical expertise and passion for leather, we bring you products that are crafted to last and designed for comfort and style.
            </p>
            <Link
              to="/leather-details"
              className="btn btn-outline inline-flex items-center"
            >
              <span>Learn More About Our Leather</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Shipping Banner */}
      <section className="bg-primary text-neutral-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center">
            <div className="flex items-center gap-3">
              <ShippingIcon className="h-8 w-8" />
              <span className="font-medium">Free Shipping on Orders over ৳1500</span>
            </div>
            <div className="h-12 border-l border-neutral-100/30 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Quality Guaranteed</span>
            </div>
            <div className="h-12 border-l border-neutral-100/30 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Same Day Processing</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

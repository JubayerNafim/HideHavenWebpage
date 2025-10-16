import React from 'react';
import { LEATHER_INFO } from '../constants';
import { LogoWatermark } from './icons';

const LeatherDetails: React.FC = () => {
  return (
    <div className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-6">Our Leather Heritage</h1>
            <p className="text-xl text-neutral-600 mb-8">
              Understanding the quality, craftsmanship, and care that goes into our leather products
            </p>
          </div>
          <div className="mb-16 text-center">
            <p className="text-lg text-neutral-600 leading-relaxed">
              At Hide Haven, we take pride in our craft and the materials we use. Our team of Leather Engineering graduates 
              selects only the finest leather for our products, ensuring exceptional quality, durability, and comfort. 
              Learn more about our leather below.
            </p>
          </div>
          
          <div className="space-y-24 relative">
            <LogoWatermark className="opacity-5" />
            
            {/* Leather Types Section */}
            <section id="types" className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-12 text-center">
                Types of Leather We Use
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {LEATHER_INFO.leatherTypes.map((item, idx) => (
                  <div 
                    key={item.name}
                    className="bg-white rounded-lg shadow-subtle border border-neutral-200 p-6 hover:shadow-medium transition-shadow"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                      {idx === 0 ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      ) : idx === 1 ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6c0-1.1.9-2 2-2zm0 2v12h14V6H5zm2 2h10v2H7V8zm0 4h7v2H7v-2z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 7v10H5V7h9zm2-2H3v14h13V5zm5 0v14h2V5h-2zM10 9H7v2h3V9z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-primary">{item.name}</h3>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quality Hallmarks Section */}
            <section id="quality" className="relative z-10 bg-neutral-100 py-16 px-6 rounded-lg">
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-12 text-center">
                Hallmarks of Quality
              </h2>
              
              <div className="space-y-8">
                {LEATHER_INFO.qualityHallmarks.map((item, idx) => (
                  <div 
                    key={item.hallmark}
                    className="bg-white rounded-lg shadow-subtle p-6 flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-neutral-100 flex-shrink-0">
                      <span className="text-xl font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold mb-2 text-primary">{item.hallmark}</h3>
                      <p className="text-neutral-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Care Tips Section */}
            <section id="care" className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-12 text-center">
                Caring for Your Leather
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {LEATHER_INFO.careTips.map((item, idx) => (
                  <div 
                    key={item.tip}
                    className="bg-white rounded-lg shadow-subtle border border-neutral-200 p-6 hover:shadow-medium transition-shadow"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                      {idx === 0 ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9zm4 4h2v2h-2v-2zm0-6h2v4h-2V7z" />
                        </svg>
                      ) : idx === 1 ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm-4-7h8v2H8v-2zm0-4h8v2H8V9z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 19H5V5h7V3H3v18h18v-9h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-primary">{item.tip}</h3>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          {/* Call to action */}
          <div className="mt-20 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-primary mb-6">
              Experience the Difference
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Our leather products are crafted to last a lifetime with proper care. 
              Explore our collection and feel the quality for yourself.
            </p>
            <a href="/products" className="btn btn-primary btn-lg">
              Shop Our Collection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeatherDetails;

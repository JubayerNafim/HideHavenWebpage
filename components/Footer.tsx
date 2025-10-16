import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, MESSENGER_LINK, LEATHER_INFO } from '../constants';
import { Logo, PhoneIcon, EmailIcon, InstagramIcon, TikTokIcon, MessengerIcon } from './icons';

const Footer: React.FC = () => {
  const socialLinks = [
    { href: MESSENGER_LINK, icon: <MessengerIcon className="h-5 w-5" />, label: "Message on Facebook" },
    { href: `https://instagram.com/${CONTACT_INFO.instagram}`, icon: <InstagramIcon className="h-5 w-5" />, label: "Instagram" },
    { href: `https://tiktok.com/@${CONTACT_INFO.tiktok}`, icon: <TikTokIcon className="h-5 w-5" />, label: "TikTok" },
  ];
  
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", path: "/products" },
        { name: "Belts", path: "/products?type=belt" },
        { name: "Wallets", path: "/products?type=wallet" },
        { name: "New Arrivals", path: "/products?sort=new" },
        { name: "Sale Items", path: "/products?sale=true" },
      ]
    },
    {
      title: "Learn",
      links: [
        { name: "Leather Guide", path: "/leather-details" },
        { name: "Care Instructions", path: "/leather-details#care" },
        { name: "Quality Promise", path: "/leather-details#quality" },
        { name: "Shipping Policy", path: "/contact#shipping" },
        { name: "Returns Policy", path: "/contact#returns" },
      ]
    }
  ];
  
  return (
    <footer className="bg-neutral-300">
      {/* Main footer content */}
      <div className="container mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-1">
            <Link to="/" className="inline-block mb-6">
              <Logo className="h-12 w-auto" />
            </Link>
            <p className="text-primary-dark font-medium text-sm mb-6">
              Premium leather products handcrafted with care. Offering quality leather goods with elegant designs and exceptional durability.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={link.label}
                  className="bg-chocolate hover:bg-neutral-100 text-white hover:text-chocolate p-2 rounded-full transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="col-span-1">
              <h3 className="font-serif text-lg font-bold mb-4 text-primary">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.path} 
                      className="text-primary-dark hover:text-primary font-medium text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact info */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-bold mb-4 text-primary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-sm">
                  <a 
                    href={`tel:${CONTACT_INFO.phone}`} 
                    className="text-primary-dark font-medium hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                  <p className="text-primary-dark text-xs font-medium mt-1">Mon-Sat: 10am - 7pm</p>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <EmailIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                <a 
                  href={`mailto:${CONTACT_INFO.email}`} 
                  className="text-sm text-primary-dark font-medium hover:text-primary transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright bar */}
      <div className="border-t border-neutral-400">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <p className="text-primary-dark font-medium text-sm">
            &copy; {new Date().getFullYear()} Hide Haven. All Rights Reserved. <span className="mx-2">|</span> Crafted with genuine leather for premium quality.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

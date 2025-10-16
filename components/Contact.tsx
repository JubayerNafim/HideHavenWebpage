import React, { useState } from 'react';
import { CONTACT_INFO, MESSENGER_LINK, COVER_URL, API_ENDPOINT } from '../constants';
import { PhoneIcon, EmailIcon, InstagramIcon, TikTokIcon, MessengerIcon } from './icons';

const Contact: React.FC = () => {
  const contactItems = [
    {
      href: MESSENGER_LINK,
      Icon: MessengerIcon,
      label: "Primary Contact",
      text: "Message on Facebook",
      isPrimary: true
    },
    {
      href: `tel:${CONTACT_INFO.phone}`,
      Icon: PhoneIcon,
      label: "Phone",
      text: CONTACT_INFO.phone,
    },
    {
      href: `mailto:${CONTACT_INFO.email}`,
      Icon: EmailIcon,
      label: "Email",
      text: CONTACT_INFO.email,
    },
    {
      href: `https://instagram.com/${CONTACT_INFO.instagram}`,
      Icon: InstagramIcon,
      label: "Instagram",
      text: `@${CONTACT_INFO.instagram}`,
    },
    {
      href: `https://tiktok.com/@${CONTACT_INFO.tiktok}`,
      Icon: TikTokIcon,
      label: "TikTok",
      text: `@${CONTACT_INFO.tiktok}`,
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "10:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "11:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ];

  const faqs = [
    {
      question: "How can I place a custom order?",
      answer: "Contact us through Facebook Messenger or email with your requirements, and we'll guide you through the process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, mobile banking (bKash, Nagad), and bank transfers."
    },
    {
      question: "How long does shipping take?",
      answer: "We typically deliver within 2-3 business days in Dhaka and 3-5 days nationwide."
    }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full relative">
        <div 
          className="h-64 md:h-80 bg-cover bg-center relative" 
          style={{backgroundImage: `url(${COVER_URL})`}}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-cream mb-2 drop-shadow-lg">Get In Touch</h1>
              <p className="text-lg md:text-xl text-cream/90 font-light max-w-2xl mx-auto">We're here to answer any questions about our premium leather products</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-5xl px-4 md:px-8 mt-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-chocolate/20">
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Contact Information Section */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-chocolate mb-6 border-b border-chocolate/20 pb-3">Contact Information</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {contactItems.map(({ href, Icon, label, text, isPrimary }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center p-4 rounded-lg transition-all duration-300 ${
                        isPrimary 
                          ? 'bg-chocolate text-cream shadow-lg' 
                          : 'bg-cream hover:bg-chocolate/10 hover:shadow-md'
                      }`}
                    >
                      <div className={`mr-4 p-3 rounded-full ${
                        isPrimary 
                          ? 'bg-cream/20 group-hover:bg-cream/30' 
                          : 'bg-chocolate/10 group-hover:bg-chocolate/20'
                      } transition-all duration-300`}>
                        <Icon className={`h-6 w-6 ${isPrimary ? 'text-cream' : 'text-chocolate'}`} />
                      </div>
                      <div>
                        <p className={`font-bold text-lg ${isPrimary ? 'text-cream' : 'text-chocolate'}`}>{label}</p>
                        <p className={`${isPrimary ? 'text-cream/90' : 'text-chocolate-light'}`}>{text}</p>
                      </div>
                    </a>
                  ))}
                </div>
                
                {/* Business Hours */}
                <div className="mt-8">
                  <h3 className="text-xl font-serif font-medium text-chocolate mb-3">Business Hours</h3>
                  <div className="bg-cream rounded-lg p-4">
                    {businessHours.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b last:border-b-0 border-chocolate/10">
                        <span className="font-medium text-chocolate">{item.day}</span>
                        <span className="text-chocolate-light">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Map Location */}
                <div className="mt-8">
                  <h3 className="text-xl font-serif font-medium text-chocolate mb-3">Find Us</h3>
                  <div className="bg-gray-100 h-48 rounded-lg overflow-hidden border border-chocolate/10">
                    {/* You can embed a Google Map here */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-chocolate">
                      <p>Map will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form and FAQs */}
              <div>
                <ContactForm />
                
                <div className="mt-8">
                  <h3 className="text-2xl font-serif font-bold text-chocolate mb-4 border-b border-chocolate/20 pb-2">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-cream rounded-lg p-4">
                        <h4 className="font-bold text-chocolate mb-2">{faq.question}</h4>
                        <p className="text-chocolate-light">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

// Enhanced contact form posting to backend
const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const canSend = name.trim() && email.trim() && message.trim();
  
  const handleBlur = (field: 'name' | 'email' | 'message') => {
    setTouched({ ...touched, [field]: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    
    setTouched({ name: true, email: true, message: true });
    setStatus('sending');
    
    try {
      const res = await fetch(`${API_ENDPOINT}?action=contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      
      if (!res.ok) throw new Error('failed');
      
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
      setTouched({ name: false, email: false, message: false });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-chocolate/10">
      <h2 className="text-2xl font-serif font-bold text-chocolate mb-4 border-b border-chocolate/20 pb-2">Send Us a Message</h2>
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-chocolate mb-1">Your Name</label>
          <input 
            id="name"
            className={`w-full border ${touched.name && !name.trim() ? 'border-red-400 bg-red-50' : 'border-chocolate/20'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-chocolate/50 focus:border-transparent outline-none transition-all`} 
            placeholder="John Doe" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            onBlur={() => handleBlur('name')}
          />
          {touched.name && !name.trim() && (
            <p className="text-red-500 text-sm mt-1">Name is required</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-chocolate mb-1">Email Address</label>
          <input 
            id="email"
            type="email" 
            className={`w-full border ${touched.email && !email.trim() ? 'border-red-400 bg-red-50' : 'border-chocolate/20'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-chocolate/50 focus:border-transparent outline-none transition-all`} 
            placeholder="john@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            onBlur={() => handleBlur('email')}
          />
          {touched.email && !email.trim() && (
            <p className="text-red-500 text-sm mt-1">Email is required</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-chocolate mb-1">Your Message</label>
          <textarea 
            id="message"
            className={`w-full border ${touched.message && !message.trim() ? 'border-red-400 bg-red-50' : 'border-chocolate/20'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-chocolate/50 focus:border-transparent outline-none transition-all`} 
            placeholder="How can we help you?" 
            rows={5} 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            onBlur={() => handleBlur('message')}
          />
          {touched.message && !message.trim() && (
            <p className="text-red-500 text-sm mt-1">Message is required</p>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={!canSend || status === 'sending'} 
          className={`w-full px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
            canSend && status !== 'sending' 
              ? 'bg-chocolate text-cream hover:bg-chocolate-dark shadow-md hover:shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {status === 'sending' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : status === 'sent' ? (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Message Sent!
            </span>
          ) : 'Send Message'}
        </button>
        
        {status === 'error' && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 text-sm">
            Sorry, we couldn't send your message. Please try again later or contact us directly.
          </div>
        )}
        
        {status === 'sent' && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 text-sm">
            Thank you for your message! We'll get back to you as soon as possible.
          </div>
        )}
      </form>
    </div>
  );
};

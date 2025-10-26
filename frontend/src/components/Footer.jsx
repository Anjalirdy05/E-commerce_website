import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold">AR Shop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your destination for luxury products and exceptional shopping experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{fontFamily: 'Playfair Display'}}>Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-home-link">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-products-link">Products</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-about-link">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-contact-link">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{fontFamily: 'Playfair Display'}}>Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/orders" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-orders-link">Track Order</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-returns-link">Returns</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-shipping-link">Shipping Info</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-[#d4af37] transition-colors" data-testid="footer-faq-link">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{fontFamily: 'Playfair Display'}}>Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                <span>support@arshop.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={18} className="mt-1" />
                <span>123 Luxury Street, NYC 10001</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#d4af37] flex items-center justify-center transition-colors" data-testid="facebook-link">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#d4af37] flex items-center justify-center transition-colors" data-testid="twitter-link">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#d4af37] flex items-center justify-center transition-colors" data-testid="instagram-link">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 AR Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">GreenSpace</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting communities with nature and promoting sustainable urban living through accessible green spaces.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gray-800 p-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 p-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 p-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 p-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#spaces" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Discover Spaces</a></li>
              <li><a href="#map" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Interactive Map</a></li>
              <li><a href="#events" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Community Events</a></li>
              <li><a href="#tips" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Sustainability Tips</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Volunteer</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Urban Gardening Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Native Plant Database</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Sustainability Reports</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Research & Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Partner Organizations</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-400">hello@greenspace.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-400">(555) 123-GREEN</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400 mt-1" />
                <span className="text-gray-400">
                  123 Sustainability St.<br />
                  Green City, GC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-emerald-100 mb-6">
              Get the latest updates on new green spaces, events, and sustainability initiatives
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-emerald-200"
              />
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2025 GreenSpace. All rights reserved. Building sustainable communities together.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDirectoryPage = location.pathname === '/directory';

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-800">GreenSpace</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isDirectoryPage ? (
              <>
                <Link to="/#spaces" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Discover</Link>
                <Link to="/#map" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Map</Link>
                <Link to="/#tips" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Sustainability</Link>
                <Link to="/#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Events</Link>
              </>
            ) : (
              <>
                <a href="#spaces" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Discover</a>
                <a href="#map" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Map</a>
                <a href="#tips" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Sustainability</a>
                <a href="#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Events</a>
              </>
            )}
            <button
              onClick={() => navigate('/auth')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Login</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100">
            <nav className="flex flex-col space-y-4">
              <a href="#spaces" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Discover</a>
              <a href="#map" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Map</a>
              <a href="#tips" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Sustainability</a>
              <a href="#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Events</a>
              <button
                onClick={() => navigate('/auth')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
              >
                <span>Login</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
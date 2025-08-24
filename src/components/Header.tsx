import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, User, LogOut } from 'lucide-react';
import { supabase, getUserProfile, signOut } from '../lib/supabase';
import { storage } from '../utils/storage';
import AddActivityModal from './AddActivityModal';

// Toast component for notifications
const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-20 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300"
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDirectoryPage = location.pathname === '/directory';

  useEffect(() => {
    // Check persisted auth on initial load
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await handleUserSignIn(session.user);
      } else {
        handleUserSignOut();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSignIn = async (user) => {
    setUser(user);
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Store auth state in localStorage
    storage.setUser({
      id: user.id,
      email: user.email,
      username: user.email?.split('@')[0] || 'User'
    });
    
    // Fetch user profile
    const { data: profileData } = await getUserProfile(user.id);
    setProfile(profileData);
  };

  const handleUserSignOut = () => {
    setUser(null);
    setCurrentUser(null);
    setProfile(null);
    setIsLoggedIn(false);
    
    // Clear all auth state using storage utility
    storage.signOut();
  };

  const checkUser = async () => {
    // First check localStorage for persisted auth using storage utility
    const storedUser = storage.getUser();
    if (storedUser) {
      try {
        // Check if stored auth is not too old (optional: 7 days)
        const isExpired = Date.now() - storedUser.timestamp > 7 * 24 * 60 * 60 * 1000;
        if (isExpired) {
          storage.setUser(null);
        }
      } catch (error) {
        storage.setUser(null);
      }
    }

    // Check current session with Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await handleUserSignIn(user);
    } else {
      handleUserSignOut();
    }
  };

  const handleSignOut = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear local state immediately
    handleUserSignOut();
    
    // Close dropdown and mobile menu
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    
    // Navigate to home page immediately
    navigate('/');
    
    // Show success toast
    setToastMessage('Signed out successfully');
    setShowToast(true);
    
    // Sign out from Supabase in background (don't wait)
    signOut().catch(error => {
      console.error('Background sign out error:', error);
    });
  };

  const handleAddActivitySuccess = (newActivity) => {
    setShowAddActivityModal(false);
    setToastMessage('Activity added successfully!');
    setShowToast(true);
    
    // If we're on the dashboard, we could refresh the data here
    // For now, the dashboard will reload when navigated to
  };
  const closeToast = () => {
    setShowToast(false);
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <>
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={closeToast} 
      />
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
            
            {/* User Authentication Section */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsDropdownOpen(!isDropdownOpen);
                    }
                    if (e.key === 'Escape') {
                      setIsDropdownOpen(false);
                    }
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <User className="h-4 w-4" />
                  <span>{getUserDisplayName()}</span>
                </button>
                
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setShowAddActivityModal(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Add Activity
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      role="menuitem"
                      type="button"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Login</span>
              </button>
            )}
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
              
              {isLoggedIn && user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setShowAddActivityModal(true)}
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                  >
                    Add Activity
                  </button>
                  <div className="text-sm text-gray-600 mb-2">Signed in as {getUserDisplayName()}</div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
                    type="button"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
                >
                  <span>Login</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
      </header>
      
      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        onSuccess={handleAddActivitySuccess}
      />
    </>
  );
};

export default Header;
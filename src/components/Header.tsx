import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, User, LogOut } from 'lucide-react';
import { supabase, getUserProfile, signOut } from '../lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDirectoryPage = location.pathname === '/directory';

  useEffect(() => {
    // Check current user on component mount
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await getUserProfile(session.user.id);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profileData } = await getUserProfile(user.id);
      setProfile(profileData);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

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
            
            {/* User Authentication Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{getUserDisplayName()}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/community"
                      className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/add-activity"
                      className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Add Activity
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
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
              
              {user ? (
                <>
                  <Link 
                    to="/community"
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/add-activity"
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Activity
                  </Link>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Signed in as {getUserDisplayName()}</div>
                    <button
                      onClick={handleSignOut}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
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
  );
};

export default Header;
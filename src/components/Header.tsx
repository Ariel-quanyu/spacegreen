import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Search } from 'lucide-react';
import { supabase, getUserProfile } from '../lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isDirectoryPage = location.pathname === '/directory';

  // Check user authentication state
  React.useEffect(() => {
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
    await supabase.auth.signOut();
    navigate('/');
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
            {user && profile ? (
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/community')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
                >
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
              >
                <span>Login</span>
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          {user && profile ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/community')}
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium"
              >
                Dashboard
              </button>
              <div className="relative group">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2">
                  <span>{profile.full_name || profile.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => navigate('/community')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      View Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Login</span>
            </button>
          )}
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
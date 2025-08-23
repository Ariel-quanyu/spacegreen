import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Search, User, LogOut } from 'lucide-react';
import { supabase, signOut, getUserProfile } from '../lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  React.useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      await loadUserProfile(user.id);
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  };

  const loadUserProfile = async (userId: string) => {
    const { data: profileData } = await getUserProfile(userId);
    if (profileData) setProfile(profileData);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
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
            <Link to="/#spaces" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Discover</Link>
            <Link to="/#map" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Map</Link>
            <Link to="/#tips" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Sustainability</Link>
            <Link to="/#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Events</Link>
            <button
              onClick={() => navigate('/directory')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </button>
            
            {/* Authentication Status */}
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/community"
                  className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">
                    {profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
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
              <Link to="/#spaces" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Discover</Link>
              <Link to="/#map" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Map</Link>
              <Link to="/#tips" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Sustainability</Link>
              <Link to="/#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Events</Link>
              <button
                onClick={() => navigate('/directory')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
              >
                <Search className="h-4 w-4" />
                <span>Explore</span>
              </button>
              
              {/* Mobile Authentication Status */}
              {loading ? (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Link 
                    to="/community"
                    className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium block"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-lg">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      {profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2 w-fit"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 w-fit"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
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
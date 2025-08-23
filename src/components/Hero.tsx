import React from 'react';
import { ArrowRight, MapPin, Users, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover Your City's
                <span className="text-emerald-600 block">Green Oasis</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with nature, explore sustainable spaces, and join a community dedicated to making our cities greener and more livable for everyone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 font-semibold"
              >
                <span>Login</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-semibold"
              >
                Join Community
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">150+</div>
                <div className="text-sm text-gray-600">Green Spaces</div>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2.5K</div>
                <div className="text-sm text-gray-600">Community</div>
              </div>
              <div className="text-center">
                <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TreePine className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Eco-Friendly</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beautiful urban park with walking paths"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-bounce">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">CO₂</div>
                <div className="text-xs text-gray-600">Reduced</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">100%</div>
                <div className="text-xs text-gray-600">Renewable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Leaf } from 'lucide-react';

const spaces = [
  {
    id: 1,
    name: "Riverside Eco Park",
    location: "Royal Botanic Gardens Melbourne",
    rating: 4.8,
    lat: -37.8304,
    lng: 144.9803,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["Solar Panels", "Rain Gardens", "Native Plants"],
    description: "38-hectare botanical garden with over 8,500 plant species and stunning Yarra River views.",
    distance: "0.5 miles",
    website: "https://www.rbg.vic.gov.au/melbourne",
    googleMaps: "https://maps.google.com/dir/?api=1&destination=-37.8304,144.9803",
    address: "Birdwood Ave, Melbourne VIC 3004"
  },
  {
    id: 2,
    name: "Urban Forest Sanctuary",
    location: "Fitzroy Gardens",
    rating: 4.9,
    lat: -37.8136,
    lng: 144.9798,
    image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["Tree Canopy", "Wildlife Habitat", "Walking Trails"],
    description: "Historic 26-hectare park featuring formal gardens, heritage buildings and Captain Cook's Cottage.",
    distance: "1.2 miles",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/fitzroy-gardens.aspx",
    googleMaps: "https://maps.google.com/dir/?api=1&destination=-37.8136,144.9798",
    address: "Wellington Parade, East Melbourne VIC 3002"
  },
  {
    id: 3,
    name: "Community Garden Hub",
    location: "Carlton Gardens",
    rating: 4.7,
    lat: -37.8056,
    lng: 144.9717,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["Organic Farming", "Composting", "Educational Tours"],
    description: "UNESCO World Heritage site with Victorian-era landscaping and the Melbourne Museum.",
    distance: "0.8 miles",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/carlton-gardens.aspx",
    googleMaps: "https://maps.google.com/dir/?api=1&destination=-37.8056,144.9717",
    address: "Carlton VIC 3053"
  }
];

const FeaturedSpaces = () => {
  return (
    <section id="spaces" className="py-20 bg-white">
      <div id="section-green-spaces" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Green Spaces
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover beautiful, sustainable spaces that are making our city greener and more livable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Eco-Certified
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{space.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{space.name}</h3>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{space.location} • {space.distance}</span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {space.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {space.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${space.lat}&mlon=${space.lng}&zoom=16`, '_blank')}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                >
                  <Leaf className="h-4 w-4" />
                  <span>View on OpenStreetMap</span>
                </button>
                
                <div className="mt-3">
                  <a
                    href={space.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center text-sm font-medium block"
                  >
                    Official Website
                  </a>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  📍 {space.address}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/victoria-directory"
            id="btn-view-green-spaces"
            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold inline-block"
          >
            View All Green Spaces
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
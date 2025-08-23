import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Search, Filter, MapPin, Star, Clock, Users, TreePine, Flower, Mountain, Route, Tent, Heart } from 'lucide-react';

const allGreenSpaces = [
  // Parks
  {
    id: 1,
    name: "Royal Botanic Gardens Melbourne",
    category: "parks",
    type: "Botanical Garden",
    rating: 4.8,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "38-hectare botanical garden with over 8,500 plant species and stunning city views.",
    features: ["Native Plants", "Walking Trails", "Educational Tours", "Biodiversity"],
    address: "Birdwood Ave, Melbourne VIC 3004",
    openHours: "7:30 AM - 5:30 PM",
    website: "https://www.rbg.vic.gov.au/melbourne",
    dogFriendly: false,
    hasParking: true,
    accessibility: true
  },
  {
    id: 2,
    name: "Albert Park",
    category: "parks",
    type: "Recreation Park",
    rating: 4.5,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Large park surrounding Albert Park Lake with recreational facilities and F1 circuit.",
    features: ["Lake", "Sports Facilities", "Walking Track", "Wildlife"],
    address: "Albert Park VIC 3206",
    openHours: "24 hours",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/albert-park.aspx",
    dogFriendly: true,
    hasParking: true,
    accessibility: true
  },
  {
    id: 3,
    name: "Flagstaff Gardens",
    category: "parks",
    type: "Urban Park",
    rating: 4.4,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Historic urban park in the heart of Melbourne's CBD with city skyline views.",
    features: ["City Views", "Historic Site", "Playground", "Open Spaces"],
    address: "William St, Melbourne VIC 3000",
    openHours: "6:00 AM - 10:00 PM",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/flagstaff-gardens.aspx",
    dogFriendly: true,
    hasParking: false,
    accessibility: true
  },
  
  // Gardens
  {
    id: 4,
    name: "Fitzroy Gardens",
    category: "gardens",
    type: "Historic Garden",
    rating: 4.7,
    image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Historic 26-hectare formal gardens featuring heritage buildings and Captain Cook's Cottage.",
    features: ["Heritage Trees", "Formal Gardens", "Historic Buildings", "Walking Paths"],
    address: "Wellington Parade, East Melbourne VIC 3002",
    openHours: "5:00 AM - 10:00 PM",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/fitzroy-gardens.aspx",
    dogFriendly: false,
    hasParking: true,
    accessibility: true
  },
  {
    id: 5,
    name: "Carlton Gardens",
    category: "gardens",
    type: "World Heritage Garden",
    rating: 4.6,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "UNESCO World Heritage site with Victorian-era landscaping and Melbourne Museum.",
    features: ["World Heritage", "Victorian Gardens", "Museum", "Fountain"],
    address: "Carlton VIC 3053",
    openHours: "6:00 AM - 10:00 PM",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/carlton-gardens.aspx",
    dogFriendly: false,
    hasParking: true,
    accessibility: true
  },
  {
    id: 6,
    name: "Treasury Gardens",
    category: "gardens",
    type: "Formal Garden",
    rating: 4.3,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Formal gardens in the heart of the city with beautiful tree-lined paths and monuments.",
    features: ["Formal Design", "Historic Monuments", "Tree-lined Paths", "City Location"],
    address: "Spring St, Melbourne VIC 3000",
    openHours: "6:00 AM - 10:00 PM",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/treasury-gardens.aspx",
    dogFriendly: false,
    hasParking: false,
    accessibility: true
  },

  // Nature Reserves
  {
    id: 7,
    name: "Yarra Bend Park",
    category: "nature-reserves",
    type: "River Park",
    rating: 4.7,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Large park along the Yarra River with native bushland and wildlife sanctuary.",
    features: ["River Access", "Native Bushland", "Cycling Trails", "Wildlife Sanctuary"],
    address: "Yarra Bend Rd, Fairfield VIC 3078",
    openHours: "24 hours",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/yarra-bend-park.aspx",
    dogFriendly: true,
    hasParking: true,
    accessibility: false
  },
  {
    id: 8,
    name: "Westgate Park",
    category: "nature-reserves",
    type: "Wetland Reserve",
    rating: 4.2,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Unique wetland park famous for its pink lake and diverse bird life.",
    features: ["Pink Lake", "Bird Watching", "Wetlands", "Photography"],
    address: "Westgate Park, Port Melbourne VIC 3207",
    openHours: "Sunrise to Sunset",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/westgate-park",
    dogFriendly: true,
    hasParking: true,
    accessibility: false
  },

  // Trails
  {
    id: 9,
    name: "Capital City Trail",
    category: "trails",
    type: "Urban Trail",
    rating: 4.5,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "29km loop trail connecting Melbourne's parks, gardens and attractions.",
    features: ["Cycling Path", "Walking Trail", "City Circuit", "Multiple Access Points"],
    address: "Various locations, Melbourne",
    openHours: "24 hours",
    website: "https://www.melbourne.vic.gov.au/residents/home-neighbourhood/transport/walking-cycling/Pages/capital-city-trail.aspx",
    dogFriendly: true,
    hasParking: true,
    accessibility: true
  },
  {
    id: 10,
    name: "Maribyrnong River Trail",
    category: "trails",
    type: "River Trail",
    rating: 4.4,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Scenic trail following the Maribyrnong River through parks and reserves.",
    features: ["River Views", "Cycling Path", "Walking Trail", "Wildlife Spotting"],
    address: "Maribyrnong River, Melbourne",
    openHours: "24 hours",
    website: "https://www.maribyrnong.vic.gov.au/Residents/Parks-sport-and-recreation/Walking-and-cycling-trails",
    dogFriendly: true,
    hasParking: true,
    accessibility: true
  },

  // Camping (Day Use Areas)
  {
    id: 11,
    name: "Studley Park Boathouse",
    category: "camping",
    type: "Picnic Area",
    rating: 4.3,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Historic boathouse with picnic areas and punt hire on the Yarra River.",
    features: ["Picnic Tables", "BBQ Facilities", "Punt Hire", "Historic Building"],
    address: "1 Boathouse Rd, Kew VIC 3101",
    openHours: "9:00 AM - 5:00 PM",
    website: "https://www.studleyparkboathouse.com.au/",
    dogFriendly: true,
    hasParking: true,
    accessibility: true
  },
  {
    id: 12,
    name: "Jells Park",
    category: "camping",
    type: "Recreation Reserve",
    rating: 4.1,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Large park with lake, picnic areas, and extensive recreational facilities.",
    features: ["Lake", "BBQ Areas", "Playground", "Walking Trails"],
    address: "Jells Rd, Wheelers Hill VIC 3150",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/jells-park",
    dogFriendly: true,
    hasParking: true,
    accessibility: true
  }
];

const categories = [
  { id: 'all', name: 'All Spaces', icon: TreePine, count: allGreenSpaces.length },
  { id: 'parks', name: 'Parks', icon: TreePine, count: allGreenSpaces.filter(s => s.category === 'parks').length },
  { id: 'gardens', name: 'Gardens', icon: Flower, count: allGreenSpaces.filter(s => s.category === 'gardens').length },
  { id: 'nature-reserves', name: 'Nature Reserves', icon: Mountain, count: allGreenSpaces.filter(s => s.category === 'nature-reserves').length },
  { id: 'trails', name: 'Trails', icon: Route, count: allGreenSpaces.filter(s => s.category === 'trails').length },
  { id: 'camping', name: 'Picnic Areas', icon: Tent, count: allGreenSpaces.filter(s => s.category === 'camping').length },
  { id: 'dog-friendly', name: 'Dog-Friendly', icon: Heart, count: allGreenSpaces.filter(s => s.dogFriendly).length }
];

const GreenSpacesDirectory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredSpaces = allGreenSpaces.filter(space => {
    const matchesCategory = selectedCategory === 'all' || 
                           space.category === selectedCategory || 
                           (selectedCategory === 'dog-friendly' && space.dogFriendly);
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Melbourne Green Spaces Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover all of Melbourne's parks, gardens, nature reserves, and outdoor spaces
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search green spaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 shadow-md'
                }`}
              >
                <IconComponent className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold text-sm">{category.name}</div>
                <div className="text-xs opacity-75">{category.count}</div>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedSpaces.length} of {allGreenSpaces.length} green spaces
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Green Spaces Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedSpaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {space.type}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{space.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{space.name}</h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{space.address}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{space.openHours}</span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {space.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {space.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Amenities */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  {space.dogFriendly && (
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Dog-friendly</span>
                    </div>
                  )}
                  {space.hasParking && (
                    <div className="flex items-center space-x-1">
                      <span className="w-4 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">P</span>
                      <span>Parking</span>
                    </div>
                  )}
                  {space.accessibility && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Accessible</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <a
                    href={space.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center text-sm font-medium block"
                  >
                    Official Website
                  </a>
                  <button
                    onClick={() => window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(space.address)}`, '_blank')}
                    className={`w-full py-2 px-3 rounded-lg transition-colors duration-200 text-center text-sm font-medium text-white ${
                      space.category === 'events' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {space.category === 'events' ? 'Get Directions' : 'View on Map'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedSpaces.length === 0 && (
          <div className="text-center py-12">
            <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No green spaces found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreenSpacesDirectory;

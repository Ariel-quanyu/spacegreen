import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Search, Filter, MapPin, Star, Clock, Users, TreePine, Flower, Mountain, Route, Tent, Heart, Navigation } from 'lucide-react';

const allVictoriaGreenSpaces = [
  // Melbourne Metro
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
    region: "Melbourne Metro",
    openHours: "7:30 AM - 5:30 PM",
    website: "https://www.rbg.vic.gov.au/melbourne",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -37.8304,
    lng: 144.9803
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
    region: "Melbourne Metro",
    openHours: "24 hours",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/albert-park.aspx",
    dogFriendly: true,
    hasParking: true,
    accessibility: true,
    lat: -37.8417,
    lng: 144.9683
  },
  {
    id: 3,
    name: "Fitzroy Gardens",
    category: "gardens",
    type: "Historic Garden",
    rating: 4.7,
    image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Historic 26-hectare formal gardens featuring heritage buildings and Captain Cook's Cottage.",
    features: ["Heritage Trees", "Formal Gardens", "Historic Buildings", "Walking Paths"],
    address: "Wellington Parade, East Melbourne VIC 3002",
    region: "Melbourne Metro",
    openHours: "5:00 AM - 10:00 PM",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/fitzroy-gardens.aspx",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -37.8136,
    lng: 144.9798
  },
  {
    id: 4,
    name: "Carlton Gardens",
    category: "gardens",
    type: "World Heritage Garden",
    rating: 4.6,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "UNESCO World Heritage site with Victorian-era landscaping and Melbourne Museum.",
    features: ["World Heritage", "Victorian Gardens", "Museum", "Fountain"],
    address: "Carlton VIC 3053",
    region: "Melbourne Metro",
    openHours: "6:00 AM - 10:00 PM",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/carlton-gardens.aspx",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -37.8056,
    lng: 144.9717
  },
  {
    id: 5,
    name: "Yarra Bend Park",
    category: "nature-reserves",
    type: "River Park",
    rating: 4.7,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Large park along the Yarra River with native bushland and wildlife sanctuary.",
    features: ["River Access", "Native Bushland", "Cycling Trails", "Wildlife Sanctuary"],
    address: "Yarra Bend Rd, Fairfield VIC 3078",
    region: "Melbourne Metro",
    openHours: "24 hours",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/yarra-bend-park.aspx",
    dogFriendly: true,
    hasParking: true,
    accessibility: false,
    lat: -37.7956,
    lng: 145.0064
  },

  // Geelong & Surf Coast
  {
    id: 6,
    name: "Geelong Botanic Gardens",
    category: "gardens",
    type: "Botanical Garden",
    rating: 4.5,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Historic botanic gardens established in 1851 with diverse plant collections and heritage buildings.",
    features: ["Heritage Gardens", "Native Plants", "Historic Buildings", "Educational Programs"],
    address: "2A Garden St, Geelong VIC 3220",
    region: "Geelong & Surf Coast",
    openHours: "Sunrise to Sunset",
    website: "https://www.geelongaustralia.com.au/visit/article/item/8d0c4e2b4e0a464.aspx",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -38.1499,
    lng: 144.3617
  },
  {
    id: 7,
    name: "Point Danger Marine Sanctuary",
    category: "nature-reserves",
    type: "Marine Reserve",
    rating: 4.4,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Coastal marine sanctuary protecting diverse marine life and offering excellent snorkeling opportunities.",
    features: ["Marine Life", "Snorkeling", "Coastal Views", "Conservation"],
    address: "Point Danger, Torquay VIC 3228",
    region: "Geelong & Surf Coast",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/point-danger-marine-sanctuary",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -38.3275,
    lng: 144.3242
  },
  {
    id: 8,
    name: "Great Ocean Road Memorial Arch",
    category: "trails",
    type: "Scenic Drive",
    rating: 4.8,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Iconic memorial arch marking the start of the Great Ocean Road with stunning coastal views.",
    features: ["Scenic Views", "Historic Monument", "Coastal Access", "Photography"],
    address: "Great Ocean Rd, Eastern View VIC 3231",
    region: "Geelong & Surf Coast",
    openHours: "24 hours",
    website: "https://www.visitvictoria.com/regions/great-ocean-road/things-to-do/nature-and-wildlife/parks-and-gardens/great-ocean-road-memorial-arch",
    dogFriendly: true,
    hasParking: true,
    accessibility: true,
    lat: -38.3394,
    lng: 144.2869
  },

  // Ballarat & Goldfields
  {
    id: 9,
    name: "Ballarat Botanical Gardens",
    category: "gardens",
    type: "Historic Garden",
    rating: 4.6,
    image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Historic gardens established in 1857 featuring statuary, conservatory, and Prime Ministers Avenue.",
    features: ["Historic Statuary", "Conservatory", "Prime Ministers Avenue", "Lake Wendouree"],
    address: "Wendouree Parade, Ballarat VIC 3350",
    region: "Ballarat & Goldfields",
    openHours: "Sunrise to Sunset",
    website: "https://www.ballarat.vic.gov.au/city/parks-gardens-and-facilities/ballarat-botanical-gardens",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -37.5622,
    lng: 143.8503
  },
  {
    id: 10,
    name: "Sovereign Hill Goldfields",
    category: "parks",
    type: "Heritage Park",
    rating: 4.7,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Living museum recreating life on the goldfields in the 1850s with authentic buildings and demonstrations.",
    features: ["Gold Mining History", "Heritage Buildings", "Educational Tours", "Interactive Experiences"],
    address: "39 Magpie St, Ballarat VIC 3350",
    region: "Ballarat & Goldfields",
    openHours: "10:00 AM - 5:00 PM",
    website: "https://sovereignhill.com.au/",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -37.5833,
    lng: 143.8167
  },

  // Bendigo & Loddon
  {
    id: 11,
    name: "Bendigo Botanic Gardens",
    category: "gardens",
    type: "Botanical Garden",
    rating: 4.4,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Beautiful botanic gardens featuring native and exotic plants, walking trails, and peaceful lake.",
    features: ["Native Plants", "Exotic Collections", "Walking Trails", "Lake Views"],
    address: "White Hills Rd, Bendigo VIC 3550",
    region: "Bendigo & Loddon",
    openHours: "Sunrise to Sunset",
    website: "https://www.bendigo.vic.gov.au/Services/Parks-gardens-and-environment/Parks-and-gardens/Bendigo-Botanic-Gardens",
    dogFriendly: true,
    hasParking: true,
    accessibility: true,
    lat: -36.7570,
    lng: 144.3089
  },
  {
    id: 12,
    name: "Heathcote-Graytown National Park",
    category: "nature-reserves",
    type: "National Park",
    rating: 4.3,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Diverse national park featuring box-ironbark forests, granite outcrops, and abundant wildlife.",
    features: ["Box-Ironbark Forest", "Granite Outcrops", "Wildlife Viewing", "Bushwalking"],
    address: "Heathcote-Graytown National Park, VIC",
    region: "Bendigo & Loddon",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/heathcote-graytown-national-park",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -36.9167,
    lng: 144.7167
  },

  // Mornington Peninsula
  {
    id: 13,
    name: "Mornington Peninsula National Park",
    category: "nature-reserves",
    type: "National Park",
    rating: 4.8,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Spectacular coastal national park with rugged cliffs, pristine beaches, and diverse ecosystems.",
    features: ["Coastal Cliffs", "Pristine Beaches", "Bushwalking Trails", "Marine Life"],
    address: "Mornington Peninsula National Park, VIC",
    region: "Mornington Peninsula",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/mornington-peninsula-national-park",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -38.4167,
    lng: 144.9167
  },
  {
    id: 14,
    name: "Arthurs Seat State Park",
    category: "parks",
    type: "State Park",
    rating: 4.6,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Scenic state park offering panoramic views of Port Phillip Bay and the Mornington Peninsula.",
    features: ["Panoramic Views", "Chairlift", "Walking Trails", "Scenic Lookouts"],
    address: "Arthurs Seat Rd, Arthurs Seat VIC 3936",
    region: "Mornington Peninsula",
    openHours: "Sunrise to Sunset",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/arthurs-seat-state-park",
    dogFriendly: true,
    hasParking: true,
    accessibility: true,
    lat: -38.3500,
    lng: 145.0167
  },

  // Yarra Valley & Dandenongs
  {
    id: 15,
    name: "Dandenong Ranges National Park",
    category: "nature-reserves",
    type: "National Park",
    rating: 4.9,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Magnificent mountain ash forests, tree ferns, and lyrebirds in the cool temperate rainforest.",
    features: ["Mountain Ash Forest", "Tree Ferns", "Lyrebirds", "Cool Temperate Rainforest"],
    address: "Dandenong Ranges National Park, VIC",
    region: "Yarra Valley & Dandenongs",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/dandenong-ranges-national-park",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -37.8833,
    lng: 145.3500
  },
  {
    id: 16,
    name: "William Ricketts Sanctuary",
    category: "gardens",
    type: "Sculpture Garden",
    rating: 4.5,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Unique sculpture garden featuring clay figures integrated into the natural forest environment.",
    features: ["Clay Sculptures", "Forest Setting", "Aboriginal Culture", "Art Installation"],
    address: "1402 Mt Dandenong Tourist Rd, Mount Dandenong VIC 3767",
    region: "Yarra Valley & Dandenongs",
    openHours: "10:00 AM - 4:30 PM",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/william-ricketts-sanctuary",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -37.8333,
    lng: 145.3667
  },

  // Gippsland
  {
    id: 17,
    name: "Wilsons Promontory National Park",
    category: "nature-reserves",
    type: "National Park",
    rating: 4.9,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Victoria's most loved national park with pristine beaches, granite mountains, and diverse wildlife.",
    features: ["Pristine Beaches", "Granite Mountains", "Diverse Wildlife", "Bushwalking"],
    address: "Wilsons Promontory National Park, VIC",
    region: "Gippsland",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/wilsons-promontory-national-park",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -39.0167,
    lng: 146.3167
  },
  {
    id: 18,
    name: "Phillip Island Nature Parks",
    category: "nature-reserves",
    type: "Wildlife Reserve",
    rating: 4.7,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Famous for the Penguin Parade and home to diverse wildlife including seals, koalas, and echidnas.",
    features: ["Penguin Parade", "Seal Watching", "Koala Conservation", "Wildlife Education"],
    address: "1019 Ventnor Rd, Ventnor VIC 3922",
    region: "Gippsland",
    openHours: "Varies by season",
    website: "https://www.penguins.org.au/",
    dogFriendly: false,
    hasParking: true,
    accessibility: true,
    lat: -38.5167,
    lng: 145.2333
  },

  // High Country
  {
    id: 19,
    name: "Mount Buffalo National Park",
    category: "nature-reserves",
    type: "Alpine Park",
    rating: 4.8,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Spectacular alpine plateau with granite tors, wildflower displays, and panoramic mountain views.",
    features: ["Alpine Plateau", "Granite Tors", "Wildflowers", "Mountain Views"],
    address: "Mount Buffalo National Park, VIC",
    region: "High Country",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/mount-buffalo-national-park",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -36.7333,
    lng: 146.7833
  },
  {
    id: 20,
    name: "Alpine National Park",
    category: "nature-reserves",
    type: "Alpine Park",
    rating: 4.9,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Victoria's largest national park featuring snow-covered peaks, alpine meadows, and pristine wilderness.",
    features: ["Snow-covered Peaks", "Alpine Meadows", "Pristine Wilderness", "Skiing"],
    address: "Alpine National Park, VIC",
    region: "High Country",
    openHours: "24 hours",
    website: "https://www.parks.vic.gov.au/places-to-see/parks/alpine-national-park",
    dogFriendly: false,
    hasParking: true,
    accessibility: false,
    lat: -36.9000,
    lng: 147.2500
  }
];

const categories = [
  { id: 'all', name: 'All Spaces', icon: TreePine, count: allVictoriaGreenSpaces.length },
  { id: 'parks', name: 'Parks', icon: TreePine, count: allVictoriaGreenSpaces.filter(s => s.category === 'parks').length },
  { id: 'gardens', name: 'Gardens', icon: Flower, count: allVictoriaGreenSpaces.filter(s => s.category === 'gardens').length },
  { id: 'nature-reserves', name: 'Nature Reserves', icon: Mountain, count: allVictoriaGreenSpaces.filter(s => s.category === 'nature-reserves').length },
  { id: 'trails', name: 'Trails', icon: Route, count: allVictoriaGreenSpaces.filter(s => s.category === 'trails').length },
  { id: 'camping', name: 'Picnic Areas', icon: Tent, count: allVictoriaGreenSpaces.filter(s => s.category === 'camping').length },
  { id: 'dog-friendly', name: 'Dog-Friendly', icon: Heart, count: allVictoriaGreenSpaces.filter(s => s.dogFriendly).length }
];

const regions = [
  'All Regions',
  'Melbourne Metro',
  'Geelong & Surf Coast',
  'Ballarat & Goldfields',
  'Bendigo & Loddon',
  'Mornington Peninsula',
  'Yarra Valley & Dandenongs',
  'Gippsland',
  'High Country'
];

const VictoriaGreenSpacesDirectory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [distanceFilter, setDistanceFilter] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  // Get user's current location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError('');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Location access denied. Please enable location access to see distances and use distance filtering.');
        }
      );
    } else {
      setLocationError('Geolocation not supported by your browser. Distance filtering is not available.');
    }
  }, []);

  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Add distance to each location
  const spacesWithDistance = allVictoriaGreenSpaces.map(space => {
    if (!userLocation) return { ...space, distance: null };
    
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      space.lat, 
      space.lng
    );
    
    return {
      ...space,
      distance: distance,
      distanceText: distance < 1 ? 
        `${Math.round(distance * 1000)}m` : 
        `${distance.toFixed(1)}km`
    };
  });

  const filteredSpaces = spacesWithDistance.filter(space => {
    const matchesCategory = selectedCategory === 'all' || 
                           space.category === selectedCategory || 
                           (selectedCategory === 'dog-friendly' && space.dogFriendly);
    const matchesRegion = selectedRegion === 'All Regions' || space.region === selectedRegion;
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDistance = distanceFilter === 'All' || 
                           !space.distance ||
                           (distanceFilter === '25km' && space.distance <= 25) ||
                           (distanceFilter === '50km' && space.distance <= 50) ||
                           (distanceFilter === '100km' && space.distance <= 100) ||
                           (distanceFilter === '200km' && space.distance <= 200);
    
    return matchesCategory && matchesRegion && matchesSearch && matchesDistance;
  });

  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'distance':
        if (!a.distance && !b.distance) return 0;
        if (!a.distance) return 1;
        if (!b.distance) return -1;
        return a.distance - b.distance;
      default:
        return 0;
    }
  });

  const distanceOptions = ['All', '25km', '50km', '100km', '200km'];

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
            Victoria Green Spaces Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover all of Victoria's parks, gardens, nature reserves, and outdoor spaces across the state
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            {/* Location Status */}
            {locationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {locationError}
                </p>
              </div>
            )}
            
            {userLocation && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm text-emerald-800">
                  <Navigation className="h-4 w-4 inline mr-1" />
                  Using your current location for distance calculations
                </p>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search green spaces across Victoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Horizontal Filters */}
            <div className="grid md:grid-cols-4 gap-6">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Type</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Distance</label>
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                  className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${!userLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!userLocation}
                >
                  {distanceOptions.map((distance) => (
                    <option key={distance} value={distance}>
                      {distance === 'All' ? 'All Distances' : `Within ${distance}${userLocation ? ' from you' : ''}`}
                    </option>
                  ))}
                </select>
                {!userLocation && (
                  <p className="text-xs text-gray-500 mt-1">Enable location access to use distance filtering</p>
                )}
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  {userLocation && <option value="distance">Distance</option>}
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Filter className="h-4 w-4" />
                  <span>Showing {sortedSpaces.length} of {spacesWithDistance.length} green spaces</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedRegion !== 'All Regions' && (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                    {selectedRegion}
                  </span>
                )}
                {distanceFilter !== 'All' && userLocation && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Within {distanceFilter}
                  </span>
                )}
              </div>
            </div>
          </div>
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
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                  {space.region}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{space.name}</h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{space.address}</span>
                </div>

                {space.distanceText && (
                  <div className="flex items-center text-emerald-600 mb-3">
                    <Navigation className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{space.distanceText} from your location</span>
                  </div>
                )}

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
                    className="w-full bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-center text-sm font-medium"
                  >
                    View on Map
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

        {/* Regional Information */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Victoria by Region</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.slice(1).map((region) => {
              const regionSpaces = allVictoriaGreenSpaces.filter(space => space.region === region);
              return (
                <div key={region} className="bg-emerald-50 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-2">{region}</h3>
                  <p className="text-sm text-emerald-600 mb-2">{regionSpaces.length} green spaces</p>
                  <p className="text-xs text-gray-600">
                    {regionSpaces.slice(0, 2).map(space => space.name).join(', ')}
                    {regionSpaces.length > 2 && ` and ${regionSpaces.length - 2} more...`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoriaGreenSpacesDirectory;
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Filter, Search, Navigation, Leaf, TreePine } from 'lucide-react';
import { Calendar } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom event marker icon (red)
const eventIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#dc2626"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <path d="M8 8h9v2H8V8zm0 3h9v2H8v-2zm0 3h6v2H8v-2z" fill="#dc2626"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom green marker icon
const greenIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#059669"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <path d="M12.5 7l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3l1.5-3z" fill="#059669"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Real Melbourne green spaces with actual coordinates
const melbourneGreenSpaces = [
  {
    id: 1,
    name: "Royal Botanic Gardens Melbourne",
    type: "Botanical Garden",
    lat: -37.8304,
    lng: 144.9803,
    description: "38-hectare botanical garden with over 8,500 plant species",
    features: ["Native Plants", "Walking Trails", "Educational Tours", "Biodiversity"],
    rating: 4.8,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.rbg.vic.gov.au/melbourne",
    address: "Birdwood Ave, Melbourne VIC 3004"
  },
  {
    id: 2,
    name: "Fitzroy Gardens",
    type: "Historic Park",
    lat: -37.8136,
    lng: 144.9798,
    description: "Historic 26-hectare park featuring formal gardens and heritage buildings",
    features: ["Heritage Trees", "Formal Gardens", "Historic Buildings", "Walking Paths"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/fitzroy-gardens.aspx",
    address: "Wellington Parade, East Melbourne VIC 3002"
  },
  {
    id: 3,
    name: "Carlton Gardens",
    type: "World Heritage Park",
    lat: -37.8056,
    lng: 144.9717,
    description: "UNESCO World Heritage site with Victorian-era landscaping",
    features: ["World Heritage", "Victorian Gardens", "Museum", "Fountain"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/carlton-gardens.aspx",
    address: "Carlton VIC 3053"
  },
  {
    id: 4,
    name: "Albert Park",
    type: "Recreation Park",
    lat: -37.8417,
    lng: 144.9683,
    description: "Large park surrounding Albert Park Lake with recreational facilities",
    features: ["Lake", "Sports Facilities", "Walking Track", "Wildlife"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/albert-park.aspx",
    address: "Albert Park VIC 3206"
  },
  {
    id: 5,
    name: "Flagstaff Gardens",
    type: "Urban Park",
    lat: -37.8108,
    lng: 144.9544,
    description: "Historic urban park in the heart of Melbourne's CBD",
    features: ["City Views", "Historic Site", "Playground", "Open Spaces"],
    rating: 4.4,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/flagstaff-gardens.aspx",
    address: "William St, Melbourne VIC 3000"
  },
  {
    id: 6,
    name: "Yarra Bend Park",
    type: "River Park",
    lat: -37.7956,
    lng: 145.0064,
    description: "Large park along the Yarra River with native bushland",
    features: ["River Access", "Native Bushland", "Cycling Trails", "Wildlife Sanctuary"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/yarra-bend-park.aspx",
    address: "Yarra Bend Rd, Fairfield VIC 3078"
  },
  {
    id: 7,
    name: "Kings Domain",
    type: "Parkland",
    lat: -37.8281,
    lng: 144.9744,
    description: "Expansive parkland featuring the Shrine of Remembrance",
    features: ["Memorial Sites", "Open Lawns", "City Views", "Walking Paths"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/kings-domain.aspx",
    address: "Linlithgow Ave, Melbourne VIC 3004"
  },
  {
    id: 8,
    name: "Docklands Park",
    type: "Waterfront Park",
    lat: -37.8183,
    lng: 144.9394,
    description: "Modern waterfront park with harbor views and public art",
    features: ["Harbor Views", "Public Art", "Playground", "Waterfront Access"],
    rating: 4.3,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourne.vic.gov.au/community/parks-open-spaces/major-parks-gardens/Pages/docklands-park.aspx",
    address: "Docklands Dr, Docklands VIC 3008"
  }
];

// Melbourne sustainability events with coordinates
const melbourneEvents = [
  // JANUARY 2025
  {
    id: 101,
    name: "New Year Green Resolution Workshop",
    type: "Workshop",
    lat: -37.8182,
    lng: 144.9691,
    description: "Start 2025 with sustainable living goals and eco-friendly resolutions",
    features: ["Goal Setting", "Sustainable Living", "Community", "Planning"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.sustainablemelbourne.org/",
    address: "Federation Square, Melbourne",
    date: "January 15, 2025",
    time: "10:00 AM - 2:00 PM",
    attendees: 200,
    category: "Workshop",
    month: "January",
    timeCategory: "upcoming"
  },
  {
    id: 102,
    name: "Australia Day Eco Festival",
    type: "Festival",
    lat: -37.8417,
    lng: 144.9683,
    description: "Celebrate Australia Day with eco-friendly activities and sustainable food",
    features: ["Eco Activities", "Sustainable Food", "Live Music", "Family Fun"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.australiadayeco.com.au/",
    address: "Albert Park, Melbourne",
    date: "January 26, 2025",
    time: "9:00 AM - 6:00 PM",
    attendees: 8000,
    category: "Festival",
    month: "January",
    timeCategory: "upcoming"
  },

  // FEBRUARY 2025
  {
    id: 103,
    name: "Melbourne Sustainable Living Festival",
    type: "Festival",
    lat: -37.8056,
    lng: 144.9717,
    description: "Australia's premier sustainability event featuring workshops and exhibitions",
    features: ["Workshops", "Exhibitions", "Eco Solutions", "Community"],
    rating: 4.9,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.slf.org.au/",
    address: "Royal Exhibition Building, Carlton",
    date: "February 8-10, 2025",
    time: "10:00 AM - 6:00 PM",
    attendees: 15000,
    category: "Festival",
    month: "February",
    timeCategory: "upcoming"
  },
  {
    id: 104,
    name: "Urban Beekeeping Workshop",
    type: "Workshop",
    lat: -37.8304,
    lng: 144.9803,
    description: "Learn about urban beekeeping and its role in city sustainability",
    features: ["Beekeeping", "Urban Agriculture", "Biodiversity", "Hands-on Learning"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.urbanbeekeeping.org.au/",
    address: "Royal Botanic Gardens Melbourne",
    date: "February 22, 2025",
    time: "1:00 PM - 4:00 PM",
    attendees: 50,
    category: "Workshop",
    month: "February",
    timeCategory: "upcoming"
  },

  // MARCH 2025
  {
    id: 105,
    name: "Clean Up Australia Day - Melbourne",
    type: "Community Action",
    lat: -37.8136,
    lng: 144.9631,
    description: "Join thousands of volunteers cleaning up parks and waterways",
    features: ["Volunteer Work", "Community", "Environmental", "Cleanup"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.cleanupaustraliaday.org.au/",
    address: "Various locations across Melbourne",
    date: "March 2, 2025",
    time: "9:00 AM - 12:00 PM",
    attendees: 5000,
    category: "Community Action",
    month: "March",
    timeCategory: "upcoming"
  },
  {
    id: 106,
    name: "Sustainable Fashion Week Melbourne",
    type: "Fashion",
    lat: -37.8249,
    lng: 144.9581,
    description: "Showcase of sustainable fashion brands and eco-friendly clothing",
    features: ["Sustainable Fashion", "Eco Brands", "Runway Shows", "Workshops"],
    rating: 4.4,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.sustainablefashionweek.com.au/",
    address: "Melbourne Convention Centre",
    date: "March 15-17, 2025",
    time: "10:00 AM - 8:00 PM",
    attendees: 12000,
    category: "Fashion",
    month: "March",
    timeCategory: "upcoming"
  },
  {
    id: 107,
    name: "Melbourne International Flower & Garden Show",
    type: "Gardening",
    lat: -37.8056,
    lng: 144.9717,
    description: "World-renowned garden show featuring sustainable landscaping",
    features: ["Sustainable Landscaping", "Native Plants", "Garden Design", "Education"],
    rating: 4.8,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbflowershow.com.au/",
    address: "Royal Exhibition Building & Carlton Gardens",
    date: "March 26-30, 2025",
    time: "9:00 AM - 5:00 PM",
    attendees: 100000,
    category: "Gardening",
    month: "March",
    timeCategory: "upcoming"
  },
  {
    id: 108,
    name: "Earth Hour Melbourne",
    type: "Climate Action",
    lat: -37.8182,
    lng: 144.9691,
    description: "Global environmental movement for climate action",
    features: ["Climate Action", "Global Movement", "Energy Conservation", "Awareness"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.earthhour.org.au/",
    address: "Federation Square & citywide",
    date: "March 29, 2025",
    time: "8:30 PM - 9:30 PM",
    attendees: 500000,
    category: "Climate Action",
    month: "March",
    timeCategory: "upcoming"
  },

  // APRIL 2025
  {
    id: 109,
    name: "Zero Waste Living Workshop",
    type: "Workshop",
    lat: -37.8108,
    lng: 144.9544,
    description: "Learn practical tips for reducing waste and living sustainably",
    features: ["Zero Waste", "Practical Tips", "DIY Solutions", "Community"],
    rating: 4.8,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.zerowastevic.org.au/",
    address: "Flagstaff Gardens, Melbourne",
    date: "April 5, 2025",
    time: "2:00 PM - 5:00 PM",
    attendees: 80,
    category: "Workshop",
    month: "April",
    timeCategory: "upcoming"
  },
  {
    id: 110,
    name: "Melbourne Green Expo",
    type: "Technology",
    lat: -37.8249,
    lng: 144.9581,
    description: "Showcase of green technologies and renewable energy solutions",
    features: ["Green Technology", "Renewable Energy", "Innovation", "Business"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.greenexpo.com.au/",
    address: "Melbourne Convention Centre",
    date: "April 12-13, 2025",
    time: "10:00 AM - 4:00 PM",
    attendees: 8000,
    category: "Technology",
    month: "April",
    timeCategory: "upcoming"
  },
  {
    id: 111,
    name: "Royal Botanic Gardens - Native Plant Sale",
    type: "Gardening",
    lat: -37.8304,
    lng: 144.9803,
    description: "Annual sale featuring native Australian plants",
    features: ["Native Plants", "Sustainable Gardening", "Wildlife Habitat", "Education"],
    rating: 4.4,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.rbg.vic.gov.au/melbourne",
    address: "Royal Botanic Gardens Melbourne",
    date: "April 19-20, 2025",
    time: "9:00 AM - 4:00 PM",
    attendees: 3000,
    category: "Gardening",
    month: "April",
    timeCategory: "upcoming"
  },
  {
    id: 112,
    name: "Earth Day Melbourne Festival",
    type: "Festival",
    lat: -37.8056,
    lng: 144.9717,
    description: "Celebrate Earth Day with environmental activities and awareness campaigns",
    features: ["Earth Day", "Environmental Education", "Activities", "Awareness"],
    rating: 4.9,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.earthdaymelbourne.org.au/",
    address: "Carlton Gardens, Melbourne",
    date: "April 22, 2025",
    time: "10:00 AM - 6:00 PM",
    attendees: 25000,
    category: "Festival",
    month: "April",
    timeCategory: "upcoming"
  },

  // MAY 2025
  {
    id: 113,
    name: "Permaculture Design Course",
    type: "Education",
    lat: -37.7956,
    lng: 145.0064,
    description: "Comprehensive course on permaculture principles and sustainable design",
    features: ["Permaculture", "Sustainable Design", "Education", "Certification"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.permaculturemelbourne.org.au/",
    address: "Yarra Bend Park, Melbourne",
    date: "May 10-12, 2025",
    time: "9:00 AM - 5:00 PM",
    attendees: 120,
    category: "Education",
    month: "May",
    timeCategory: "upcoming"
  },
  {
    id: 114,
    name: "Green Building Expo",
    type: "Technology",
    lat: -37.8249,
    lng: 144.9581,
    description: "Showcase of sustainable building materials and green construction",
    features: ["Green Building", "Sustainable Materials", "Construction", "Innovation"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.greenbuildingexpo.com.au/",
    address: "Melbourne Convention Centre",
    date: "May 25-26, 2025",
    time: "10:00 AM - 6:00 PM",
    attendees: 15000,
    category: "Technology",
    month: "May",
    timeCategory: "upcoming"
  },

  // JUNE 2025
  {
    id: 115,
    name: "World Environment Day Melbourne",
    type: "Community Action",
    lat: -37.8182,
    lng: 144.9691,
    description: "Global celebration of environmental protection and sustainability",
    features: ["World Environment Day", "Global Action", "Community", "Awareness"],
    rating: 4.8,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.worldenvironmentday.org.au/",
    address: "Federation Square, Melbourne",
    date: "June 5, 2025",
    time: "10:00 AM - 4:00 PM",
    attendees: 10000,
    category: "Community Action",
    month: "June",
    timeCategory: "upcoming"
  },
  {
    id: 116,
    name: "Renewable Energy Summit",
    type: "Conference",
    lat: -37.8249,
    lng: 144.9581,
    description: "Professional summit on renewable energy technologies and policies",
    features: ["Renewable Energy", "Technology", "Policy", "Professional"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.renewableenergysummit.com.au/",
    address: "Melbourne Convention Centre",
    date: "June 18-19, 2025",
    time: "9:00 AM - 5:00 PM",
    attendees: 2500,
    category: "Conference",
    month: "June",
    timeCategory: "upcoming"
  },

  // JULY 2025
  {
    id: 117,
    name: "Winter Solstice Sustainability Fair",
    type: "Fair",
    lat: -37.8417,
    lng: 144.9683,
    description: "Celebrate winter solstice with sustainable living demonstrations",
    features: ["Winter Solstice", "Sustainable Living", "Demonstrations", "Fair"],
    rating: 4.4,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.wintersolsticefair.org.au/",
    address: "Albert Park, Melbourne",
    date: "July 21, 2025",
    time: "11:00 AM - 5:00 PM",
    attendees: 3000,
    category: "Fair",
    month: "July",
    timeCategory: "upcoming"
  },
  {
    id: 118,
    name: "Plastic Free July Challenge Launch",
    type: "Community Action",
    lat: -37.8108,
    lng: 144.9544,
    description: "Launch event for the global Plastic Free July movement",
    features: ["Plastic Free", "Challenge", "Community", "Global Movement"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.plasticfreejuly.org/",
    address: "Flagstaff Gardens, Melbourne",
    date: "July 1, 2025",
    time: "12:00 PM - 3:00 PM",
    attendees: 1500,
    category: "Community Action",
    month: "July",
    timeCategory: "upcoming"
  },

  // AUGUST 2025
  {
    id: 119,
    name: "Melbourne Vegan Festival",
    type: "Festival",
    lat: -37.8056,
    lng: 144.9717,
    description: "Celebrate plant-based living and sustainable food choices",
    features: ["Vegan Food", "Plant-based Living", "Sustainable Food", "Health"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbourneveganfestival.com.au/",
    address: "Carlton Gardens, Melbourne",
    date: "August 16-17, 2025",
    time: "10:00 AM - 6:00 PM",
    attendees: 20000,
    category: "Festival",
    month: "August",
    timeCategory: "upcoming"
  },
  {
    id: 120,
    name: "Urban Farming Workshop Series",
    type: "Workshop",
    lat: -37.8304,
    lng: 144.9803,
    description: "Learn urban farming techniques for small spaces and apartments",
    features: ["Urban Farming", "Small Space Gardening", "Food Security", "Skills"],
    rating: 4.8,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.urbanfarmingmelbourne.org.au/",
    address: "Royal Botanic Gardens Melbourne",
    date: "August 23, 2025",
    time: "1:00 PM - 5:00 PM",
    attendees: 60,
    category: "Workshop",
    month: "August",
    timeCategory: "upcoming"
  },

  // SEPTEMBER 2025
  {
    id: 121,
    name: "Spring Equinox Green Market",
    type: "Market",
    lat: -37.8182,
    lng: 144.9691,
    description: "Seasonal market featuring local organic produce and eco-products",
    features: ["Organic Produce", "Local Vendors", "Eco Products", "Seasonal"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.springgreenmarket.com.au/",
    address: "Federation Square, Melbourne",
    date: "September 22, 2025",
    time: "8:00 AM - 2:00 PM",
    attendees: 5000,
    category: "Market",
    month: "September",
    timeCategory: "upcoming"
  },
  {
    id: 122,
    name: "Climate Action Youth Summit",
    type: "Conference",
    lat: -37.8249,
    lng: 144.9581,
    description: "Youth-led summit on climate action and environmental justice",
    features: ["Youth Leadership", "Climate Action", "Environmental Justice", "Activism"],
    rating: 4.9,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.climateactionyouth.org.au/",
    address: "Melbourne Convention Centre",
    date: "September 15, 2025",
    time: "9:00 AM - 6:00 PM",
    attendees: 1200,
    category: "Conference",
    month: "September",
    timeCategory: "upcoming"
  },

  // OCTOBER 2025
  {
    id: 123,
    name: "Melbourne Sustainability Week",
    type: "Festival",
    lat: -37.8182,
    lng: 144.9691,
    description: "Week-long celebration of sustainability with multiple events citywide",
    features: ["Week-long Event", "Multiple Venues", "Sustainability", "Citywide"],
    rating: 4.8,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.melbournesustainabilityweek.org.au/",
    address: "Various locations, Melbourne",
    date: "October 6-12, 2025",
    time: "Various times",
    attendees: 50000,
    category: "Festival",
    month: "October",
    timeCategory: "upcoming"
  },
  {
    id: 124,
    name: "Composting Workshop for Beginners",
    type: "Workshop",
    lat: -37.8417,
    lng: 144.9683,
    description: "Learn the basics of home composting and waste reduction",
    features: ["Composting", "Waste Reduction", "Beginner Friendly", "Home Skills"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.compostingmelbourne.org.au/",
    address: "Albert Park, Melbourne",
    date: "October 25, 2025",
    time: "2:00 PM - 4:00 PM",
    attendees: 40,
    category: "Workshop",
    month: "October",
    timeCategory: "upcoming"
  },

  // NOVEMBER 2025
  {
    id: 125,
    name: "Green Christmas Market",
    type: "Market",
    lat: -37.8056,
    lng: 144.9717,
    description: "Sustainable Christmas market with eco-friendly gifts and decorations",
    features: ["Eco Gifts", "Sustainable Christmas", "Local Artisans", "Green Products"],
    rating: 4.7,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.greenchristmasmarket.com.au/",
    address: "Carlton Gardens, Melbourne",
    date: "November 29-30, 2025",
    time: "10:00 AM - 6:00 PM",
    attendees: 15000,
    category: "Market",
    month: "November",
    timeCategory: "upcoming"
  },
  {
    id: 126,
    name: "Sustainable Transport Expo",
    type: "Technology",
    lat: -37.8249,
    lng: 144.9581,
    description: "Showcase of electric vehicles, bikes, and sustainable transport solutions",
    features: ["Electric Vehicles", "Sustainable Transport", "Innovation", "Future Mobility"],
    rating: 4.5,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.sustainabletransportexpo.com.au/",
    address: "Melbourne Convention Centre",
    date: "November 15-16, 2025",
    time: "10:00 AM - 5:00 PM",
    attendees: 12000,
    category: "Technology",
    month: "November",
    timeCategory: "upcoming"
  },

  // DECEMBER 2025
  {
    id: 127,
    name: "Year-End Sustainability Celebration",
    type: "Festival",
    lat: -37.8182,
    lng: 144.9691,
    description: "Celebrate the year's environmental achievements and plan for the future",
    features: ["Year Review", "Achievements", "Future Planning", "Community"],
    rating: 4.6,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    website: "https://www.sustainabilitycelebration.org.au/",
    address: "Federation Square, Melbourne",
    date: "December 15, 2025",
    time: "4:00 PM - 9:00 PM",
    attendees: 8000,
    category: "Festival",
    month: "December",
    timeCategory: "upcoming"
  }
];

// Combine all locations
const allLocations = [
  ...melbourneGreenSpaces.map(space => ({ ...space, itemType: 'space' })),
  ...melbourneEvents.map(event => ({ ...event, itemType: 'event' }))
];

const InteractiveMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filter, setFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
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
  const locationsWithDistance = allLocations.map(location => {
    if (!userLocation) return { ...location, distance: null };
    
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      location.lat, 
      location.lng
    );
    
    return {
      ...location,
      distance: distance,
      distanceText: distance < 1 ? 
        `${Math.round(distance * 1000)}m` : 
        `${distance.toFixed(1)}km`
    };
  });

  const filteredLocations = locationsWithDistance.filter(location => {
    const matchesFilter = filter === 'All' || location.type === filter;
    const matchesTimeFilter = timeFilter === 'All' || 
                             (location.itemType === 'event' && location.month === timeFilter);
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistance = distanceFilter === 'All' || 
                           !location.distance ||
                           (distanceFilter === '1km' && location.distance <= 1) ||
                           (distanceFilter === '5km' && location.distance <= 5) ||
                           (distanceFilter === '10km' && location.distance <= 10) ||
                           (distanceFilter === '15km' && location.distance <= 15) ||
                           (distanceFilter === '25km' && location.distance <= 25);
    
    return matchesFilter && matchesTimeFilter && matchesSearch && matchesDistance;
  });

  const uniqueTypes = ['All', ...new Set(locationsWithDistance.map(item => item.type))];
  const timeCategories = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
  const distanceOptions = ['All', '1km', '5km', '10km', '15km', '25km'];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <section id="map" className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Melbourne Green Spaces Map
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover Melbourne's beautiful parks, gardens, and green spaces. Click on markers to explore each location.
          </p>
        </div>

        {/* Combined Search and Filters - Horizontal Layout Above Map */}
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
                placeholder="Search green spaces and events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Horizontal Filters */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Type Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type} {type !== 'All' && `(${allLocations.filter(l => l.type === type).length})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter Events by Month</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {timeCategories.map((month) => (
                    <option key={month} value={month}>
                      {month === 'All' ? 'All Months' : `${month} 2025`}
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
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Green Space</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Event</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Showing {filteredLocations.length} of {locationsWithDistance.length} locations</span>
                {timeFilter !== 'All' && (
                  <span>• {timeFilter} 2025</span>
                )}
                {distanceFilter !== 'All' && (
                  <span>• Within {distanceFilter} from you</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map and Location List Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Location List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TreePine className="h-5 w-5 mr-2 text-emerald-600" />
                  Locations ({filteredLocations.length})
                </h3>
              </div>
              <div className="p-2">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200 ${
                      selectedLocation?.id === location.id ? 'bg-emerald-100 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        location.itemType === 'event' 
                          ? 'bg-red-100' 
                          : 'bg-emerald-100'
                      }`}>
                        {location.itemType === 'event' ? (
                          <Calendar className="h-4 w-4 text-red-600" />
                        ) : (
                          <Leaf className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{location.name}</h4>
                        <p className="text-xs text-gray-600 mb-1">{location.type}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-yellow-600">★ {location.rating}</span>
                          <span className="text-xs text-gray-500">•</span>
                          {location.distanceText && (
                            <>
                              <span className="text-xs text-emerald-600">{location.distanceText}</span>
                              <span className="text-xs text-gray-500">•</span>
                            </>
                          )}
                          <span className="text-xs text-gray-500">
                            {location.itemType === 'event' 
                              ? `${location.attendees} attending` 
                              : `${location.features.length} features`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Location Details */}
            {selectedLocation && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
                <div className="space-y-3">
                  <img 
                    src={selectedLocation.image} 
                    alt={selectedLocation.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <h4 className="font-semibold text-emerald-600">{selectedLocation.name}</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                  <p className="text-xs text-gray-500 mb-3">📍 {selectedLocation.address}</p>
                  {selectedLocation.distanceText && (
                    <p className="text-xs text-emerald-600 mb-3">📏 {selectedLocation.distanceText} from your location</p>
                  )}
                  {selectedLocation.itemType === 'event' && (
                    <div className="text-xs text-gray-600 mb-3">
                      <p>📅 {selectedLocation.date}</p>
                      <p>🕐 {selectedLocation.time}</p>
                      <p>👥 {selectedLocation.attendees} attending</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.features.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedLocation.itemType === 'event'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <a
                      href={selectedLocation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      <span>Official Website</span>
                    </a>
                    <button 
                      onClick={() => window.open(`https://www.openstreetmap.org/directions?to=${selectedLocation.lat}%2C${selectedLocation.lng}`, '_blank')}
                      className={`w-full py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium text-white ${
                        selectedLocation.itemType === 'event'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
              </div>
              
              <div className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden">
                <MapContainer
                  center={[-37.8136, 144.9631]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.lat, location.lng]}
                      icon={location.itemType === 'event' ? eventIcon : greenIcon}
                      eventHandlers={{
                        click: () => handleLocationSelect(location),
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="max-w-xs p-2">
                          <img 
                            src={location.image} 
                            alt={location.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <h3 className={`font-bold mb-1 ${
                            location.itemType === 'event' ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                            {location.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                          <p className="text-xs text-gray-500 mb-2">📍 {location.address}</p>
                          {location.distanceText && (
                            <p className="text-xs text-emerald-600 mb-2">📏 {location.distanceText} from you</p>
                          )}
                          {location.itemType === 'event' && (
                            <div className="text-xs text-gray-600 mb-2">
                              <p>📅 {location.date}</p>
                              <p>🕐 {location.time}</p>
                              <p>👥 {location.attendees} attending</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {location.features.slice(0, 3).map((feature, index) => (
                              <span 
                                key={index} 
                                className={`px-2 py-1 rounded-full text-xs ${
                                  location.itemType === 'event'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-bold text-sm ${
                              location.itemType === 'event' ? 'text-red-600' : 'text-emerald-600'
                            }`}>
                              ★ {location.rating}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <a
                              href={location.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-gray-100 text-gray-700 py-1 px-2 rounded text-xs text-center hover:bg-gray-200"
                            >
                              Official Site
                            </a>
                            <button
                              onClick={() => window.open(`https://www.openstreetmap.org/directions?to=${location.lat}%2C${location.lng}`, '_blank')}
                              className={`flex-1 text-white py-1 px-2 rounded text-xs ${
                                location.itemType === 'event'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700'
                              }`}
                            >
                              Directions
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>Click on markers to explore Melbourne's parks, gardens, and sustainability events • Zoom and pan to discover more locations</p>
                <p className="text-xs mt-1">Map data © OpenStreetMap contributors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
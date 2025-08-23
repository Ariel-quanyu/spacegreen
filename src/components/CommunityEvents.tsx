import React from 'react';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Melbourne Sustainable Living Festival",
    date: "February 8-10, 2025",
    time: "10:00 AM - 6:00 PM",
    location: "Royal Exhibition Building, Carlton",
    attendees: 15000,
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Australia's premier sustainability event featuring workshops, exhibitions, and eco-friendly solutions for urban living.",
    category: "Festival",
    website: "https://www.slf.org.au/"
  },
  {
    id: 2,
    title: "Clean Up Australia Day - Melbourne",
    date: "March 2, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Various locations across Melbourne",
    attendees: 5000,
    image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Join thousands of volunteers cleaning up parks, beaches, and waterways across Melbourne for a cleaner environment.",
    category: "Community Action",
    website: "https://www.cleanupaustraliaday.org.au/"
  },
  {
    id: 3,
    title: "Melbourne International Flower & Garden Show",
    date: "March 26-30, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Royal Exhibition Building & Carlton Gardens",
    attendees: 100000,
    image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "World-renowned garden show featuring sustainable landscaping, native plants, and eco-friendly gardening practices.",
    category: "Gardening",
    website: "https://www.melbflowershow.com.au/"
  },
  {
    id: 4,
    title: "Earth Hour Melbourne",
    date: "March 29, 2025",
    time: "8:30 PM - 9:30 PM",
    location: "Federation Square & citywide",
    attendees: 500000,
    image: "https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Global environmental movement where Melbourne joins millions worldwide in switching off lights for climate action.",
    category: "Climate Action",
    website: "https://www.earthhour.org.au/"
  },
  {
    id: 5,
    title: "Melbourne Green Expo",
    date: "April 12-13, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Melbourne Convention Centre",
    attendees: 8000,
    image: "https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Showcase of green technologies, renewable energy solutions, and sustainable business practices for Melbourne.",
    category: "Technology",
    website: "https://www.greenexpo.com.au/"
  },
  {
    id: 6,
    title: "Royal Botanic Gardens Melbourne - Native Plant Sale",
    date: "April 19-20, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Royal Botanic Gardens Melbourne",
    attendees: 3000,
    image: "https://images.pexels.com/photos/1061728/pexels-photo-1061728.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Annual sale featuring native Australian plants perfect for sustainable Melbourne gardens and wildlife habitats.",
    category: "Gardening",
    website: "https://www.rbg.vic.gov.au/melbourne"
  }
];

const CommunityEvents = () => {
  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Community Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow environmental enthusiasts and participate in hands-on sustainability activities
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-200">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3">
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold block text-center"
                  >
                    Learn More & Register
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Host Your Own Event</h3>
            <p className="text-gray-600 mb-6">
              Have an idea for a sustainability event? We'll help you organize and promote it to our community.
            </p>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold">
              Submit Event Proposal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityEvents;
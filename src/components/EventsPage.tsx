import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Download, Heart, Plus, Search, Filter } from 'lucide-react';
import { eventStorage, showToast } from '../utils/eventStorage';
import { useGlobalState } from '../utils/globalState';

const EventsPage = () => {
  const [state, globalState] = useGlobalState();
  const { user } = state;
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = () => {
    setLoading(true);
    try {
      const publishedEvents = eventStorage.getPublishedEvents();
      setEvents(publishedEvents);
      
      if (user) {
        const userRsvps = eventStorage.getRSVPs();
        setRsvps(userRsvps);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = (eventId) => {
    if (!user) {
      showToast('Please sign in to RSVP', 'info');
      return;
    }

    try {
      const isNowRSVPd = eventStorage.toggleRSVP(eventId);
      setRsvps(eventStorage.getRSVPs());
      showToast(isNowRSVPd ? 'RSVP confirmed!' : 'RSVP cancelled', 'success');
    } catch (error) {
      showToast('Error updating RSVP', 'error');
    }
  };

  const addToActivities = (event) => {
    if (!user) {
      showToast('Please sign in to add activities', 'info');
      return;
    }

    const activity = {
      id: `activity_${Date.now()}`,
      title: event.title,
      category: 'Social',
      dateISO: event.dateISO,
      note: `From event: ${event.id}`,
      status: 'planned',
      sourceType: 'event',
      tipId: null,
      frequencyPerMonth: 1,
      eventId: event.id,
      expectedImpact: event.expectedImpact
    };

    globalState.addActivity(activity);
    showToast('Event added to your activities!', 'success');
  };

  const downloadICS = (event) => {
    eventStorage.downloadICS(event);
    showToast('Calendar file downloaded!', 'success');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(events.map(e => e.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join local sustainability events and make a positive environmental impact
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex items-center text-gray-600">
              <Filter className="h-5 w-5 mr-2" />
              <span>{filteredEvents.length} events</span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const isRSVPd = rsvps.includes(event.id);
              const eventDate = new Date(event.dateISO);
              const isPastEvent = eventDate < new Date();

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {event.category}
                      </div>
                      {isPastEvent && (
                        <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Past Event
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span>{eventDate.toLocaleDateString()} • {event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span>{event.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        <span>Capacity: {event.capacity} people</span>
                      </div>
                    </div>

                    {/* Expected Impact */}
                    {(event.expectedImpact.co2_kg > 0 || event.expectedImpact.water_l > 0 || event.expectedImpact.money_aud > 0) && (
                      <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-2">Expected Impact</h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {event.expectedImpact.co2_kg > 0 && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              {event.expectedImpact.co2_kg}kg CO₂
                            </span>
                          )}
                          {event.expectedImpact.water_l > 0 && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {event.expectedImpact.water_l}L water
                            </span>
                          )}
                          {event.expectedImpact.money_aud > 0 && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              ${event.expectedImpact.money_aud}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Host Info */}
                    <div className="text-xs text-gray-500 mb-4">
                      Hosted by {event.hostName} • Contact: {event.contact}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleRSVP(event.id)}
                          disabled={isPastEvent}
                          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isPastEvent
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : isRSVPd
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isRSVPd ? 'fill-current' : ''}`} />
                          <span>{isRSVPd ? 'RSVP\'d' : 'RSVP'}</span>
                        </button>

                        <button
                          onClick={() => addToActivities(event)}
                          className="flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add to Activities</span>
                        </button>
                      </div>

                      <button
                        onClick={() => downloadICS(event)}
                        className="w-full flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download .ics</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {events.length === 0 
                ? "No events have been published yet. Be the first to create one!"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {!user && (
              <Link
                to="/auth"
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold inline-block"
              >
                Sign In to Create Events
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown, DollarSign, Droplets, Zap, Car, Recycle, ShoppingBag, Calendar, Star, ExternalLink } from 'lucide-react';
import { useGlobalState } from '../utils/globalState';

const ImpactDashboard = () => {
  const [state, globalState] = useGlobalState();
  const { user, tips } = state;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Environmental Impact</h1>
            <p className="text-gray-600 mb-8">Sign in to see your monthly environmental impact and achievements.</p>
            <Link 
              to="/auth"
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold inline-block"
            >
              Sign In to View Impact
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const monthlyImpact = globalState.computeMonthlyImpact();
  const doneActivities = globalState.getDoneActivitiesThisMonth();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const impactCards = [
    {
      title: 'CO₂ Reduced',
      value: `${monthlyImpact.co2_kg.toFixed(1)} kg`,
      icon: TrendingDown,
      color: 'emerald',
      description: 'Carbon emissions prevented this month',
      cta: 'Improve CO₂',
      link: '/tips?category=Energy,Transport',
      equivalent: `${(monthlyImpact.co2_kg / 22).toFixed(1)} trees planted equivalent`
    },
    {
      title: 'Money Saved',
      value: `$${monthlyImpact.money_aud.toFixed(0)}`,
      icon: DollarSign,
      color: 'green',
      description: 'Estimated savings this month',
      cta: 'Save More $',
      link: '/tips?sort=money',
      equivalent: `$${(monthlyImpact.money_aud * 12).toFixed(0)} potential yearly savings`
    },
    {
      title: 'Water Saved',
      value: `${monthlyImpact.water_l.toFixed(0)}L`,
      icon: Droplets,
      color: 'blue',
      description: 'Water conservation this month',
      cta: 'Save Water',
      link: '/tips?category=Water',
      equivalent: `${Math.floor(monthlyImpact.water_l / 8)} days of drinking water`
    }
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      'Energy': Zap,
      'Transport': Car,
      'Water': Droplets,
      'Waste': Recycle,
      'Food': ShoppingBag
    };
    return icons[category] || Star;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Energy': 'bg-yellow-100 text-yellow-700',
      'Transport': 'bg-blue-100 text-blue-700',
      'Water': 'bg-cyan-100 text-cyan-700',
      'Waste': 'bg-green-100 text-green-700',
      'Food': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

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
            Your Environmental Impact
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress and see the difference you're making • {currentMonth}
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {impactCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${card.color}-600`} />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</div>
                    <div className="text-sm text-gray-500">{card.title}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                <p className="text-xs text-gray-500 mb-4">{card.equivalent}</p>
                
                <Link
                  to={card.link}
                  className={`w-full bg-${card.color}-600 text-white py-2 px-4 rounded-lg hover:bg-${card.color}-700 transition-colors duration-200 text-center text-sm font-medium flex items-center justify-center space-x-2`}
                >
                  <span>{card.cta}</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Activities This Month */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-emerald-600" />
              Completed Activities This Month
            </h2>
            <Link
              to="/activities"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
            >
              View All Activities
            </Link>
          </div>

          {doneActivities.length > 0 ? (
            <div className="space-y-4">
              {doneActivities.map((activity) => {
                const IconComponent = getCategoryIcon(activity.category);
                const tip = activity.tipId ? tips.find(t => t.id === activity.tipId) : null;
                
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${getCategoryColor(activity.category)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        {activity.tipId && (
                          <Link
                            to={`/tips?highlight=${activity.tipId}`}
                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors duration-200"
                          >
                            From Tip
                          </Link>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Completed: {new Date(activity.doneAt || activity.dateISO).toLocaleDateString()}</span>
                        {activity.frequencyPerMonth > 1 && (
                          <span>{activity.frequencyPerMonth}x/month</span>
                        )}
                      </div>
                      
                      {activity.note && (
                        <p className="text-sm text-gray-500 mt-1">{activity.note}</p>
                      )}
                    </div>

                    {tip && (
                      <div className="text-right text-sm">
                        <div className="text-emerald-600 font-semibold">
                          {tip.impact.co2_kg > 0 && `${tip.impact.co2_kg * activity.frequencyPerMonth}kg CO₂`}
                        </div>
                        <div className="text-green-600 font-semibold">
                          {tip.impact.money_aud > 0 && `$${tip.impact.money_aud * activity.frequencyPerMonth}`}
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {tip.impact.water_l > 0 && `${tip.impact.water_l * activity.frequencyPerMonth}L`}
                        </div>
                      </div>
                    )}

                    {activity.sourceType === 'calculator' && activity.metrics?.co2_kg && (
                      <div className="text-right text-sm">
                        <div className="text-emerald-600 font-semibold">
                          {activity.metrics.co2_kg}kg CO₂
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed activities this month</h3>
              <p className="text-gray-600 mb-4">Start tracking your environmental actions to see your impact!</p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/tips"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                >
                  Explore Tips
                </Link>
                <Link
                  to="/activities"
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  Add Activity
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/tips"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-center group"
          >
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors duration-200">
              <Star className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find More Tips</h3>
            <p className="text-gray-600 text-sm">Discover new ways to reduce your environmental impact</p>
          </Link>

          <Link
            to="/calculator"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-center group"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-200">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Carbon Calculator</h3>
            <p className="text-gray-600 text-sm">Calculate your carbon footprint and track improvements</p>
          </Link>

          <Link
            to="/activities"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-center group"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-200">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Activities</h3>
            <p className="text-gray-600 text-sm">Log your environmental actions and monitor progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
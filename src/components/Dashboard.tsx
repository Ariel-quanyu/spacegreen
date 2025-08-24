import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Tag, FileText, Trash2, Edit3, Activity, TrendingUp, Award, Target } from 'lucide-react';
import { storage } from '../utils/storage';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const userData = storage.getUser();
      const activitiesData = storage.getActivities();
      
      setUser(userData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        storage.deleteActivity(id);
        setActivities(prev => prev.filter(a => a.id !== id));
        showToast('Activity deleted successfully');
      } catch (error) {
        console.error('Error deleting activity:', error);
        showToast('Error deleting activity', 'error');
      }
    }
  };

  const showToast = (message, type = 'success') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
    }`;
    toast.textContent = message;
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const getStats = () => {
    const totalActivities = activities.length;
    const thisMonth = activities.filter(a => {
      const activityDate = new Date(a.dateISO);
      const now = new Date();
      return activityDate.getMonth() === now.getMonth() && 
             activityDate.getFullYear() === now.getFullYear();
    }).length;
    
    const categories = [...new Set(activities.map(a => a.category))].length;
    
    return { totalActivities, thisMonth, categories };
  };

  const formatDate = (dateISO) => {
    try {
      return new Date(dateISO).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateISO;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-700',
      'Personal': 'bg-green-100 text-green-700',
      'Health': 'bg-red-100 text-red-700',
      'Learning': 'bg-purple-100 text-purple-700',
      'Social': 'bg-yellow-100 text-yellow-700',
      'Other': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 mb-8">Please sign in to track your activities and view your progress.</p>
            <Link 
              to="/auth"
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

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
            Welcome back, {user.username || user.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's your activity overview and recent progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalActivities}</h3>
                <p className="text-gray-600">Total Activities</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.thisMonth}</h3>
                <p className="text-gray-600">This Month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.categories}</h3>
                <p className="text-gray-600">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Award className="h-6 w-6 mr-2 text-emerald-600" />
              Your Activities
            </h2>
            <Link
              to="/add-activity"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Activity</span>
            </Link>
          </div>

          {activities.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your activities to see your progress here.</p>
              <Link
                to="/add-activity"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Activity</span>
              </Link>
            </div>
          ) : (
            /* Activities List */
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(activity.dateISO)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4" />
                          <span>{activity.category}</span>
                        </div>
                      </div>

                      {activity.note && (
                        <div className="flex items-start space-x-1 text-sm text-gray-600">
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p className="line-clamp-2">{activity.note}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/edit-activity/${activity.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit activity"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete activity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to add more activities?</h3>
          <p className="text-emerald-100 mb-6">
            Keep tracking your progress and build better habits
          </p>
          <Link
            to="/add-activity"
            className="bg-white text-emerald-600 px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors duration-200 font-semibold inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Activity</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
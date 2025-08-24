import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Tag, FileText, Trash2, Edit3, Activity, TrendingUp, Award, Target, Star } from 'lucide-react';
import { storage } from '../utils/storage';

// Updated Activity interface to match new data model
interface Activity {
  id: string;
  title: string;
  category: string;
  dateISO: string;
  note: string;
  status: 'planned' | 'in-progress' | 'done';
  sourceType: 'tip' | 'custom';
  tipId: string | null;
  frequencyPerMonth: number;
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // Get current user email for scoped storage
  const getCurrentUserEmail = () => {
    const user = storage.getUser();
    return user?.email || 'anonymous';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const userData = storage.getUser();
      
      // Load user-scoped activities
      const userEmail = userData?.email || 'anonymous';
      const userActivitiesKey = `activities__${userEmail}`;
      const storedActivities = localStorage.getItem(userActivitiesKey);
      const activitiesData = storedActivities ? JSON.parse(storedActivities) : [];
      
      setUser(userData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save activities to user-scoped localStorage
  const saveActivities = (newActivities: Activity[]) => {
    const userEmail = getCurrentUserEmail();
    const userActivitiesKey = `activities__${userEmail}`;
    localStorage.setItem(userActivitiesKey, JSON.stringify(newActivities));
    setActivities(newActivities);
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        const updatedActivities = activities.filter(a => a.id !== id);
        saveActivities(updatedActivities);
        showToast('Activity deleted successfully');
      } catch (error) {
        console.error('Error deleting activity:', error);
        showToast('Error deleting activity', 'error');
      }
    }
  };

  const handleAddActivity = (activity: Activity) => {
    saveActivities([...activities, activity]);
    setShowAddActivityModal(false);
    showToast('Activity added successfully!');
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
    const doneActivities = activities.filter(a => a.status === 'done').length;
    const thisMonth = activities.filter(a => {
      const activityDate = new Date(a.dateISO);
      const now = new Date();
      return activityDate.getMonth() === now.getMonth() && 
             activityDate.getFullYear() === now.getFullYear();
    }).length;
    
    const inProgress = activities.filter(a => a.status === 'in-progress').length;
    
    return { totalActivities, doneActivities, thisMonth, inProgress };
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

  const getStatusColor = (status: string) => {
    const colors = {
      'planned': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'done': 'bg-green-100 text-green-700'
    };
    return colors[status] || colors['planned'];
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
              <div className="bg-green-100 p-3 rounded-xl">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.doneActivities}</h3>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h3>
                <p className="text-gray-600">In Progress</p>
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
              onClick={() => setShowAddActivityModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Activity</span>
            </button>
          </div>

          {activities.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your activities to see your progress here.</p>
              <button
                onClick={() => setShowAddActivityModal(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Activity</span>
              </button>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        {activity.tipId && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Tip</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(activity.dateISO)}</span>
                        </div>
                        {activity.frequencyPerMonth > 1 && (
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{activity.frequencyPerMonth}x/month</span>
                          </div>
                        )}
                      </div>

                      {activity.note && (
                        <div className="flex items-start space-x-1 text-sm text-gray-600">
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p className="line-clamp-2">{activity.note}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {/* TODO: Implement edit */}}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit activity"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
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
          <button
            onClick={() => setShowAddActivityModal(true)}
            className="bg-white text-emerald-600 px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors duration-200 font-semibold inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Activity</span>
          </button>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <AddActivityModal
          onClose={() => setShowAddActivityModal(false)}
          onSave={handleAddActivity}
        />
      )}
    </div>
  );
};

// Add Activity Modal Component
const AddActivityModal = ({ onClose, onSave }: {
  onClose: () => void;
  onSave: (activity: Activity) => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    dateISO: new Date().toISOString().split('T')[0],
    note: '',
    status: 'planned' as const,
    frequencyPerMonth: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.dateISO) newErrors.dateISO = 'Date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const activity: Activity = {
      id: `activity_${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category.trim(),
      dateISO: formData.dateISO,
      note: formData.note.trim(),
      status: formData.status,
      sourceType: 'custom',
      tipId: null,
      frequencyPerMonth: formData.frequencyPerMonth
    };

    onSave(activity);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Activity</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Activity title"
              />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select category</option>
                <option value="Energy">Energy</option>
                <option value="Water">Water</option>
                <option value="Transport">Transport</option>
                <option value="Waste">Waste</option>
                <option value="Food">Food</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.dateISO}
                onChange={(e) => handleInputChange('dateISO', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.dateISO ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.dateISO && <p className="text-red-600 text-xs mt-1">{errors.dateISO}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency per Month
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.frequencyPerMonth}
                onChange={(e) => handleInputChange('frequencyPerMonth', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Optional notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
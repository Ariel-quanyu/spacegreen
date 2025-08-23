import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Plus, Trophy } from 'lucide-react';
import { supabase, addUserActivity, updateUserProfile, getUserProfile, addUserAchievement } from '../lib/supabase';

const AddActivityPage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activityType, setActivityType] = useState('');
  const [activityName, setActivityName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profileData } = await getUserProfile(user.id);
      if (profileData) setProfile(profileData);
    } else {
      navigate('/auth');
    }
  };

  const activityTypes = [
    { value: 'event_attended', label: 'Event Attended', xp: 50, icon: Calendar },
    { value: 'space_explored', label: 'Green Space Explored', xp: 30, icon: MapPin },
    { value: 'event_created', label: 'Event Created', xp: 100, icon: Plus },
  ];

  const getXPForActivity = (type: string) => {
    const activity = activityTypes.find(a => a.value === type);
    return activity ? activity.xp : 0;
  };

  const checkForAchievements = async (userId: string, newProfile: any) => {
    const achievements = [];

    // First activity achievement
    if (newProfile.events_attended + newProfile.spaces_explored + newProfile.events_created === 1) {
      achievements.push({
        type: 'first_activity',
        name: 'Green Beginner',
        description: 'Completed your first green activity!',
        xp: 25
      });
    }

    // Event milestones
    if (newProfile.events_attended === 5) {
      achievements.push({
        type: 'events',
        name: 'Event Explorer',
        description: 'Attended 5 green events!',
        xp: 50
      });
    }

    if (newProfile.events_attended === 10) {
      achievements.push({
        type: 'events',
        name: 'Event Enthusiast',
        description: 'Attended 10 green events!',
        xp: 100
      });
    }

    // Space exploration milestones
    if (newProfile.spaces_explored === 5) {
      achievements.push({
        type: 'exploration',
        name: 'Space Explorer',
        description: 'Explored 5 green spaces!',
        xp: 50
      });
    }

    if (newProfile.spaces_explored === 10) {
      achievements.push({
        type: 'exploration',
        name: 'Nature Navigator',
        description: 'Explored 10 green spaces!',
        xp: 100
      });
    }

    // Event creation milestones
    if (newProfile.events_created === 1) {
      achievements.push({
        type: 'creation',
        name: 'Community Builder',
        description: 'Created your first event!',
        xp: 75
      });
    }

    if (newProfile.events_created === 5) {
      achievements.push({
        type: 'creation',
        name: 'Event Organizer',
        description: 'Created 5 events!',
        xp: 150
      });
    }

    // XP milestones
    if (newProfile.total_xp >= 500 && profile.total_xp < 500) {
      achievements.push({
        type: 'xp',
        name: 'Green Warrior',
        description: 'Reached 500 XP!',
        xp: 100
      });
    }

    if (newProfile.total_xp >= 1000 && profile.total_xp < 1000) {
      achievements.push({
        type: 'xp',
        name: 'Eco Champion',
        description: 'Reached 1000 XP!',
        xp: 200
      });
    }

    // Add achievements to database
    for (const achievement of achievements) {
      await addUserAchievement(
        userId,
        achievement.type,
        achievement.name,
        achievement.description,
        achievement.xp
      );
    }

    return achievements;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const xpEarned = getXPForActivity(activityType);
      
      // Add activity
      await addUserActivity(user.id, activityType, activityName, location, xpEarned);

      // Update profile stats
      const updates: any = {
        total_xp: profile.total_xp + xpEarned,
      };

      if (activityType === 'event_attended') {
        updates.events_attended = profile.events_attended + 1;
      } else if (activityType === 'space_explored') {
        updates.spaces_explored = profile.spaces_explored + 1;
      } else if (activityType === 'event_created') {
        updates.events_created = profile.events_created + 1;
      }

      await updateUserProfile(user.id, updates);

      // Check for new achievements
      const newProfile = { ...profile, ...updates };
      const newAchievements = await checkForAchievements(user.id, newProfile);

      // Add achievement XP to total
      if (newAchievements.length > 0) {
        const achievementXP = newAchievements.reduce((sum, ach) => sum + ach.xp, 0);
        await updateUserProfile(user.id, {
          total_xp: newProfile.total_xp + achievementXP
        });
      }

      setSuccess(`Activity added! You earned ${xpEarned} XP${newAchievements.length > 0 ? ` and ${newAchievements.length} new achievement(s)!` : '!'}`);
      
      // Reset form
      setActivityType('');
      setActivityName('');
      setLocation('');

      // Redirect after success
      setTimeout(() => {
        navigate('/community');
      }, 2000);

    } catch (error: any) {
      console.error('Error adding activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/community"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-emerald-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <Plus className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Activity</h1>
            <p className="text-gray-600">Track your green activities and earn XP!</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-emerald-600" />
                <p className="text-emerald-800 font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Activity Type
              </label>
              <div className="grid gap-3">
                {activityTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setActivityType(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        activityType === type.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-6 w-6 text-emerald-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600">Earn {type.xp} XP</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          activityType === type.value
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-gray-300'
                        }`}>
                          {activityType === type.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Name
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Melbourne Sustainability Festival, Royal Botanic Gardens"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Melbourne, Carlton Gardens, Online"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !activityType}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Activity...' : `Add Activity & Earn ${getXPForActivity(activityType)} XP`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActivityPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, MapPin, Calendar, Plus, Target, Award, TrendingUp, Users } from 'lucide-react';
import { supabase, getUserProfile, getUserActivities, getUserAchievements } from '../lib/supabase';

const CommunityDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUser(user);
      try {
        await loadUserData(user.id);
      } catch (error) {
        console.error('Error loading user data:', error);
        // If profile doesn't exist, redirect to profile setup
        if (!profile) {
          setLoading(false);
          return;
        }
      }
    } else {
      // Redirect to auth if no user found
      window.location.href = '/auth';
      return;
    }
    setLoading(false);
  };

  const loadUserData = async (userId: string) => {
    try {
      const [profileResult, activitiesResult, achievementsResult] = await Promise.all([
        getUserProfile(userId),
        getUserActivities(userId),
        getUserAchievements(userId)
      ]);

      // If no profile exists, create one with basic info
      if (!profileResult.data && user) {
        console.log('No profile found, creating basic profile...');
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user?.email) {
          const { data: newProfile, error: createError } = await createUserProfile(
            userId,
            userData.user.email,
            userData.user.email.split('@')[0], // Use email prefix as username
            userData.user.email.split('@')[0]  // Use email prefix as full name initially
          );
          if (!createError && newProfile) {
            setProfile(newProfile);
          } else {
            console.error('Failed to create profile:', createError);
            setProfile(null);
          }
        }
      } else {
        setProfile(profileResult.data);
      }
      
      if (activitiesResult.data) {
        setActivities(activitiesResult.data);
      } else {
        setActivities([]);
      }
      
      if (achievementsResult.data) {
        setAchievements(achievementsResult.data);
      } else {
        setAchievements([]);
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      throw error;
    }
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXPForNextLevel = (currentXP: number) => {
    const currentLevel = calculateLevel(currentXP);
    return currentLevel * 100;
  };

  const getProgressToNextLevel = (currentXP: number) => {
    const currentLevel = calculateLevel(currentXP);
    const xpInCurrentLevel = currentXP - ((currentLevel - 1) * 100);
    return (xpInCurrentLevel / 100) * 100;
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return "🌳 Forest Guardian";
    if (level >= 15) return "🌿 Eco Champion";
    if (level >= 10) return "🌱 Green Warrior";
    if (level >= 5) return "🍃 Nature Friend";
    return "🌾 Green Sprout";
  };

  const getRecentAchievements = () => {
    return achievements.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your green journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join the Green Community</h1>
            <p className="text-gray-600 mb-8">Sign up to track your environmental impact and join fellow eco-warriors!</p>
            <Link 
              to="/auth"
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
            <p className="text-gray-600 mb-8">Let's set up your green journey profile!</p>
            <Link 
              to="/profile-setup"
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-semibold inline-block"
            >
              Setup Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = calculateLevel(profile.total_xp);
  const nextLevelXP = getXPForNextLevel(profile.total_xp);
  const progressPercent = getProgressToNextLevel(profile.total_xp);

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
            Welcome back, {profile.full_name || profile.username}!
          </h1>
          <p className="text-xl text-gray-600">
            Your green journey continues - let's make an impact together! 🌱
          </p>
        </div>

        {/* Level & XP Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-4xl">{getLevelTitle(currentLevel).split(' ')[0]}</div>
                <div>
                  <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
                  <p className="text-emerald-100">{getLevelTitle(currentLevel).split(' ').slice(1).join(' ')}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{profile.total_xp} XP</span>
                  <span>{nextLevelXP} XP</span>
                </div>
                <div className="w-full bg-emerald-700 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-emerald-100 text-sm">
                  {nextLevelXP - profile.total_xp} XP to next level
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-xl p-4">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{profile.events_attended}</div>
                <div className="text-sm text-emerald-100">Events Attended</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{profile.spaces_explored}</div>
                <div className="text-sm text-emerald-100">Spaces Explored</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{profile.events_created}</div>
                <div className="text-sm text-emerald-100">Events Created</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-emerald-600" />
                  Recent Activities
                </h3>
                <Link 
                  to="/add-activity"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
                >
                  Add Activity
                </Link>
              </div>
              
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        {activity.activity_type === 'event_attended' && <Calendar className="h-5 w-5 text-emerald-600" />}
                        {activity.activity_type === 'space_explored' && <MapPin className="h-5 w-5 text-emerald-600" />}
                        {activity.activity_type === 'event_created' && <Plus className="h-5 w-5 text-emerald-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.activity_name}</h4>
                        <p className="text-sm text-gray-600">{activity.location}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-600 font-bold">+{activity.xp_earned} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No activities yet</h4>
                  <p className="text-gray-600 mb-4">Start your green journey by adding your first activity!</p>
                  <Link 
                    to="/add-activity"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                  >
                    Add Your First Activity
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Achievements & Quick Actions */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                Recent Achievements
              </h3>
              
              {getRecentAchievements().length > 0 ? (
                <div className="space-y-3">
                  {getRecentAchievements().map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-500" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{achievement.achievement_name}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      <div className="text-yellow-600 font-bold text-sm">+{achievement.xp_reward} XP</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No achievements yet. Keep going!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/add-activity"
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-center block"
                >
                  Log New Activity
                </Link>
                <Link 
                  to="/quiz"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center block"
                >
                  Take Green Quiz
                </Link>
                <Link 
                  to="/leaderboard"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-center block"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
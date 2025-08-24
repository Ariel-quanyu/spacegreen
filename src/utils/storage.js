// Storage utilities for user auth and activities
export const storage = {
  // Auth helpers
  getUser() {
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  },

  setUser(user) {
    try {
      if (user) {
        localStorage.setItem('auth_user', JSON.stringify({
          ...user,
          timestamp: Date.now()
        }));
      } else {
        localStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  // Activities helpers
  getActivities() {
    try {
      const activities = localStorage.getItem('activities');
      return activities ? JSON.parse(activities) : [];
    } catch (error) {
      console.error('Error reading activities from localStorage:', error);
      return [];
    }
  },

  saveActivity(activity) {
    try {
      const activities = this.getActivities();
      const newActivity = {
        id: Date.now().toString(),
        ...activity,
        dateISO: activity.date || new Date().toISOString().split('T')[0]
      };
      activities.unshift(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));
      return newActivity;
    } catch (error) {
      console.error('Error saving activity to localStorage:', error);
      throw error;
    }
  },

  updateActivity(id, updates) {
    try {
      const activities = this.getActivities();
      const index = activities.findIndex(a => a.id === id);
      if (index !== -1) {
        activities[index] = { ...activities[index], ...updates };
        localStorage.setItem('activities', JSON.stringify(activities));
        return activities[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  deleteActivity(id) {
    try {
      const activities = this.getActivities();
      const filtered = activities.filter(a => a.id !== id);
      localStorage.setItem('activities', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  },

  // Sign out helper
  signOut() {
    try {
      // Clear all auth-related data
      localStorage.removeItem('auth_user');
      localStorage.removeItem('token');
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Set in-memory flags
      window.isLoggedIn = false;
      window.currentUser = null;

      return true;
    } catch (error) {
      console.error('Error during sign out:', error);
      return false;
    }
  }
};

// Initialize auth state on load
window.isLoggedIn = !!storage.getUser();
window.currentUser = storage.getUser();
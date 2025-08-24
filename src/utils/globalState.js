import React from 'react';

// Global State Management for GreenSpace App
// Handles user-scoped localStorage and cross-component state

class GlobalState {
  constructor() {
    this.listeners = new Set();
    this.state = {
      user: null,
      tips: [],
      activities: [],
      savedTips: [],
      calcInputs: {},
      impactOverrides: {}
    };
    this.init();
  }

  init() {
    // Load auth user
    const authUser = this.getFromStorage('auth_user');
    if (authUser) {
      this.state.user = authUser;
      this.loadUserData();
    }
    
    // Load or seed tips data
    this.loadTipsData();
  }

  // Storage helpers with user scoping
  getStorageKey(key) {
    if (this.state.user?.email && key.includes('__')) {
      return key.replace('__{email}', `__${this.state.user.email}`);
    }
    return key;
  }

  getFromStorage(key) {
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  setToStorage(key, data) {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  }

  // Load user-specific data
  loadUserData() {
    if (!this.state.user) return;

    this.state.activities = this.getFromStorage('activities__{email}') || [];
    this.state.savedTips = this.getFromStorage('tips_saved__{email}') || [];
    this.state.calcInputs = this.getFromStorage('calc_inputs__{email}') || {};
    this.state.impactOverrides = this.getFromStorage('impact_overrides__{email}') || {};
    
    this.notifyListeners();
  }

  // Load or seed tips data
  loadTipsData() {
    let tips = this.getFromStorage('tips_data');
    
    if (!tips) {
      // Seed with initial tips data
      tips = this.getSeedTips();
      this.setToStorage('tips_data', tips);
    }
    
    this.state.tips = tips;
    this.notifyListeners();
  }

  getSeedTips() {
    return [
      {
        id: "tip_energy_led",
        title: "Switch to LED bulbs",
        category: "Energy",
        difficulty: "Easy",
        effort_minutes: 5,
        impact: { co2_kg: 6, money_aud: 3, water_l: 0 },
        summary: "Replace halogens with LEDs at home entry and kitchen.",
        steps: [
          "Identify highest-use bulbs",
          "Replace with LED equivalents", 
          "Recycle old bulbs properly"
        ],
        tags: ["home", "lighting"]
      },
      {
        id: "tip_water_shower",
        title: "Take shorter showers",
        category: "Water",
        difficulty: "Easy",
        effort_minutes: 2,
        impact: { co2_kg: 4, money_aud: 8, water_l: 150 },
        summary: "Reduce shower time by 2-3 minutes to save water and energy.",
        steps: [
          "Set a 5-minute timer",
          "Turn off water while soaping",
          "Install a low-flow showerhead"
        ],
        tags: ["home", "bathroom", "daily"]
      },
      {
        id: "tip_transport_bike",
        title: "Bike to work once a week",
        category: "Transport",
        difficulty: "Medium",
        effort_minutes: 30,
        impact: { co2_kg: 12, money_aud: 15, water_l: 0 },
        summary: "Replace one car trip per week with cycling for health and environment.",
        steps: [
          "Plan a safe cycling route",
          "Check bike condition and safety gear",
          "Start with short distances",
          "Track your progress"
        ],
        tags: ["transport", "health", "exercise"]
      },
      {
        id: "tip_waste_compost",
        title: "Start home composting",
        category: "Waste",
        difficulty: "Medium",
        effort_minutes: 15,
        impact: { co2_kg: 8, money_aud: 5, water_l: 0 },
        summary: "Turn kitchen scraps into nutrient-rich soil for your garden.",
        steps: [
          "Choose a compost bin or area",
          "Collect fruit and vegetable scraps",
          "Add brown materials (leaves, paper)",
          "Turn regularly and monitor moisture"
        ],
        tags: ["home", "garden", "waste"]
      },
      {
        id: "tip_energy_unplug",
        title: "Unplug devices when not in use",
        category: "Energy",
        difficulty: "Easy",
        effort_minutes: 3,
        impact: { co2_kg: 3, money_aud: 4, water_l: 0 },
        summary: "Eliminate phantom power draw from electronics and chargers.",
        steps: [
          "Identify devices that draw standby power",
          "Use power strips for easy switching",
          "Unplug chargers when not charging",
          "Set reminders until it becomes habit"
        ],
        tags: ["home", "electronics", "daily"]
      },
      {
        id: "tip_food_local",
        title: "Buy local seasonal produce",
        category: "Food",
        difficulty: "Easy",
        effort_minutes: 10,
        impact: { co2_kg: 15, money_aud: 2, water_l: 20 },
        summary: "Support local farmers and reduce transport emissions.",
        steps: [
          "Find local farmers markets",
          "Learn what's in season",
          "Plan meals around seasonal produce",
          "Store properly to reduce waste"
        ],
        tags: ["food", "local", "shopping"]
      }
    ];
  }

  // State management methods
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Auth methods
  setUser(user) {
    this.state.user = user;
    this.setToStorage('auth_user', user);
    if (user) {
      this.loadUserData();
    } else {
      this.clearUserData();
    }
    this.notifyListeners();
  }

  clearUserData() {
    this.state.activities = [];
    this.state.savedTips = [];
    this.state.calcInputs = {};
    this.state.impactOverrides = {};
  }

  signOut() {
    // Clear user-scoped data
    if (this.state.user?.email) {
      const email = this.state.user.email;
      localStorage.removeItem(`activities__${email}`);
      localStorage.removeItem(`tips_saved__${email}`);
      localStorage.removeItem(`calc_inputs__${email}`);
      localStorage.removeItem(`impact_overrides__${email}`);
    }
    
    // Clear auth
    localStorage.removeItem('auth_user');
    this.state.user = null;
    this.clearUserData();
    this.notifyListeners();
  }

  // Tips methods
  getTips() {
    return this.state.tips;
  }

  getTipById(id) {
    return this.state.tips.find(tip => tip.id === id);
  }

  isTipSaved(tipId) {
    return this.state.savedTips.includes(tipId);
  }

  toggleTipSaved(tipId) {
    const index = this.state.savedTips.indexOf(tipId);
    if (index >= 0) {
      this.state.savedTips.splice(index, 1);
    } else {
      this.state.savedTips.push(tipId);
    }
    this.setToStorage('tips_saved__{email}', this.state.savedTips);
    this.notifyListeners();
  }

  // Activities methods
  getActivities() {
    return this.state.activities;
  }

  addActivity(activity) {
    const newActivity = {
      id: `activity_${Date.now()}`,
      dateISO: new Date().toISOString().split('T')[0],
      status: 'planned',
      sourceType: 'custom',
      tipId: null,
      frequencyPerMonth: 1,
      ...activity
    };

    // Check for existing activity with same tipId
    if (newActivity.tipId) {
      const existingIndex = this.state.activities.findIndex(
        a => a.tipId === newActivity.tipId
      );
      if (existingIndex >= 0) {
        this.state.activities[existingIndex] = { 
          ...this.state.activities[existingIndex], 
          ...newActivity 
        };
      } else {
        this.state.activities.push(newActivity);
      }
    } else {
      this.state.activities.push(newActivity);
    }

    this.setToStorage('activities__{email}', this.state.activities);
    this.notifyListeners();
    return newActivity;
  }

  updateActivity(id, updates) {
    const index = this.state.activities.findIndex(a => a.id === id);
    if (index >= 0) {
      this.state.activities[index] = { ...this.state.activities[index], ...updates };
      this.setToStorage('activities__{email}', this.state.activities);
      this.notifyListeners();
      return this.state.activities[index];
    }
    return null;
  }

  deleteActivity(id) {
    this.state.activities = this.state.activities.filter(a => a.id !== id);
    this.setToStorage('activities__{email}', this.state.activities);
    this.notifyListeners();
  }

  markTipDone(tipId) {
    const tip = this.getTipById(tipId);
    if (!tip) return null;

    // Find existing activity or create new one
    let activity = this.state.activities.find(a => a.tipId === tipId);
    
    if (activity) {
      activity.status = 'done';
      activity.doneAt = new Date().toISOString();
    } else {
      activity = {
        id: `activity_${Date.now()}`,
        title: tip.title,
        category: tip.category,
        dateISO: new Date().toISOString().split('T')[0],
        note: `Completed: ${tip.summary}`,
        status: 'done',
        sourceType: 'tip',
        tipId: tip.id,
        frequencyPerMonth: 1,
        doneAt: new Date().toISOString()
      };
      this.state.activities.push(activity);
    }

    this.setToStorage('activities__{email}', this.state.activities);
    this.notifyListeners();
    return activity;
  }

  // Calculator methods
  saveCalculatorInputs(inputs) {
    this.state.calcInputs = inputs;
    this.setToStorage('calc_inputs__{email}', inputs);
    this.notifyListeners();
  }

  getCalculatorInputs() {
    return this.state.calcInputs;
  }

  createCalculatorActivity(co2Saved, inputs) {
    const activity = {
      id: `calc_${Date.now()}`,
      title: "Low-carbon commute",
      category: "Transport",
      dateISO: new Date().toISOString().split('T')[0],
      note: "Auto from calculator",
      status: 'done',
      sourceType: 'calculator',
      tipId: null,
      frequencyPerMonth: 1,
      doneAt: new Date().toISOString(),
      metrics: { co2_kg: co2Saved }
    };

    this.state.activities.push(activity);
    this.setToStorage('activities__{email}', this.state.activities);
    this.notifyListeners();
    return activity;
  }

  // Impact calculation
  computeMonthlyImpact(month = new Date()) {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const tipMap = Object.fromEntries(this.state.tips.map(t => [t.id, t]));
    const seen = new Set();
    
    return this.state.activities.reduce((acc, activity) => {
      if (activity.status !== 'done') return acc;
      
      const when = new Date(activity.doneAt || activity.dateISO);
      if (when < start || when > end) return acc;

      if (activity.tipId) {
        const key = `${activity.tipId}-${start.toISOString()}`;
        if (seen.has(key)) return acc;
        seen.add(key);
        
        const base = tipMap[activity.tipId]?.impact || { co2_kg: 0, money_aud: 0, water_l: 0 };
        acc.co2_kg += (base.co2_kg || 0) * (activity.frequencyPerMonth || 1);
        acc.money_aud += (base.money_aud || 0) * (activity.frequencyPerMonth || 1);
        acc.water_l += (base.water_l || 0) * (activity.frequencyPerMonth || 1);
        return acc;
      }

      if (activity.sourceType === 'calculator' && activity.metrics?.co2_kg) {
        acc.co2_kg += activity.metrics.co2_kg;
        return acc;
      }

      // Handle event activities with expected impact
      if (activity.sourceType === 'event' && activity.expectedImpact) {
        acc.co2_kg += activity.expectedImpact.co2_kg || 0;
        acc.money_aud += activity.expectedImpact.money_aud || 0;
        acc.water_l += activity.expectedImpact.water_l || 0;
      }

      return acc;
    }, { co2_kg: 0, money_aud: 0, water_l: 0 });
  }

  getDoneActivitiesThisMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return this.state.activities.filter(activity => {
      if (activity.status !== 'done') return false;
      const when = new Date(activity.doneAt || activity.dateISO);
      return when >= start && when <= end;
    });
  }
}

// Create global instance
export const globalState = new GlobalState();

// React hook for components
export function useGlobalState() {
  const [state, setState] = React.useState(globalState.state);
  
  React.useEffect(() => {
    return globalState.subscribe(setState);
  }, []);
  
  return [state, globalState];
}

// Utility functions
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : type === 'info' ? 'bg-blue-600' : 'bg-emerald-600';
  toast.className = `fixed top-20 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`;
  toast.textContent = message;
  toast.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
}
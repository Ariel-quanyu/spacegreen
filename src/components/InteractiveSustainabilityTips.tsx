import React, { useState, useEffect } from 'react';
import { Lightbulb, Droplets, Recycle, Sun, Leaf, Zap, Home, Car, ShoppingBag, Filter, Search, Clock, DollarSign, TrendingDown, ChevronRight, ChevronDown, Star } from 'lucide-react';

// Data model for sustainability tips
interface Tip {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  effort_minutes: number;
  impact: {
    co2_kg: number;
    money_aud: number;
    water_l: number;
  };
  summary: string;
  steps: string[];
  tags: string[];
}

// Seed data for sustainability tips
const seedTips: Tip[] = [
  {
    id: "tip_energy_led",
    title: "Switch to LED bulbs",
    category: "Energy",
    difficulty: "Easy",
    effort_minutes: 5,
    impact: {
      co2_kg: 6,
      money_aud: 3,
      water_l: 0
    },
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
    impact: {
      co2_kg: 4,
      money_aud: 8,
      water_l: 150
    },
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
    impact: {
      co2_kg: 12,
      money_aud: 15,
      water_l: 0
    },
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
    impact: {
      co2_kg: 8,
      money_aud: 5,
      water_l: 0
    },
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
    impact: {
      co2_kg: 3,
      money_aud: 4,
      water_l: 0
    },
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
    impact: {
      co2_kg: 15,
      money_aud: 2,
      water_l: 20
    },
    summary: "Support local farmers and reduce transport emissions.",
    steps: [
      "Find local farmers markets",
      "Learn what's in season",
      "Plan meals around seasonal produce",
      "Store properly to reduce waste"
    ],
    tags: ["food", "local", "shopping"]
  },
  {
    id: "tip_water_rainwater",
    title: "Install a rainwater tank",
    category: "Water",
    difficulty: "Hard",
    effort_minutes: 120,
    impact: {
      co2_kg: 5,
      money_aud: 25,
      water_l: 500
    },
    summary: "Collect rainwater for garden irrigation and reduce mains water use.",
    steps: [
      "Check local regulations and rebates",
      "Choose appropriate tank size",
      "Install guttering and first-flush diverter",
      "Connect to irrigation system",
      "Regular maintenance and cleaning"
    ],
    tags: ["home", "garden", "water", "investment"]
  },
  {
    id: "tip_transport_carpool",
    title: "Organize a carpool group",
    category: "Transport",
    difficulty: "Medium",
    effort_minutes: 20,
    impact: {
      co2_kg: 20,
      money_aud: 12,
      water_l: 0
    },
    summary: "Share rides with colleagues or neighbors to reduce emissions.",
    steps: [
      "Find people with similar routes",
      "Set up a communication group",
      "Agree on cost sharing",
      "Create a schedule rotation",
      "Have backup plans for flexibility"
    ],
    tags: ["transport", "community", "work"]
  },
  {
    id: "tip_energy_solar",
    title: "Install solar panels",
    category: "Energy",
    difficulty: "Hard",
    effort_minutes: 240,
    impact: {
      co2_kg: 150,
      money_aud: 80,
      water_l: 0
    },
    summary: "Generate clean energy and reduce electricity bills long-term.",
    steps: [
      "Assess roof suitability and sun exposure",
      "Get quotes from certified installers",
      "Check government rebates and feed-in tariffs",
      "Plan system size based on usage",
      "Schedule installation and connection"
    ],
    tags: ["home", "energy", "investment", "solar"]
  },
  {
    id: "tip_waste_reusable",
    title: "Use reusable shopping bags",
    category: "Waste",
    difficulty: "Easy",
    effort_minutes: 1,
    impact: {
      co2_kg: 2,
      money_aud: 1,
      water_l: 0
    },
    summary: "Eliminate single-use plastic bags from your shopping routine.",
    steps: [
      "Buy quality reusable bags",
      "Keep bags in your car or by the door",
      "Set phone reminders for shopping trips",
      "Choose bags that fold small for convenience"
    ],
    tags: ["shopping", "plastic", "daily", "waste"]
  }
];

const categories = ['All', 'Energy', 'Water', 'Transport', 'Waste', 'Food'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

const categoryIcons = {
  'Energy': Zap,
  'Water': Droplets,
  'Transport': Car,
  'Waste': Recycle,
  'Food': ShoppingBag,
  'All': Leaf
};

const difficultyColors = {
  'Easy': 'bg-green-100 text-green-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Hard': 'bg-red-100 text-red-700'
};

const InteractiveSustainabilityTips = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

  // Initialize tips data
  useEffect(() => {
    const storedTips = localStorage.getItem('tips_data');
    const storedCompleted = localStorage.getItem('completed_tips');
    
    if (storedTips) {
      const parsedTips = JSON.parse(storedTips);
      setTips(parsedTips);
      setFilteredTips(parsedTips);
    } else {
      setTips(seedTips);
      setFilteredTips(seedTips);
      localStorage.setItem('tips_data', JSON.stringify(seedTips));
    }

    if (storedCompleted) {
      setCompletedTips(new Set(JSON.parse(storedCompleted)));
    }
  }, []);

  // Filter tips based on search and filters
  useEffect(() => {
    let filtered = tips.filter(tip => {
      const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || tip.difficulty === selectedDifficulty;
      const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tip.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesDifficulty && matchesSearch;
    });

    setFilteredTips(filtered);
  }, [tips, selectedCategory, selectedDifficulty, searchTerm]);

  const toggleTipCompletion = (tipId: string) => {
    const newCompleted = new Set(completedTips);
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId);
    } else {
      newCompleted.add(tipId);
    }
    setCompletedTips(newCompleted);
    localStorage.setItem('completed_tips', JSON.stringify([...newCompleted]));
  };

  const calculateTotalImpact = () => {
    const completedTipsList = tips.filter(tip => completedTips.has(tip.id));
    return completedTipsList.reduce((total, tip) => ({
      co2_kg: total.co2_kg + tip.impact.co2_kg,
      money_aud: total.money_aud + tip.impact.money_aud,
      water_l: total.water_l + tip.impact.water_l
    }), { co2_kg: 0, money_aud: 0, water_l: 0 });
  };

  const totalImpact = calculateTotalImpact();

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Sustainability Tips
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover practical ways to reduce your environmental impact and track your progress
          </p>
        </div>

        {/* Impact Summary */}
        {completedTips.size > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Star className="h-6 w-6 mr-2" />
              Your Environmental Impact
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <TrendingDown className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalImpact.co2_kg} kg</div>
                <div className="text-emerald-100">CO₂ Reduced Monthly</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">${totalImpact.money_aud}</div>
                <div className="text-emerald-100">Saved Monthly</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <Droplets className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalImpact.water_l}L</div>
                <div className="text-emerald-100">Water Saved Monthly</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-emerald-100">
                You've completed {completedTips.size} of {tips.length} sustainability tips!
              </span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category} Category
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty} Difficulty
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center text-gray-600">
              <Filter className="h-5 w-5 mr-2" />
              <span>{filteredTips.length} tips found</span>
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => {
            const IconComponent = categoryIcons[tip.category as keyof typeof categoryIcons] || Leaf;
            const isCompleted = completedTips.has(tip.id);
            const isExpanded = expandedTip === tip.id;

            return (
              <div
                key={tip.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  isCompleted ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`h-5 w-5 ${isCompleted ? 'text-emerald-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">{tip.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTipCompletion(tip.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Star className={`h-5 w-5 ${isCompleted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${isCompleted ? 'text-emerald-800' : 'text-gray-900'}`}>
                    {tip.title}
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {tip.summary}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tip.difficulty]}`}>
                      {tip.difficulty}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {tip.effort_minutes}min
                    </span>
                  </div>

                  {/* Impact Preview */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {tip.impact.co2_kg > 0 && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-emerald-600">{tip.impact.co2_kg}kg</div>
                        <div className="text-xs text-gray-500">CO₂/month</div>
                      </div>
                    )}
                    {tip.impact.money_aud > 0 && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-600">${tip.impact.money_aud}</div>
                        <div className="text-xs text-gray-500">saved/month</div>
                      </div>
                    )}
                    {tip.impact.water_l > 0 && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">{tip.impact.water_l}L</div>
                        <div className="text-xs text-gray-500">water/month</div>
                      </div>
                    )}
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>{isExpanded ? 'Hide Steps' : 'View Steps'}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Action Steps:</h4>
                      <ol className="space-y-2">
                        {tip.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {/* Tags */}
                      {tip.tags.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1">
                            {tip.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tips found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Start Your Sustainability Journey</h3>
          <p className="text-emerald-100 mb-6">
            Every small action counts. Pick an easy tip to get started and track your environmental impact!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedDifficulty('Easy')}
              className="bg-white text-emerald-600 px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors duration-200 font-semibold"
            >
              Show Easy Tips
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchTerm('');
              }}
              className="bg-emerald-700 text-white px-6 py-3 rounded-xl hover:bg-emerald-800 transition-colors duration-200 font-semibold"
            >
              View All Tips
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSustainabilityTips;
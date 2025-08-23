import React, { useState } from 'react';
import { Leaf, TrendingDown, Calculator, Award } from 'lucide-react';

const CarbonFootprint = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const impactStats = [
    { label: "Trees Planted", value: "1,240", icon: Leaf, color: "text-emerald-600" },
    { label: "CO₂ Reduced", value: "15.2 tons", icon: TrendingDown, color: "text-blue-600" },
    { label: "Community Members", value: "2,500+", icon: Award, color: "text-purple-600" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Environmental Impact
          </h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Track your carbon footprint and see how green spaces contribute to a sustainable future
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabbed Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-white/20 text-white'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Carbon Calculator
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'impact'
                  ? 'bg-white/20 text-white'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <TrendingDown className="h-5 w-5 inline mr-2" />
              Environmental Benefits
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Calculate Your Green Impact</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-emerald-100 mb-2">Transportation Method</label>
                      <select className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-emerald-200">
                        <option value="walking">Walking</option>
                        <option value="cycling">Cycling</option>
                        <option value="public">Public Transport</option>
                        <option value="car">Car</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-emerald-100 mb-2">Distance to Green Space (miles)</label>
                      <input
                        type="number"
                        placeholder="Enter distance"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-emerald-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-emerald-100 mb-2">Visits per Month</label>
                      <input
                        type="number"
                        placeholder="How often do you visit?"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-emerald-200"
                      />
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4">Your Impact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Monthly CO₂ Saved:</span>
                        <span className="font-bold">12.5 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Yearly Impact:</span>
                        <span className="font-bold">150 kg CO₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Trees Equivalent:</span>
                        <span className="font-bold">6.8 trees</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                      Get Detailed Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Environmental Benefits of Green Spaces</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">25%</div>
                    <div className="text-emerald-100">Air Quality Improvement</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">30%</div>
                    <div className="text-emerald-100">Urban Heat Reduction</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">40%</div>
                    <div className="text-emerald-100">Stormwater Management</div>
                  </div>
                  
                  <div className="bg-white/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">60%</div>
                    <div className="text-emerald-100">Biodiversity Increase</div>
                  </div>
                </div>

                <div className="bg-white/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4">How Green Spaces Help</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Absorb CO₂ and produce oxygen</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Filter air pollutants naturally</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Reduce urban heat island effect</span>
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Manage stormwater runoff</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Provide wildlife habitats</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Improve mental health and wellbeing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarbonFootprint;
import React, { useState } from 'react';
import { Lightbulb, Recycle, Droplets, Sun, ChevronRight } from 'lucide-react';

const tips = [
  {
    icon: Lightbulb,
    title: "Energy Conservation",
    description: "Simple ways to reduce energy consumption in urban spaces",
    tips: [
      "Use LED lighting in outdoor spaces",
      "Install motion sensors for pathway lighting",
      "Choose native plants that require less water",
      "Implement solar-powered garden features"
    ],
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    icon: Recycle,
    title: "Waste Reduction",
    description: "Minimize waste and maximize recycling in green spaces",
    tips: [
      "Set up composting systems for organic waste",
      "Use recycled materials for garden structures",
      "Implement proper waste sorting stations",
      "Organize community cleanup events"
    ],
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Droplets,
    title: "Water Management",
    description: "Efficient water use and conservation strategies",
    tips: [
      "Install rainwater harvesting systems",
      "Use drip irrigation for efficient watering",
      "Create rain gardens to manage runoff",
      "Choose drought-resistant plant varieties"
    ],
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Sun,
    title: "Renewable Energy",
    description: "Harness clean energy for sustainable operations",
    tips: [
      "Install solar panels for lighting and water features",
      "Use wind power for small-scale energy needs",
      "Implement geothermal systems where possible",
      "Partner with local renewable energy providers"
    ],
    color: "bg-orange-100 text-orange-600"
  }
];

const SustainabilityTips = () => {
  const [expandedTip, setExpandedTip] = useState(null);

  return (
    <section id="tips" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sustainability Tips
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn practical ways to create and maintain eco-friendly spaces in your community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            const isExpanded = expandedTip === index;
            
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedTip(isExpanded ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${tip.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tip.title}</h3>
                        <p className="text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <ul className="space-y-3">
                        {tip.tips.map((item, tipIndex) => (
                          <li key={tipIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Take Action?</h3>
          <p className="text-emerald-100 mb-6">
            Join our sustainability program and start making a difference in your community today
          </p>
          <button className="bg-white text-emerald-600 px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors duration-200 font-semibold">
            Join the Movement
          </button>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityTips;
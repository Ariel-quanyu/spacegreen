import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Car, Zap, Home, TrendingDown, TreePine, Award } from 'lucide-react';
import { useGlobalState, showToast } from '../utils/globalState';

const CarbonCalculator = () => {
  const [state, globalState] = useGlobalState();
  const { user } = state;
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    transportMethod: 'car',
    distanceKm: '',
    daysPerWeek: '',
    homeEnergyKwh: '',
    renewablePercent: '',
    wasteKg: '',
    recyclingPercent: ''
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  // Load saved inputs on mount
  useEffect(() => {
    if (user) {
      const savedInputs = globalState.getCalculatorInputs();
      if (savedInputs && Object.keys(savedInputs).length > 0) {
        setInputs(savedInputs);
      }
    }
  }, [user, globalState]);

  const transportEmissions = {
    car: 0.21,      // kg CO2 per km
    bus: 0.089,     // kg CO2 per km
    train: 0.041,   // kg CO2 per km
    bike: 0,        // kg CO2 per km
    walk: 0         // kg CO2 per km
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!inputs.transportMethod) {
      newErrors.transportMethod = 'Please select a transport method';
    }

    if (!inputs.distanceKm || inputs.distanceKm <= 0) {
      newErrors.distanceKm = 'Please enter a valid distance';
    }

    if (!inputs.daysPerWeek || inputs.daysPerWeek < 1 || inputs.daysPerWeek > 7) {
      newErrors.daysPerWeek = 'Please enter days per week (1-7)';
    }

    if (inputs.homeEnergyKwh && inputs.homeEnergyKwh < 0) {
      newErrors.homeEnergyKwh = 'Energy usage cannot be negative';
    }

    if (inputs.renewablePercent && (inputs.renewablePercent < 0 || inputs.renewablePercent > 100)) {
      newErrors.renewablePercent = 'Renewable percentage must be 0-100';
    }

    if (inputs.wasteKg && inputs.wasteKg < 0) {
      newErrors.wasteKg = 'Waste amount cannot be negative';
    }

    if (inputs.recyclingPercent && (inputs.recyclingPercent < 0 || inputs.recyclingPercent > 100)) {
      newErrors.recyclingPercent = 'Recycling percentage must be 0-100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateEmissions = () => {
    if (!validateInputs()) return;

    // Transport emissions (monthly)
    const transportCO2Monthly = transportEmissions[inputs.transportMethod] * 
                               parseFloat(inputs.distanceKm) * 
                               parseInt(inputs.daysPerWeek) * 
                               4.33; // weeks per month

    // Home energy emissions (monthly)
    let energyCO2Monthly = 0;
    if (inputs.homeEnergyKwh) {
      const renewablePercent = inputs.renewablePercent ? parseFloat(inputs.renewablePercent) / 100 : 0;
      const gridEmissionFactor = 0.82; // kg CO2 per kWh (Australia average)
      energyCO2Monthly = parseFloat(inputs.homeEnergyKwh) * gridEmissionFactor * (1 - renewablePercent);
    }

    // Waste emissions (monthly)
    let wasteCO2Monthly = 0;
    if (inputs.wasteKg) {
      const recyclingPercent = inputs.recyclingPercent ? parseFloat(inputs.recyclingPercent) / 100 : 0;
      const wasteEmissionFactor = 0.5; // kg CO2 per kg waste
      wasteCO2Monthly = parseFloat(inputs.wasteKg) * wasteEmissionFactor * (1 - recyclingPercent);
    }

    const totalCO2Monthly = transportCO2Monthly + energyCO2Monthly + wasteCO2Monthly;
    const totalCO2Yearly = totalCO2Monthly * 12;
    const treesEquivalent = totalCO2Yearly / 22; // 1 tree absorbs ~22kg CO2/year

    // Calculate potential savings by switching to greener alternatives
    let potentialSavings = 0;
    if (inputs.transportMethod === 'car') {
      // Savings from switching to public transport
      const busCO2 = transportEmissions.bus * parseFloat(inputs.distanceKm) * parseInt(inputs.daysPerWeek) * 4.33;
      potentialSavings += transportCO2Monthly - busCO2;
    }

    const calculationResults = {
      transport: transportCO2Monthly,
      energy: energyCO2Monthly,
      waste: wasteCO2Monthly,
      totalMonthly: totalCO2Monthly,
      totalYearly: totalCO2Yearly,
      treesEquivalent: treesEquivalent,
      potentialSavings: potentialSavings
    };

    setResults(calculationResults);

    // Save inputs for next time
    if (user) {
      globalState.saveCalculatorInputs(inputs);
    }
  };

  const generateDetailedReport = () => {
    if (!results || !user) return;

    // Create calculator activity
    const activity = globalState.createCalculatorActivity(results.potentialSavings, inputs);
    
    showToast('Report generated and saved to your activities!', 'success');
    
    // Navigate to impact page
    navigate('/impact');
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-emerald-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Carbon Footprint Calculator</h1>
          <p className="text-xl text-gray-600">
            Calculate your environmental impact and discover ways to reduce it
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Impact</h2>
            
            <div className="space-y-6">
              {/* Transport Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-emerald-600" />
                  Transportation
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Transport Method *
                    </label>
                    <select
                      value={inputs.transportMethod}
                      onChange={(e) => handleInputChange('transportMethod', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.transportMethod ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="car">Car</option>
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="bike">Bicycle</option>
                      <option value="walk">Walking</option>
                    </select>
                    {errors.transportMethod && (
                      <p className="text-red-600 text-xs mt-1">{errors.transportMethod}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Distance (km) *
                    </label>
                    <input
                      type="number"
                      value={inputs.distanceKm}
                      onChange={(e) => handleInputChange('distanceKm', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.distanceKm ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 20"
                    />
                    {errors.distanceKm && (
                      <p className="text-red-600 text-xs mt-1">{errors.distanceKm}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days per Week *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={inputs.daysPerWeek}
                      onChange={(e) => handleInputChange('daysPerWeek', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.daysPerWeek ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 5"
                    />
                    {errors.daysPerWeek && (
                      <p className="text-red-600 text-xs mt-1">{errors.daysPerWeek}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Energy Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                  Home Energy (Optional)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Energy Usage (kWh)
                    </label>
                    <input
                      type="number"
                      value={inputs.homeEnergyKwh}
                      onChange={(e) => handleInputChange('homeEnergyKwh', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.homeEnergyKwh ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 400"
                    />
                    {errors.homeEnergyKwh && (
                      <p className="text-red-600 text-xs mt-1">{errors.homeEnergyKwh}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renewable Energy (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.renewablePercent}
                      onChange={(e) => handleInputChange('renewablePercent', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.renewablePercent ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 25"
                    />
                    {errors.renewablePercent && (
                      <p className="text-red-600 text-xs mt-1">{errors.renewablePercent}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Waste Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-emerald-600" />
                  Waste (Optional)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Waste (kg)
                    </label>
                    <input
                      type="number"
                      value={inputs.wasteKg}
                      onChange={(e) => handleInputChange('wasteKg', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.wasteKg ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 50"
                    />
                    {errors.wasteKg && (
                      <p className="text-red-600 text-xs mt-1">{errors.wasteKg}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recycling Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.recyclingPercent}
                      onChange={(e) => handleInputChange('recyclingPercent', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.recyclingPercent ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 60"
                    />
                    {errors.recyclingPercent && (
                      <p className="text-red-600 text-xs mt-1">{errors.recyclingPercent}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={calculateEmissions}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold"
              >
                Calculate My Impact
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Carbon Footprint</h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{results.totalMonthly.toFixed(1)} kg</div>
                    <div className="text-sm text-red-700">CO₂ per month</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <TrendingDown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{results.totalYearly.toFixed(0)} kg</div>
                    <div className="text-sm text-orange-700">CO₂ per year</div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Monthly Breakdown:</h3>
                  
                  {results.transport > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Transport</span>
                      </div>
                      <span className="font-semibold">{results.transport.toFixed(1)} kg CO₂</span>
                    </div>
                  )}
                  
                  {results.energy > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Home Energy</span>
                      </div>
                      <span className="font-semibold">{results.energy.toFixed(1)} kg CO₂</span>
                    </div>
                  )}
                  
                  {results.waste > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Waste</span>
                      </div>
                      <span className="font-semibold">{results.waste.toFixed(1)} kg CO₂</span>
                    </div>
                  )}
                </div>

                {/* Environmental Context */}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TreePine className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-800">Environmental Impact</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    Your yearly emissions equal {results.treesEquivalent.toFixed(1)} trees worth of CO₂ absorption.
                  </p>
                </div>

                {/* Potential Savings */}
                {results.potentialSavings > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Potential Monthly Savings</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      You could save {results.potentialSavings.toFixed(1)} kg CO₂ per month by switching to greener alternatives!
                    </p>
                  </div>
                )}

                {/* Action Button */}
                {user ? (
                  <button
                    onClick={generateDetailedReport}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                  >
                    <Award className="h-4 w-4" />
                    <span>Get Detailed Report</span>
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Sign in to save your results and track improvements</p>
                    <Link
                      to="/auth"
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Calculate</h3>
                <p className="text-gray-600">Fill in the form and click "Calculate My Impact" to see your carbon footprint</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculator;
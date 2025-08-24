import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedSpaces from './components/FeaturedSpaces';
import InteractiveMap from './components/InteractiveMap';
import SustainabilityTips from './components/SustainabilityTips';
import CommunityEvents from './components/CommunityEvents';
import CarbonFootprint from './components/CarbonFootprint';
import Footer from './components/Footer';
import GreenSpacesDirectory from './components/GreenSpacesDirectory';
import VictoriaGreenSpacesDirectory from './components/VictoriaGreenSpacesDirectory';
import CommunityDashboard from './components/CommunityDashboard';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import AddActivityPage from './components/AddActivityPage';
import InteractiveSustainabilityTips from './components/InteractiveSustainabilityTips';
import ImpactDashboard from './components/ImpactDashboard';
import CarbonCalculator from './components/CarbonCalculator';
import EventsPage from './components/EventsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <FeaturedSpaces />
              <InteractiveMap />
              <SustainabilityTips />
              <CommunityEvents />
              <CarbonFootprint />
            </>
          } />
          <Route path="/directory" element={<GreenSpacesDirectory />} />
          <Route path="/victoria-directory" element={<VictoriaGreenSpacesDirectory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<CommunityDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/add-activity" element={<AddActivityPage />} />
          <Route path="/tips" element={<InteractiveSustainabilityTips />} />
          <Route path="/activities" element={<Dashboard />} />
          <Route path="/calculator" element={<CarbonCalculator />} />
          <Route path="/impact" element={<ImpactDashboard />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
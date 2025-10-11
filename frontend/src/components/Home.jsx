// MainContent.jsx (or Home.jsx)

import React from 'react';
// Assuming these paths are correct relative to this file
import Recycling from '../assets/Recycling.png'; 
import RegularWaste from '../assets/RegularWaste.png';
import SpecialPickup from '../assets/SpecialPickup.png';
import GarbageTruck from '../assets/GarbageTruck.png';
import { NavLink } from 'react-router-dom'; 

// --- UPDATED ServiceCard COMPONENT ---
const ServiceCard = ({ title, description, imageUrl, imageAlt, linkTo }) => (
  // The anchor tag wraps the entire card.
  // We use group utility for hover effects on nested elements.
  // Added: transition-all duration-300, hover:shadow-xl, hover:scale-[1.02] for smooth button-like interaction.
  <a 
    href={linkTo} 
    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full 
               transition-all duration-300 hover:shadow-xl hover:scale-[1.02] 
               cursor-pointer transform focus:outline-none focus:ring-4 focus:ring-blue-300"
    aria-label={`Maps to ${title} page`}
  >
    {/* Image/Visual Area */}
    <div className="h-56">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Text Content */}
    <div className="p-5 flex-grow">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </a>
);

// --- Home COMPONENT ---
const Home = () => {
  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
      {/* Header/Welcome Section */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Hello, Alex!</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your EcoCollect dashboard. Manage your waste services efficiently.
        </p>
      </header>

      {/* Services Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="Schedule Special Pickup"
            description="Request pickup for large or hazardous items."
            imageUrl={SpecialPickup}
            imageAlt="Jar with plant for special waste item"
            linkTo="/SpecialPickup" // Added navigation link
          />
          <ServiceCard
            title="Manage Regular Waste"
            description="Adjust your weekly waste collection schedule."
            imageUrl={RegularWaste}
            imageAlt="Green outdoor trash bin"
            linkTo="/services/regular-waste" // Added navigation link
          />
          <ServiceCard
            title="View Recycling Options"
            description="Explore recycling programs and guidelines."
            imageUrl={Recycling}
            imageAlt="Recycling logo in a green square"
            linkTo="/services/recycling" // Added navigation link
          />
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="flex justify-between items-start">
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Last Pickup Scheduled</h3>
          <p className="text-gray-500">
            Your special waste pickup for electronics is scheduled for **July 15th**.
          </p>
        </div>
        
        {/* Truck Image */}
        <div className="w-80 ml-6 rounded-xl overflow-hidden shadow-lg">
          <img
            src={GarbageTruck}
            alt="Green garbage truck"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;
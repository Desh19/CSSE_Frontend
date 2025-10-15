import React from 'react';
// NOTE: Assuming image imports are managed correctly in your local environment.
// For the sandbox environment, these will likely fail, but the structure is correct.
import Recycling from '../assets/Recycling.png'; 
import RegularWaste from '../assets/RegularWaste.png';
import SpecialPickup from '../assets/SpecialPickup.png';
import GarbageTruck from '../assets/GarbageTruck.png';

// // Placeholder Images (since real asset paths won't load in this environment)
// const Recycling = 'https://placehold.co/400x300/6b7280/ffffff?text=Recycling';
// const RegularWaste = 'https://placehold.co/400x300/4f46e5/ffffff?text=Regular+Waste';
// const SpecialPickup = 'https://placehold.co/400x300/10b981/ffffff?text=Special+Pickup';
// const GarbageTruck = 'https://placehold.co/300x200/ef4444/ffffff?text=Garbage+Truck';

// --- Utility for Navigation ---
// Function to simulate navigation (used instead of useNavigate)
const simulateNavigation = (path) => {
    console.log(`Simulating navigation/redirect to: ${path}`);
    if (typeof window !== 'undefined') {
        window.location.assign(path);
    }
};

// --- UPDATED ServiceCard COMPONENT ---
const ServiceCard = ({ title, description, imageUrl, imageAlt, linkTo }) => (
  <a 
    href={linkTo} 
    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full 
               transition-all duration-300 hover:shadow-xl hover:scale-[1.02] 
               cursor-pointer transform focus:outline-none focus:ring-4 focus:ring-indigo-300"
    aria-label={`Maps to ${title} page`}
    // Use target="_self" to ensure navigation happens in the same window/frame
    target="_self"
  >
    {/* Image/Visual Area */}
    <div className="h-48">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-full object-cover"
        // Fallback for image loading failure
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/6b7280/ffffff?text=Asset+Error'; }}
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
  // Try to retrieve user data for a personalized greeting
  const userString = localStorage.getItem('user');
  let userName = 'User';
  try {
    const userData = userString ? JSON.parse(userString) : {};
    userName = userData.name || 'Resident';
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  // --- LOGOUT FUNCTIONALITY ---
  const handleLogout = () => {
    // 1. Clear Local Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Clear Session Storage as well (good practice)
    sessionStorage.clear(); 

    // Optional: Show a message before redirecting
    if (typeof window.swal === 'function') {
        window.swal("Success", "You have been successfully logged out.", "info").then(() => {
            // 3. Navigate to the root path
            simulateNavigation('/'); 
        });
    } else {
        // Fallback navigation
        simulateNavigation('/');
    }
  };


  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      
      {/* Header/Welcome Section with Logout Button */}
      <header className="mb-10 flex justify-between items-start border-b pb-4">
        <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Hello, {userName}!</h1>
            <p className="text-gray-500 mt-1">
            Welcome to your EcoCollect dashboard. Manage your waste services efficiently.
            </p>
        </div>
        
        {/* Logout Button */}
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner">
    
    <button
        onClick={() => simulateNavigation('/genQr')}
        class="flex items-center justify-center space-x-3 px-6 py-3 
               bg-blue-600 text-white font-semibold text-lg 
               rounded-lg shadow-xl hover:bg-blue-700 
               transform hover:scale-105 transition duration-300 ease-in-out 
               focus:outline-none focus:ring-4 focus:ring-blue-300 
               group"
        aria-label="Get my personalized QR code"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4m12 0a4 4 0 11-8 0 4 4 0 018 0zM7 7h1v1H7V7zm3 0h1v1h-1V7zM7 10h1v1H7v-1zm3 0h1v1h-1v-1zm-3 3h1v1H7v-1zm3 3h1v1h-1v-1zm-3 3h1v1H7v-1zm3 0h1v1h-1v-1zm-3 3h1v1H7v-1zm3 0h1v1h-1v-1z" />
        </svg>

        <span>Get My QR</span>
    </button>

    <button
        onClick={handleLogout}
        class="flex items-center justify-center space-x-3 px-6 py-3 
               bg-red-600 text-white font-semibold text-lg 
               rounded-lg shadow-xl hover:bg-red-700 
               transform hover:scale-105 transition duration-300 ease-in-out 
               focus:outline-none focus:ring-4 focus:ring-red-300 
               group"
        aria-label="Logout and clear session"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>

        <span>Logout</span>
    </button>
</div>
      </header>

      {/* Services Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Service Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            title="Schedule Special Pickup"
            description="Request pickup for large or hazardous items. Requires scheduling."
            imageUrl={SpecialPickup}
            imageAlt="Special Waste Item"
            linkTo="/SpecialPickup" 
          />
          <ServiceCard
            title="Manage Regular Waste"
            description="View your current weekly collection schedule and history."
            imageUrl={RegularWaste}
            imageAlt="Green outdoor trash bin"
            linkTo="/services/regular-waste" 
          />
          <ServiceCard
            title="View Recycling Options"
            description="Explore local recycling programs, drop-off locations, and guidelines."
            imageUrl={Recycling}
            imageAlt="Recycling logo"
            linkTo="/services/recycling" 
          />
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="flex flex-col md:flex-row justify-between items-start bg-white p-6 rounded-xl shadow-lg">
        <div className="flex-grow md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Last Pickup Scheduled</h3>
          <p className="text-gray-500 mb-4">
            Your special waste pickup for electronics is scheduled for **July 15th, 2025**.
          </p>
          <a
            href="/ActivityHistory"
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            View Full History
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {/* Truck Image */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0 ml-0 md:ml-6 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-100">
          <img
            src={GarbageTruck}
            alt="Green garbage truck illustration"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;

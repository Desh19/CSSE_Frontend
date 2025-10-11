// Sidebar.jsx

import React from 'react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: '🏠' }, // Replace with actual icon components like 'lucide-home'
    { name: 'Services', icon: '🗂️' }, // Replace with actual icon components
    { name: 'Requests', icon: '📝' }, // Replace with actual icon components
    { name: 'Billing', icon: '💵' }, // Replace with actual icon components
    { name: 'Settings', icon: '⚙️' }, // Replace with actual icon components
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen p-4">
      {/* Logo */}
      <div className="flex items-center mb-8">
        {/* Placeholder for the small green EcoCollect icon */}
        <div className="w-8 h-8 bg-green-200 rounded-full mr-2 flex items-center justify-center text-green-700 font-bold">
          E
        </div>
        <span className="text-lg font-semibold text-gray-800">EcoCollect</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a
                href={`#${item.name.toLowerCase()}`}
                className={`flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors
                  ${item.name === 'Dashboard' ? 'bg-gray-100 font-medium text-gray-800' : ''}` // Highlight Dashboard
                }
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Action Button and Support */}
      <div className="mt-auto">
        <button className="w-full py-3 px-4 mb-4 bg-blue-700 text-white font-medium rounded-lg shadow-md hover:bg-blue-800 transition-colors">
          New Request
        </button>
        <div className="flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
          <span className="mr-2 text-lg">❓</span>
          <span>Help and Support</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
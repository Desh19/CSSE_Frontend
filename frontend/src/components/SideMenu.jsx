import React from 'react';
// 💡 Import NavLink for navigation and automatic active state styling
import { NavLink } from 'react-router-dom'; 

// NOTE: When using React Router DOM, you no longer need the activeModule and setActiveModule props 
// on the Sidebar component, as NavLink handles the active state based on the URL.
const Sidebar = () => { 
  const navItems = [
    // Map module names to their corresponding URL paths
    { name: 'Dashboard', icon: '🏠', path: '/' }, // Root path for Dashboard/Home
    { name: 'Services', icon: '🗂️', path: '/Sidebar' },
    { name: 'Requests', icon: '📝', path: '/requests' },
    { name: 'Billing', icon: '💵', path: '/billing' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen p-4">
      {/* Logo */}
      <div className="flex items-center mb-8">
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
              <NavLink
                to={item.path}
                // NavLink uses a function for className to apply different styles 
                // based on the 'isActive' state provided by the router.
                className={({ isActive }) => 
                  `flex items-center w-full text-left p-3 rounded-lg transition-colors cursor-pointer 
                   ${isActive 
                     // Active state: light grey (bg-gray-100) and dark text 
                     ? 'bg-gray-100 text-gray-800 font-medium' 
                     // Inactive state: default text color, light grey on hover
                     : 'text-gray-600 hover:bg-gray-100'
                   }
                   ${item.name === 'Dashboard' ? 'active-exact' : ''}
                  `
                }
                // The 'end' prop ensures only the exact path '/' activates the Dashboard link, 
                // preventing it from being active on all sub-routes.
                end={item.name === 'Dashboard'}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Action Button and Support */}
      <div className="mt-auto">
        {/* If 'New Request' should navigate to a route, use <Link> or <NavLink> here */}
        <button className="w-full py-3 px-4 mb-4 bg-blue-700 text-white font-medium rounded-lg shadow-md hover:bg-blue-800 transition-colors cursor-pointer">
          New Request
        </button>
        {/* Help and Support (assumed to be a non-router click/link) */}
        <div className="flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
          <span className="mr-2 text-lg">❓</span>
          <span>Help and Support</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
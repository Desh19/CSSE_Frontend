import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './components/Home'
import Sidebar from './components/SideMenu'
import SpecialPickup from './components/SheduleSpecialPickup';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="flex h-screen antialiased bg-gray-50">
    <Sidebar />
    <Routes>
      <Route path="*" element={<Home />} /> 
      <Route path="/" element={<Home />} />
      <Route path="/Sidebar" element={<Sidebar />} />
      <Route path="/SpecialPickup" element={<SpecialPickup />} />
    </Routes>
    </div>
    </>
  )
}

export default App

// App.jsx
// import { useState } from 'react';
// import './App.css';
// import Home from './components/Home';

// import Sidebar from './components/SideMenu'; // Note: Your file name is SideMenu

// // Placeholder components for other pages
// const ServicesPage = () => <div className="p-8 text-2xl font-bold">Services Page Content</div>;
// const RequestsPage = () => <div className="p-8 text-2xl font-bold">Requests Page Content</div>;
// const BillingPage = () => <div className="p-8 text-2xl font-bold">Billing Page Content</div>;
// const SettingsPage = () => <div className="p-8 text-2xl font-bold">Settings Page Content</div>;


// function App() {
//   // Use state to track the currently active module. 
//   // 'Dashboard' corresponds to the Home component.
//   const [activeModule, setActiveModule] = useState('Dashboard'); 

//   // Function to render the correct component based on the activeModule state
//   const renderModule = () => {
//     switch (activeModule) {
//       case 'Dashboard':
//         return <Home />;
//       case 'Services':
//         return <ServicesPage />; // Use a placeholder component
//       case 'Requests':
//         return <RequestsPage />; // Use a placeholder component
//       case 'Billing':
//         return <BillingPage />;
//       case 'Settings':
//         return <SettingsPage />;
//       default:
//         return <Home />;
//     }
//   };

//   return (
//     <>
//       <div className="flex h-screen antialiased bg-gray-50">
//         {/* Pass the activeModule state and the setter function to Sidebar */}
//         <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        
//         {/* The right-side body area where the selected module is rendered */}
//         {renderModule()}
//       </div>
//     </>
//   );
// }

// export default App;

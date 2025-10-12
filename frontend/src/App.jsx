import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'; // 💡 Import useLocation
import './App.css'
import Home from './components/Home'
import Sidebar from './components/SideMenu'
import SpecialPickup from './components/SheduleSpecialPickup';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUp';
import SignInPage from './components/SignIn';
import PickupRequestList from './components/PickupRequestList';
import RequestApproval from './components/RequestApproval';
import CrewMemberAssignedList from './components/CrewMemberAssignedList';

function App() {
  // Get the current URL location object
  const location = useLocation();
  // Check if the current path is the root path (Landing Page)
  const isLandingPage = location.pathname === '/';
  const isSignUpPage = location.pathname === '/SignUp';
  const isSignInPage = location.pathname === '/SignIn';

  // The main wrapper dynamically changes its class:
  // - If it's the landing page, it takes up the full screen (w-screen h-screen).
  // - Otherwise, it sets up the flexible sidebar layout (flex h-screen ...).
  return (
    <div className={(isLandingPage||isSignUpPage||isSignInPage) ? 'w-screen h-screen' : 'flex h-screen antialiased bg-gray-50'}>
      
      {/* 1. Conditionally Render Sidebar: Only show if it's NOT the landing page */}
      {!isLandingPage && !isSignUpPage && !isSignInPage && <Sidebar />}
      
      {/* 2. Main Content Area: Adjusts based on whether the sidebar is visible. */}
      {/* When the sidebar is visible, content must take the rest of the flex space (flex-1). */}
      {/* When hidden, content must take the full parent space (w-full h-full). */}
      <div className={(isLandingPage||isSignUpPage||isSignInPage) ? 'w-full h-full' : 'flex-1 overflow-auto'}>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/SignIn" element={<SignInPage />} />
          
          {/* App Routes (Will be rendered inside the sidebar layout) */}
          <Route path="/Home" element={<Home />} />
          <Route path="/SpecialPickup" element={<SpecialPickup />} />
          <Route path="/PickupRequestList" element={<PickupRequestList />} />
          <Route path="/RequestApproval" element={<RequestApproval />} />
          <Route path="/CrewMemberAssignedList" element={<CrewMemberAssignedList />} />
          {/* Note: /Sidebar route is unusual for a main content view, but kept as per original */}
          <Route path="/Sidebar" element={<Sidebar />} />
          {/* Catch-all route */}
          <Route path="*" element={<Home />} /> 
        </Routes>
      </div>
    </div>
  )
}

export default App

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { X, AlertTriangle, CheckCircle, Lock } from 'lucide-react'; 

// Component Imports - FIX: Added .jsx extension to all local imports
import Home from './components/Home.jsx';
import Sidebar from './components/SideMenu.jsx';
import SpecialPickup from './components/SheduleSpecialPickup.jsx';
import LandingPage from './components/LandingPage.jsx';
import SignUpPage from './components/SignUp.jsx';
import SignInPage from './components/SignIn.jsx';
import PickupRequestList from './components/PickupRequestList.jsx';
import RequestApproval from './components/RequestApproval.jsx';
import CrewMemberAssignedList from './components/CrewMemberAssignedList.jsx';
import QrScanner from './components/QrScanner.jsx';
import UserQRCode from './components/UserQRCode.jsx';
import SchedulePickup from './components/SchedulePickup.jsx';

// --- Auth Helper Functions ---
const getAuthData = () => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  let user = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      console.error("Failed to parse user data:", e);
    }
  }
  return { token, user };
};

// --- Notification Component for UX-Friendly Messages ---
const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Auto-hide the notification after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for transition to finish before calling onClose
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  let classes = "p-4 rounded-xl shadow-2xl fixed top-4 right-4 z-[100] transition-all duration-300 transform ease-out flex items-center gap-3";
  let icon = null;

  switch (type) {
    case 'error':
      classes += " bg-red-600 text-white";
      icon = <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
      break;
    case 'warning':
      classes += " bg-yellow-600 text-white";
      icon = <Lock className="w-5 h-5 flex-shrink-0" />;
      break;
    default:
      classes += " bg-green-600 text-white";
      icon = <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      break;
  }

  // Adjust visibility based on state
  const visibilityClass = isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';

  return (
    <div className={`${classes} ${visibilityClass}`}>
      {icon}
      <span className="font-medium text-sm">{message}</span>
      <button 
        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} 
        className="ml-2 -mr-1 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};


function App() {
  const location = useLocation();
  // State for global notifications
  const [notification, setNotification] = useState(null); 

  // Check if the current path should have the layout hidden
  const isLandingPage = location.pathname === '/';
  const isSignUpPage = location.pathname === '/SignUp';
  const isSignInPage = location.pathname === '/SignIn';

  // Function to clear the notification
  const clearNotification = () => setNotification(null);

  // --- Protected Route Component ---
  // Defined inside App to easily access setNotification state setter
  const ProtectedRoute = ({ allowedRoles, children }) => {
    const { token, user } = getAuthData();
    const isAuth = !!token;
    const userRole = user?.role;

    if (!isAuth) {
      // Not logged in: Redirect to Sign In
      setNotification({ message: "You must be signed in to access this page.", type: "error" });
      return <Navigate to="/SignIn" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Logged in, but unauthorized role: Redirect to Home with warning
      setNotification({ 
        message: `Access denied. Your role (${userRole || 'N/A'}) is not authorized for this page.`, 
        type: "warning" 
      });
      return <Navigate to="/Home" replace />; 
    }

    return children;
  };


  return (
    <div className={(isLandingPage || isSignUpPage || isSignInPage) ? 'w-screen h-screen' : 'flex h-screen antialiased bg-gray-50'}>
      
      {/* Global Notification */}
      <Notification 
        message={notification?.message} 
        type={notification?.type} 
        onClose={clearNotification}
      />

      {/* 1. Conditionally Render Sidebar */}
      {!isLandingPage && !isSignUpPage && !isSignInPage && <Sidebar />}
      
      {/* 2. Main Content Area */}
      <div className={(isLandingPage || isSignUpPage || isSignInPage) ? 'w-full h-full' : 'flex-1 overflow-auto'}>
        <Routes>
          {/* Public Routes - Accessible to anyone */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/SignIn" element={<SignInPage />} />
          <Route path="/Sidebar" element={<Sidebar />} />
          {/* <Route path="/Home" element={<Home />} /> */}
          <Route path="/SpecialPickup" element={<SpecialPickup />} />
          
          {/* ---------------------------------------------------- */}
          {/* Protected Routes (Role-Based Access Control) */}
          {/* ---------------------------------------------------- */}

          {/* Resident Routes (role: Resident) */}
          <Route path="/PickupRequestList" element={
            <ProtectedRoute allowedRoles={["Resident"]}>
              <PickupRequestList />
            </ProtectedRoute>
          } />
          {/* <Route path="/Home" element={
            <ProtectedRoute allowedRoles={["Resident"]}>
             <Home />
            </ProtectedRoute>
          } /> */}
          <Route path="/genQr" element={
            <ProtectedRoute allowedRoles={["Resident"]}>
              <UserQRCode />
            </ProtectedRoute>
          } />
          <Route path="/shedulePickup" element={
            <ProtectedRoute allowedRoles={["Resident"]}>
              <SchedulePickup />
            </ProtectedRoute>
          } />

          {/* Admin Routes (role: Administrator) */}
          <Route path="/RequestApproval" element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <RequestApproval />
            </ProtectedRoute>
          } />

          {/* Crew Member Routes (role: CollectionCrewMember) */}
          <Route path="/CrewMemberAssignedList" element={
            <ProtectedRoute allowedRoles={["CollectionCrewMember"]}>
              <CrewMemberAssignedList />
            </ProtectedRoute>
          } />
          <Route path="/qr" element={
            <ProtectedRoute allowedRoles={["CollectionCrewMember"]}>
              <QrScanner />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route for any undefined path */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;

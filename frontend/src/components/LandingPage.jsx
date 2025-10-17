import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPageBackground from '../assets/LandingPageBackground.png';

const AnimatedTitle = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return (
    <h1 className="text-6xl md:text-8xl font-extrabold text-white text-center">
      {displayedText}
      <span className="animate-pulse inline-block w-2 h-16 md:w-4 md:h-20 bg-green-400 ml-1 align-middle"></span>
    </h1>
  );
};


const LandingPage = () => {
  const navigate = useNavigate();
  
  const mainTitle = "Smart Waste Management System.";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        // 💡 Using the imported asset path
        style={{ backgroundImage: `url(${LandingPageBackground})` }}
      >
        {/* Dark overlay for better text contrast AND the blur effect */}
        <div className="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm"></div>
      </div>

      {/* Header/Navbar - FIX: Increased Z-INDEX to ensure buttons are clickable */}
      <header className="relative z-50 flex justify-between items-center p-6 md:p-10">
        {/* Logo/System Name */}
        <div className="flex items-center text-white text-2xl font-bold">
          <span className="text-green-400 mr-2">♻️</span>
          EcoWaste
        </div>

        <nav className="space-x-4">
          <button 
            onClick={() => navigate('/SignIn')}
            style={{ cursor: 'pointer' }}
            className="px-4 py-2 text-white font-medium rounded-lg transition-colors border border-transparent hover:border-white"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/SignUp')}
            style={{ cursor: 'pointer' }}
            className="px-4 py-2 bg-green-500 text-gray-900 font-bold rounded-lg shadow-md hover:bg-green-400 transition-colors"
          >
            Sign Up
          </button>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center h-full -mt-20">
        <div className="p-4">
          <AnimatedTitle text={mainTitle} />
          
          <p className="text-xl md:text-2xl text-green-300 font-light mt-8 text-center max-w-2xl mx-auto">
            Innovating resource management for a greener tomorrow.
          </p>
          
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
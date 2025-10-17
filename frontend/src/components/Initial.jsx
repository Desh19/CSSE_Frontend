import React from 'react';
import { Leaf, Truck, Users, MapPin, Mail, Phone, Clock } from 'lucide-react';

// --- Helper Components for UI Consistency ---

const IconCard = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100">
        <div className="p-3 mb-4 rounded-full bg-indigo-100 text-indigo-600">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

// --- MAIN COMPONENT ---

const EcoCollectLandingPage = () => {
    // Content data structured for easy modification
    const mission = {
        aim: "To simplify and revolutionize the collection of specialized and bulk waste, making communities cleaner and greener.",
        description: "EcoCollect connects residents needing pickup services (like bulk trash or HAZMAT) directly with dedicated collection crews. We streamline scheduling, assignment, and tracking through a digital platform, ensuring efficient, documented, and timely environmental service delivery.",
    };

    const coreServices = [
        {
            icon: Users,
            title: "Resident Request Platform",
            description: "Easily submit and schedule specialized or bulk pickup requests right from your home, with location pinpointing for accuracy.",
        },
        {
            icon: Leaf,
            title: "Efficient Crew Routing",
            description: "Assigned collection crews receive optimized routes and real-time request updates directly to their devices for maximum efficiency.",
        },
        {
            icon: Clock,
            title: "Real-time Status Tracking",
            description: "Residents can track their request status from PENDING to COMPLETED, maintaining full transparency and accountability.",
        },
        {
            icon: Truck,
            title: "QR Code Verification",
            description: "Crews use QR scanning technology to verify successful collection, ensuring every job is accurately logged and fulfilled.",
        },
    ];

    const benefits = [
        "Eliminate unauthorized dumping and clutter in neighborhoods.",
        "Increase compliance with environmental disposal regulations.",
        "Provide a convenient, user-friendly service for residents.",
        "Improve operational efficiency and response times for collection teams.",
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* 1. Header/Navigation */}
            <nav className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Leaf className="h-8 w-8 text-indigo-600" />
                        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            EcoCollect
                        </span>
                    </div>
                    {/* Mock Navigation Links */}
                    <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
                        <a href="#mission" className="hover:text-indigo-600 transition">Mission</a>
                        <a href="#services" className="hover:text-indigo-600 transition">Services</a>
                        <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="bg-gradient-to-br from-indigo-500 to-indigo-700 py-20 md:py-32 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
                        Sustainable Waste Collection, Simplified. 
                    </h1>
                    <p className="text-xl sm:text-2xl font-light mb-8 max-w-3xl mx-auto opacity-90">
                        Connecting residents and crews for efficient, modern, and green waste management.
                    </p>
                    <button className="bg-green-400 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-green-300 transition duration-300 transform hover:scale-105">
                        Get Started Today
                    </button>
                </div>
            </section>

            {/* --- */}
            
            {/* 3. Mission & Aim Section */}
            <section id="mission" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">
                            Our Purpose
                        </h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Driving the Future of Eco-Friendly Collection
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-indigo-50 p-8 md:p-12 rounded-2xl shadow-inner border-t-4 border-indigo-600">
                        <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                            EcoCollect Mission Statement
                        </h3>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            <Leaf className="inline h-6 w-6 mr-2 text-green-600 -mt-1" />
                            **Aim:** {mission.aim}
                        </p>
                        <p className="mt-4 text-gray-700">
                            **What We Are Doing:** {mission.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* --- */}

            {/* 4. How It Works / Core Services Section */}
            <section id="services" className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base font-semibold text-green-600 uppercase tracking-wide">
                            The Platform
                        </h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Seamless Digital Waste Management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreServices.map((service, index) => (
                            <IconCard 
                                key={index} 
                                icon={service.icon} 
                                title={service.title} 
                                description={service.description} 
                            />
                        ))}
                    </div>

                    {/* How It Helps / Benefits Grid */}
                    <div className="mt-16 pt-12 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Our Impact on the Community
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-green-200">
                                    <Leaf className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            
            {/* --- */}

            {/* 5. Contact Section */}
            <section id="contact" className="py-16 md:py-24 bg-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">
                            Let's Connect
                        </h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Get in Touch with the EcoCollect Team
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Contact Info (Column 1) */}
                        <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg h-full">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Contact Details</h3>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-6 w-6 text-indigo-600" />
                                <span className="text-gray-700">support@ecocollect.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-6 w-6 text-indigo-600" />
                                <span className="text-gray-700">(+123) 456-7890</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">101 Green Avenue, Sustainable City, 90210</span>
                            </div>
                        </div>

                        {/* Mock Contact Form (Columns 2 & 3) */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
                                    Send Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} EcoCollect. All rights reserved. | Built for a Greener Tomorrow.</p>
                </div>
            </footer>
        </div>
    );
};

export default EcoCollectLandingPage;

import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

// --- API Endpoints based on your authRoutes.js ---
const RESIDENT_API = '/api/auth/register'; 
const CREW_API = '/api/auth/register-crew'; 

// Reusable Input Field Component
const FormInput = ({ label, type = 'text', name, required = true, isVisible = true, placeholder, value, onChange }) => {
    if (!isVisible) return null;
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition duration-150"
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder || label}
            />
        </div>
    );
};


// --- MAIN SIGN UP COMPONENT ---
const SignUpFormContent = () => {
    // State for the selected role: 'Resident' or 'CollectionCrewMember'
    const [role, setRole] = useState('Resident'); 
    const navigate = useNavigate();

    // Combined state for all possible form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '', // Shared Required field (District/City equivalent)
        employeeId: '', // Crew specific
        contactNumber: '', // Crew specific (Note: This was required in your initial code, making it required here)
        vehicle: '', // Crew specific (optional)
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Clear role-specific fields when the role changes to prevent sending old data
    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setFormData(prevData => ({
            ...prevData,
            employeeId: '',
            contactNumber: '',
            vehicle: '',
        }));
        setError('');
        setMessage('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            let endpoint = '';
            let payload = {};
            
            // Basic Client-side Validation for required fields
            if (!formData.name || !formData.email || !formData.password || !formData.address) {
                throw new Error('Please fill out all mandatory fields: Name, Email, Password, and Address.');
            }

            // 1. Determine API Endpoint and Build Payload based on the current role
            if (role === 'Resident') {
                endpoint = RESIDENT_API;
                payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    address: formData.address,
                };
            } else if (role === 'CollectionCrewMember') {
                endpoint = CREW_API;
                
                // Crew-specific validation
                if (!formData.employeeId || !formData.contactNumber) {
                    throw new Error('Employee ID and Contact Number are required for Crew Member registration.');
                }

                payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    address: formData.address,
                    employeeId: formData.employeeId, 
                    contactNumber: formData.contactNumber,
                    vehicle: formData.vehicle || undefined, // Send if present, or omit if empty
                };
            } else {
                throw new Error('Invalid role selected.');
            }

            // 2. Send API Request
            // NOTE: In a real environment, you might need to handle CORS or authentication headers
            const { data } = await axios.post(endpoint, payload);

            // Use swal (SweetAlert) for success message as requested
            if (typeof window.swal === 'function') {
                 window.swal({
                    title: "Registration Successful!",
                    text: `Welcome ${data.name}! You are registered as a ${role}.`,
                    icon: "success",
                    button: "Proceed to Login",
                }).then(() => {
                    // Navigate to /signin page path
                    navigate('signin'); 
                });
            } else {
                // Fallback message
                setMessage(`${role} registration successful! Welcome, ${data.name}. You can now log in.`);
                navigate('signin');
            }
            
            // Clear all fields after successful submission
            setFormData({
                name: '', email: '', password: '', address: '', employeeId: '', contactNumber: '', vehicle: ''
            });
            
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(errMsg);
            // Use swal for error message as requested
            if (typeof window.swal === 'function') {
                window.swal("Registration Failed", errMsg, "error");
            }

        } finally {
            setLoading(false);
        }
    };


    // --- Render Component ---
    return (
        // Added flex flex-col to enable scrolling for content area and fixed footer
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl h-full flex flex-col">
            <div className="p-8 pb-0">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                    Sign Up
                </h2>

                {/* Role Selection Tabs */}
                <div className="flex justify-center mb-6 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => handleRoleChange('Resident')}
                        className={`px-6 py-2 text-lg font-medium transition duration-300 ${
                            role === 'Resident'
                                ? 'border-b-4 border-green-600 text-green-600'
                                : 'text-gray-500 hover:text-green-600'
                        }`}
                        style={{ cursor: 'pointer' }}
                    >
                        Resident
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleChange('CollectionCrewMember')}
                        className={`px-6 py-2 text-lg font-medium transition duration-300 ${
                            role === 'CollectionCrewMember'
                                ? 'border-b-4 border-green-600 text-green-600'
                                : 'text-gray-500 hover:text-green-600'
                        }`}
                        style={{ cursor: 'pointer' }}
                    >
                        Crew Member
                    </button>
                </div>
            </div>

            {/* Status Messages (outside of form for consistent layout) */}
            {(error || message) && (
                <div className="px-8 pt-0 pb-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                            {message}
                        </div>
                    )}
                </div>
            )}


            {/* Dynamic Form Content (Scrollable Area) */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto px-8">
                
                {/* 1. Base Fields (Required for ALL Users) - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                    <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                    <FormInput 
                        label="Address (District/City)" 
                        name="address"
                        value={formData.address} 
                        onChange={handleChange}
                        required={true} 
                        placeholder="e.g., Kandy District, Central Province"
                    />
                </div>
                
                {/* 2. Conditional Crew Fields - Single Column Layout */}
                {role === 'CollectionCrewMember' && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 border-t pt-4 border-gray-200">
                        <FormInput 
                            label="Employee ID" 
                            name="employeeId" 
                            value={formData.employeeId} 
                            onChange={handleChange}
                            required={true} 
                            placeholder="e.g., EID-0042"
                        />
                        <FormInput 
                            label="Contact Number" 
                            name="contactNumber" 
                            value={formData.contactNumber} 
                            onChange={handleChange}
                            required={true} // Marked as required based on your original logic
                            placeholder="e.g., 07x xxx xxxx"
                        />
                        <div className="col-span-full">
                            <FormInput 
                                label="Vehicle / Truck Number (Optional)" 
                                name="vehicle" 
                                value={formData.vehicle} 
                                onChange={handleChange}
                                required={false} 
                                placeholder="Assigned Truck ID"
                            />
                        </div>
                    </div>
                )}
                {/* Add padding at the bottom for aesthetic spacing before the fixed footer */}
                <div className="h-4"></div>
            </form>
            
            {/* 3. Action Buttons (Fixed Footer Area) */}
            {/* This div is outside the scrollable form and sits at the bottom of the flex container */}
            <div className="px-8 pt-4 pb-8 bg-white border-t border-gray-100">
                <div className="flex justify-between items-center">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        disabled={loading}
                        className={`px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ cursor: 'pointer' }}
                    >
                        Back
                    </button>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 rounded-lg text-white font-bold shadow-md transition duration-300 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50'
                        }`}
                        style={{ cursor: 'pointer' }}
                    >
                        {loading ? 'Processing...' : `Register as ${role}`}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- WRAPPER COMPONENT FOR FULL-SCREEN LAYOUT AND NAVIGATION ---
export default function SignUpPage() {
    // Function to load SweetAlert dynamically
    const loadSweetAlert = () => {
        if (typeof window.swal === 'undefined' && !document.querySelector('#sweetalert-cdn')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/sweetalert/dist/sweetalert.min.js';
            script.id = 'sweetalert-cdn';
            document.body.appendChild(script);
        }
    };

    React.useEffect(() => {
        loadSweetAlert();
    }, []);

    // 1. Updated Navigation Logic: Navigates to the specified path/route
    const navigate = (path) => {
        const url = `/${path}`;
        console.log(`Simulating navigation to external path: ${url}`);
        
        // This simulates a full page redirect to the specified route
        if (typeof window !== 'undefined') {
            window.location.assign(url);
        }
    };

    // Full-screen container with fixed height requirement applied (h-screen and h-[90vh] on content)
    return (
        <div className="min-h-screen h-screen bg-gray-100 flex items-center justify-center p-4">
            <SignUpFormContent navigate={navigate} />
        </div>
    );
}

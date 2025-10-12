import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

// --- API Endpoint Placeholder ---
const LOGIN_API = '/api/auth/login'; 

// Reusable Input Field Component (Copied from SignUpPage for consistent styling)
const FormInput = ({ label, type = 'text', name, required = true, placeholder, value, onChange }) => {
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


// --- MAIN SIGN IN COMPONENT ---
const SignInFormContent = () => {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission (Sign In)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Basic Client-side Validation
            if (!formData.email || !formData.password) {
                throw new Error('Please enter both email and password.');
            }

            // 1. Send API Request
            const payload = {
                email: formData.email,
                password: formData.password,
            };
            
            // NOTE: In a real app, successful login usually returns a JWT token or user data.
            const { data } = await axios.post(LOGIN_API, payload);

            // Use swal (SweetAlert) for success message
            if (typeof window.swal === 'function') {
                 window.swal({
                    title: "Login Successful!",
                    text: `Welcome back! Navigating to dashboard...`,
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    // Navigate to a protected dashboard or home page
                    navigate('/Home'); 
                });
            } else {
                setMessage(`Login successful! Welcome back, ${data.name || 'User'}.`);
                navigate('/Home');
            }
            
            // Clear fields after successful submission
            setFormData({ email: '', password: '' });
            
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
            setError(errMsg);
            // Use swal for error message
            if (typeof window.swal === 'function') {
                window.swal("Login Failed", errMsg, "error");
            }

        } finally {
            setLoading(false);
        }
    };


    // --- Render Component ---
    return (
        // Added flex flex-col to enable fixed footer layout
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl h-full flex flex-col">
            <div className="p-8 pb-0">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                    Sign In
                </h2>
            </div>

            {/* Status Messages */}
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
                
                {/* Email and Password Fields */}
                <div className="grid grid-cols-1 gap-x-4">
                    <FormInput 
                        label="Email Address" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email"
                    />
                    <FormInput 
                        label="Password" 
                        name="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Enter your password"
                    />
                </div>
                
                {/* Optional: Link to Sign Up */}
                <p className="text-sm text-center mt-6">
                    Don't have an account? 
                    <button 
                        type="button" 
                        onClick={() => navigate('/SignUp')} 
                        className="text-green-600 hover:text-green-800 font-semibold ml-1 transition-colors"
                        style={{ cursor: 'pointer' }}
                    >
                        Sign Up
                    </button>
                </p>

            </form>
            
            {/* 3. Action Buttons (Fixed Footer Area) */}
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

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={() => navigate('/Home')}
                        className={`px-8 py-3 rounded-lg text-white font-bold shadow-md transition duration-300 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
                        }`}
                        style={{ cursor: 'pointer' }}
                    >
                        {loading ? 'Processing...' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- WRAPPER COMPONENT FOR FULL-SCREEN LAYOUT AND NAVIGATION ---
export default function SignInPage() {
    // Function to load SweetAlert dynamically
    const loadSweetAlert = () => {
        if (typeof window.swal === 'undefined' && !document.querySelector('#sweetalert-cdn')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/sweetalert/dist/sweetalert.min.js';
            script.id = 'sweetalert-cdn';
            document.body.appendChild(script);
        }
    };

    useEffect(() => {
        loadSweetAlert();
    }, []);

    // Navigation Logic: Simulates navigation to external paths
    const navigate = (path) => {
        const url = `/${path}`;
        console.log(`Simulating navigation to external path: ${url}`);
        
        if (typeof window !== 'undefined') {
            window.location.assign(url);
        }
    };

    // Full-screen container with fixed height requirement applied (using h-[90vh] to match SignUpPage's container feel)
    return (
        <div className="min-h-screen h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="h-[90vh] w-full max-w-lg">
                <SignInFormContent navigate={navigate} />
            </div>
        </div>
    );
}

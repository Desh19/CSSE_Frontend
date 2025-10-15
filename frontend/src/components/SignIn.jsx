import React, { useState, useEffect } from "react";
import axios from "axios";
import { loginFunc } from "../services/api";
// NOTE: I've removed `useNavigate` from react-router-dom as it's typically not available
// in this sandbox environment. I've defined a simple, effective `Maps` helper
// within the main component to simulate redirects.

// --- API Endpoint ---
const LOGIN_API = "http://localhost:8090/api/auth/login";

// --- ROUTE MAPPING ---
// Define the target paths for each user role after successful login
const ROLE_DASHBOARD_MAP = {
  Administrator: "/RequestApproval",
  Resident: "/Home",
  CollectionCrewMember: "/CrewMemberAssignedList",
};

// --- Reusable Input Field Component ---
const FormInput = ({
  label,
  type = "text",
  name,
  required = true,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-150"
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

// Function to simulate navigation (adjust based on your environment)
const simulateNavigation = (path) => {
  console.log(`Simulating navigation to external path: ${path}`);
  if (typeof window !== "undefined") {
    // In a real application, you would use navigate(path) from react-router-dom here.
    // For the sandbox, we'll assign to window.location to simulate a page change.
    window.location.assign(path);
  }
};

// --- MAIN SIGN IN COMPONENT ---
const SignInFormContent = ({ simulateNavigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Sign In)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Basic Client-side Validation
      if (!formData.email || !formData.password) {
        throw new Error("Please enter both email and password.");
      }

      const payload = {
        email: formData.email,
        password: formData.password,
      };

      // 1. Send API Request - NOW USING THE FULL LOCALHOST URL
      const response = await loginFunc(payload);
      const data = response.data; 

      // 2. SUCCESS: Extract Role and Determine Target Path
      const userRole = data.role;
      const targetPath = ROLE_DASHBOARD_MAP[userRole] || "/default/home"; // Fallback path

      // In a real app, you would save the token (data.token) and user data (data)
      // to global state or local storage here.
      localStorage.setItem("token", data.token);

      // 2. Save your basic identity (name, role, ID) to Local Storage
      // This is used by the frontend to personalize the dashboard (e.g., "Welcome, [User Name]").
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      // Use swal (SweetAlert) for success message
      if (typeof window.swal === "function") {
        window
          .swal({
            title: "Login Successful!",
            text: `Welcome back, ${
              data.name || "User"
            }! You are logging in as a ${userRole}.`,
            icon: "success",
            button: "Proceed",
          })
          .then(() => {
            // 3. Navigate to the role-specific page
            simulateNavigation(targetPath);
          });
      } else {
        setMessage(
          `Login successful! Redirecting ${userRole} to ${targetPath}...`
        );
        simulateNavigation(targetPath);
      }

      // Clear fields after successful submission
      setFormData({ email: "", password: "" });
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(errMsg);
      // Use swal for error message
      if (typeof window.swal === "function") {
        window.swal("Login Failed", errMsg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Render Component ---
  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl h-full flex flex-col">
      <div className="p-8 pb-0">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Smart Waste Management Sign In
        </h2>
      </div>

      {/* Status Messages */}
      {(error || message) && (
        <div className="px-8 pt-0 pb-4">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}
          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm"
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Form Content */}
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
            onClick={() => simulateNavigation("/SignUpPage.jsx")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold ml-1 transition-colors"
            style={{ cursor: "pointer" }}
          >
            Sign Up Now
          </button>
        </p>
      </form>

      {/* Action Buttons (Fixed Footer Area) */}
      <div className="px-8 pt-4 pb-8 bg-white border-t border-gray-100">
        <div className="flex justify-end items-center">
          {/* Sign In Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-3 rounded-lg text-white font-bold shadow-md transition duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            }`}
            style={{ cursor: "pointer" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- WRAPPER COMPONENT FOR FULL-SCREEN LAYOUT AND EXTERNAL SETUP ---
export default function SignInPage() {
  // Function to load SweetAlert dynamically
  const loadSweetAlert = () => {
    if (
      typeof window.swal === "undefined" &&
      !document.querySelector("#sweetalert-cdn")
    ) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/sweetalert/dist/sweetalert.min.js";
      script.id = "sweetalert-cdn";
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    loadSweetAlert();
  }, []);

  // Full-screen container
  return (
    <div className="min-h-screen h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="h-[90vh] w-full max-w-lg">
        <SignInFormContent simulateNavigation={simulateNavigation} />
      </div>
    </div>
  );
}

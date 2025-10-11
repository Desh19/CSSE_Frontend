// SpecialPickupForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SpecialPickupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    wasteType: "",
    scheduleDate: "",
    description: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    billingAddress: "",
  });

  const SERVICE_FEE = "1,200.00"; // Example fee
  const wasteTypes = [
    "Bulky and household items",
    "Electronic and e-waste",
    "Other recyclables",
  ];

  // 💡 NEW HANDLER FOR DASHBOARD NAVIGATION
  const handleDashboardNavigation = () => {
    navigate("/"); // Navigates to the root path
  };

  // Handler for all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Step 1 Navigation ---
  const handleNext = (e) => {
    e.preventDefault();
    // Basic validation for Step 1
    if (!formData.wasteType || !formData.scheduleDate) {
      alert("Please select a Waste Type and Schedule Date.");
      return;
    }
    setCurrentStep(2);
  };

  // --- Step 2 Navigation/Submission ---
  const handleSave = (e) => {
    e.preventDefault();
    // Final Submission Logic
    console.log("Final Form Data:", formData);
    alert("Special Pickup Scheduled and Payment Saved!");
    // Optional: Reset or navigate after success
  };

  // ------------------------------------
  // --- Step 1: Schedule Details UI ---
  // ------------------------------------
  const renderStep1 = () => (
    <form onSubmit={handleNext}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Schedule Details
      </h2>

      {/* Waste Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Waste Type
        </label>
        <select
          name="wasteType"
          value={formData.wasteType}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 text-gray-700 cursor-pointer"
          required
        >
          <option value="" disabled>
            Select waste type
          </option>
          {wasteTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Schedule Date
        </label>
        <input
          type="date"
          name="scheduleDate"
          value={formData.scheduleDate}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 cursor-pointer"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description of items..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
        ></textarea>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-between mt-15">
        {/* THIS IS THE BUTTON YOU PROVIDED! It navigates to the Dashboard on click */}
        <button
          type="button"
          onClick={handleDashboardNavigation} // 💡 Calls navigate('/')
          className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Back to the Dashboard
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );

  // ---------------------------------
  // --- Step 2: Payment Details UI ---
  // ---------------------------------
  const renderStep2 = () => (
    <form onSubmit={handleSave}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment</h2>

      {/* Service Fee */}
      <div className="mb-6 text-lg font-medium text-gray-800">
        Special pickup Service:{" "}
        <span className="text-blue-600">Rs. {SERVICE_FEE}</span>
      </div>

      {/* Card Number */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="XXXX XXXX XXXX XXXX"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          required
        />
      </div>

      {/* Expiry Date and CVC */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expire Date
          </label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVC
          </label>
          <input
            type="text"
            name="cvc"
            value={formData.cvc}
            onChange={handleChange}
            placeholder="CVC"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>
      </div>

      {/* Billing Address */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Address
        </label>
        <textarea
          name="billingAddress"
          rows="3"
          value={formData.billingAddress}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
          required
        ></textarea>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)} // Go back to Step 1
          className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );

  // --------------------------------
  // --- Main Render Function ---
  // --------------------------------
  return (
    // 💡 REMOVED 'justify-center items-center' and 'max-w-xl'
    // This wrapper now fills its parent container (e.g., the Main Content Area in your App.jsx)
    <div className="p-8 bg-gray-50 flex-1 min-h-screen">
      {/* 💡 The internal form container now uses w-full and has horizontal padding */}
      <div className="w-full bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        {/* Step Indicator */}
        <div className="text-sm font-semibold text-gray-500 mb-8">
          Step {currentStep} of 2
        </div>

        {/* Conditional rendering of steps */}
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </div>
    </div>
  );
};

export default SpecialPickupForm;

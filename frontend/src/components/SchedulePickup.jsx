import React, { useState, useEffect } from 'react';
import { CloudUpload, Calendar, MapPin, Trash2, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { schedulePickupFunc } from '../services/api'; 

const WasteTypeOptions = [
  { value: 'BULK', label: 'Bulky Items', icon: '🛋️', description: 'Furniture, Mattresses, large items.' },
  { value: 'E_WASTE', label: 'E-Waste', icon: '🔋', description: 'Electronics, batteries, appliances.' },
  { value: 'PLASTIC', label: 'Plastic Waste', icon: '🧴', description: 'Containers, bottles, plastic bags.' },
  { value: 'PAPER', label: 'Paper & Cardboard', icon: '📰', description: 'Newspaper, boxes, cartons.' },
  { value: 'GLASS', label: 'Glass', icon: '🥛', description: 'Glass bottles and jars.' },
  { value: 'METAL', label: 'Metal', icon: '🛠️', description: 'Scrap metal, cans, non-hazardous metal items.' },
];
const getUserData = () => {
  try {
    const userString = localStorage.getItem('user');
    const userData = userString ? JSON.parse(userString) : {};
    return { 
      residentId: userData._id || null, 
      userName: userData.name || 'Resident' 
    };
  } catch (e) {
    console.error("Error retrieving user ID from localStorage:", e);
    return { residentId: null, userName: 'Resident' };
  }
};

const SchedulePickup = () => {
  const { residentId, userName } = getUserData();
  
  const [formData, setFormData] = useState({
    requestType: WasteTypeOptions[0].value, 
    description: '',
    scheduledDate: '',
  });
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!residentId) return;

    setStatus('fetching_location');
    setMessage('Fetching your current location...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setStatus('idle'); 
          setMessage('Location successfully captured.');
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setStatus('error');
          setMessage(`Location error: ${error.message}. Please allow access or try refreshing.`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setStatus('error');
      setMessage('Geolocation is not supported by your browser.');
    }
  }, [residentId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!residentId) {
      setMessage('Error: User not logged in or ID missing.');
      setStatus('error');
      return;
    }
    if (!location) {
        setMessage('Error: Cannot submit request without a captured location.');
        setStatus('error');
        return;
    }

    setStatus('loading');
    setMessage('Submitting pickup request...');

    const locationString = `GPS: ${JSON.stringify(location)}`;
    const fullDescription = `${formData.description}`;

    const payload = {
      requestType: formData.requestType,
      description: fullDescription,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
      resident: residentId,
      location:locationString
    };
    
    try {
      const response = await schedulePickupFunc(payload);
      
      setStatus('success');
      setMessage(`Pickup request submitted! ID: ${response.data.request.requestId || 'N/A'}`);

      setFormData({ requestType: WasteTypeOptions[0].value, description: '', scheduledDate: '' });

    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('error');
      const errorMessage = error.response?.data?.message || error.message || 'Server error occurred.';
      setMessage(`Submission failed: ${errorMessage}`);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const isFormDisabled = status === 'loading' || status === 'fetching_location' || !location;

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 md:p-12 bg-white shadow-2xl rounded-xl border border-gray-100">
      
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <Trash2 className="h-10 w-10 text-green-700" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Schedule Your Waste Pickup, {userName}!
        </h2>
        <p className="text-gray-500 mt-2 text-lg">
          Choose a waste type, describe the items, and set a convenient date.
        </p>
      </div>

      {!residentId && (
        <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium rounded">
            <AlertTriangle className="h-5 w-5 inline mr-2"/>
            You must be logged in as a Resident to schedule a pickup.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" disabled={!residentId}>
        
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-green-600"/>
            1. Select Waste Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {WasteTypeOptions.map((option) => (
              <label 
                key={option.value}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${formData.requestType === option.value 
                    ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-500' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                  }
                `}
              >
                <input
                  type="radio"
                  name="requestType"
                  value={option.value}
                  checked={formData.requestType === option.value}
                  onChange={handleChange}
                  className="hidden"
                  disabled={isFormDisabled}
                />
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                        <span className="font-bold text-gray-800">{option.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                    </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <CloudUpload className="h-5 w-5 mr-2 text-green-600"/>
                    2. Describe Items to be Picked Up
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="4"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., One old dining table, three metal chairs, and 10 large PET water bottles."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-green-500 focus:border-green-500 transition duration-150"
                    disabled={isFormDisabled}
                ></textarea>
            </div>

            <div>
                <label htmlFor="scheduledDate" className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600"/>
                    3. Preferred Pickup Date
                </label>
                <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    required
                    min={today}
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-green-500 focus:border-green-500 transition duration-150 h-[5.8rem]" // Match height
                    disabled={isFormDisabled}
                />
            </div>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg flex items-start">
            <MapPin className="h-6 w-6 text-blue-700 flex-shrink-0 mt-1 mr-3"/>
            <div>
                <p className="font-bold text-blue-900 text-lg">4. Location Confirmation</p>
                {location ? (
                    <p className="text-sm text-blue-700 mt-1">
                        <CheckCircle className='h-4 w-4 inline mr-1 text-green-600'/>
                        Your current GPS location has been captured successfully. 
                        The crew will use this to locate the pickup items.
                    </p>
                ) : (
                    <p className="text-sm text-red-600 font-medium mt-1">
                        <AlertTriangle className='h-4 w-4 inline mr-1 text-red-500'/>
                        {message.includes('Error') ? message : 'Fetching location... Please allow location access in your browser.'}
                    </p>
                )}
            </div>
        </div>

        {message && status !== 'idle' && (
          <div className={`p-4 rounded-lg flex items-center font-medium ${
            status === 'loading' || status === 'fetching_location' ? 'bg-yellow-100 text-yellow-800' :
            status === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {(status === 'loading' || status === 'fetching_location') && <Loader className="h-5 w-5 mr-3 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 mr-3" />}
            {status === 'error' && <AlertTriangle className="h-5 w-5 mr-3" />}
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isFormDisabled || !residentId || !formData.description || !formData.scheduledDate}
          className={`
            w-full py-4 mt-4 text-xl font-bold rounded-lg transition duration-200 text-white
            ${isFormDisabled || !residentId || !formData.description || !formData.scheduledDate
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 shadow-xl focus:ring-4 focus:ring-green-300'
            }
          `}
        >
          {status === 'loading' ? 'Scheduling Request...' : 
           status === 'fetching_location' ? 'Waiting for Location...' : 
           'Finalize Pickup Request'}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-8 text-center">
        By submitting, you agree that your current GPS coordinates will be logged with the request for accurate crew assignment and routing.
      </p>
    </div>
  );
};

export default SchedulePickup;
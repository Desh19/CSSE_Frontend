import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate is required for handleMarkAsComplete
import axios from "axios";
// Assuming the path to your API service functions is correct:
import {getAssignedPickupsFunc , startPickupFunc} from "../services/api"; 


// --- Utility Components (Unchanged) ---
const StatusBadge = ({ status }) => {
  let classes = "px-3 py-1 text-xs font-semibold rounded-full";
  let displayStatus = status.replace('_', ' ');

  switch (status) {
    case "APPROVED":
      classes += " bg-indigo-100 text-indigo-800 border border-indigo-300";
      break;
    case "IN_PROGRESS":
      classes += " bg-blue-100 text-blue-800 border border-blue-300";
      break;
    case "COLLECTED":
    case "REJECTED":
      classes += " bg-gray-200 text-gray-700 border border-gray-400 opacity-70";
      break;
    default:
      classes += " bg-yellow-100 text-yellow-800 border border-yellow-300";
      break;
  }

  return <span className={classes}>{displayStatus.toUpperCase()}</span>;
};

// A simple loading spinner SVG
const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
// --- End Utility Components ---

// --- New/Updated Location Component ---

/**
 * Parses the location string and renders a clickable Google Maps link if GPS data is found.
 */
const LocationDisplay = ({ locationString }) => {
  let locationDisplay = locationString || 'N/A';
  let gpsData = null;

  if (locationDisplay.startsWith('GPS: {')) {
    try {
      const jsonStr = locationDisplay.substring(5).trim();
      gpsData = JSON.parse(jsonStr);
      // Format the display string
      locationDisplay = `Lat: ${gpsData.latitude.toFixed(4)}, Lon: ${gpsData.longitude.toFixed(4)}`;
    } catch (e) {
      // Fallback if parsing fails, use the raw string
      gpsData = null;
      locationDisplay = locationString;
    }
  }

  // Google Maps URL format for latitude,longitude
  const mapUrl = gpsData 
    ? `https://www.google.com/maps/search/?api=1&query=${gpsData.latitude},${gpsData.longitude}` 
    : null;

  if (mapUrl) {
    return (
      <a 
        href={mapUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition duration-150 flex items-center group"
      >
        <span className="bg-blue-100 p-1 rounded text-xs font-mono group-hover:underline">
          {locationDisplay}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="ml-1 w-4 h-4 text-red-500 group-hover:text-red-600"
        >
          <path d="M12 22s-8-4.5-8-10C4 5.5 7.5 2 12 2s8 3.5 8 10c0 5.5-8 10-8 10z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </a>
    );
  }

  // Display raw data or 'N/A' if GPS data is invalid or missing
  return (
    <span className="bg-gray-100 p-1 rounded text-xs font-mono text-gray-700">
      {locationDisplay}
    </span>
  );
};
// --- End Location Component ---


const CrewPickupRequests = () => {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // 1. Fetch Assigned Pickups
  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAssignedPickupsFunc();
      setPickups(response.data);
    } catch (err) {
      console.error("Error fetching assigned pickups:", err);
      setError("Failed to load assigned requests. Please check your network connection and server status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  // 2. Handle Status Update to IN_PROGRESS
  const handleStartPickup = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await startPickupFunc(id);
      await fetchPickups(); 

    } catch (err) {
      console.error(`Error starting pickup ${id}:`, err);
      console.warn(`Failed to start pickup ${id}. Check console for details.`, err);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // 3. Handle Mark As Complete - Navigate to QR page with pickup ID
  const handleMarkAsComplete = (id) => {
    // Navigates to the /qr route, passing the pickup ID in the state object.
    navigate(`/qr`, { state: { pickupRequestId: id } }); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex items-center text-indigo-600 text-lg font-semibold p-6 rounded-xl bg-white shadow-lg">
            <LoadingSpinner/>
            Loading Assigned Pickups...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 bg-red-100 text-red-700 border border-red-300 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          My Active Assignments
        </h1>
        <p className="text-gray-600">
          Viewing {pickups.length} requests assigned to your crew. Tasks are ordered by schedule date.
        </p>
      </header>

      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="min-w-full table-auto bg-white divide-y divide-gray-200">
          <thead>
            <tr className="bg-indigo-700 text-left text-xs font-bold text-white uppercase tracking-wider">
              <th className="py-3 px-4 rounded-tl-xl">Type</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Scheduled Date</th>
              <th className="py-3 px-4">Resident</th>
              <th className="py-3 px-4">Location (GPS)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
              <th className="py-3 px-4 rounded-tr-xl text-center">Mark As Complete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pickups.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500 text-lg font-medium">
                  🎉 All clear! No active pickups assigned to you.
                </td>
              </tr>
            ) : (
              pickups.map((req) => {
                const isActionLoading = actionLoading[req._id];
                
                return (
                  <tr key={req._id} className="hover:bg-indigo-50 transition duration-150 ease-in-out">
                    
                    {/* Request Type */}
                    <td className="py-3 px-4 text-sm font-semibold text-indigo-700">
                        {req.requestType}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-sm truncate" title={req.description}>
                        {req.description}
                    </td>

                    {/* Scheduled Date */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(req.scheduledDate).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(req.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Resident Info */}
                    <td className="py-3 px-4 text-sm">
                      <div className="font-medium text-gray-900">{req.resident?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate">{req.resident?.email || 'N/A'}</div>
                    </td>

                    {/* Location (UPDATED) */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <LocationDisplay locationString={req.location} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Actions (Start Pickup) */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        {req.status === "APPROVED" && (
                          <button
                            className="flex items-center justify-center bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                            onClick={() => handleStartPickup(req._id)}
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? (
                                <>
                                    <LoadingSpinner />
                                    Starting...
                                </>
                            ) : (
                                "Start Pickup"
                            )}
                          </button>
                        )}
                        {req.status === "IN_PROGRESS" && (
                            <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                                On Route
                            </span>
                        )}
                        {(req.status === "COLLECTED" || req.status === "REJECTED") && (
                            <span className="text-gray-400 text-sm italic">Status Finalized</span>
                        )}
                      </div>
                    </td>

                    {/* Mark As Complete */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        {req.status === "IN_PROGRESS" && (
                          <button
                            className="flex items-center justify-center bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:bg-green-700 transition duration-200"
                            onClick={() => handleMarkAsComplete(req._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Complete
                          </button>
                        )}
                        {req.status === "APPROVED" && (
                            <span className="text-gray-400 text-xs italic">Start pickup first</span>
                        )}
                        {(req.status === "COLLECTED" || req.status === "REJECTED") && (
                            <span className="text-gray-400 text-xs italic">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrewPickupRequests;
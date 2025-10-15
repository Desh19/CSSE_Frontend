import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {getAssignedPickupsFunc , startPickupFunc} from "../services/api";




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

const CrewPickupRequests = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // 1. Fetch Assigned Pickups using real API function
  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the actual getAssignedPickupsFunc to fetch data
      const response = await getAssignedPickupsFunc();
      setPickups(response.data);
    } catch (err) {
      console.error("Error fetching assigned pickups:", err);
      // Provide user-friendly feedback on connection issues
      setError("Failed to load assigned requests. Please check your network connection and server status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  // 2. Handle Status Update to IN_PROGRESS using real API function
  const handleStartPickup = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      // Use the actual startPickupFunc to send the update
      await startPickupFunc(id);

      // On successful server update, re-fetch the entire list to reflect the new status
      await fetchPickups();

    } catch (err) {
      console.error(`Error starting pickup ${id}:`, err);
      // Replacing 'alert' with console.warn as per environment rules
      console.warn(`Failed to start pickup ${id}. The server may have rejected the request. Check console for details.`, err);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
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
              {/* Updated Column Headers */}
              <th className="py-3 px-4 rounded-tl-xl">Type</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Scheduled Date</th>
              <th className="py-3 px-4">Resident</th>
              <th className="py-3 px-4">Location (GPS)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 rounded-tr-xl text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pickups.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500 text-lg font-medium">
                  🎉 All clear! No active pickups assigned to you.
                </td>
              </tr>
            ) : (
              pickups.map((req) => {
                const isActionLoading = actionLoading[req._id];
                // Handle potential JSON string in location field
                let locationDisplay = req.location || 'N/A';
                if (locationDisplay.startsWith('GPS: {')) {
                    try {
                        // Extract JSON string part
                        const jsonStr = locationDisplay.substring(5).trim();
                        const gpsData = JSON.parse(jsonStr);
                        locationDisplay = `Lat: ${gpsData.latitude.toFixed(4)}, Lon: ${gpsData.longitude.toFixed(4)}`;
                    } catch (e) {
                        // Fallback if parsing fails
                        locationDisplay = req.location; 
                    }
                }

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

                    {/* Location */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <span className="bg-gray-100 p-1 rounded text-xs font-mono">{locationDisplay}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Actions */}
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








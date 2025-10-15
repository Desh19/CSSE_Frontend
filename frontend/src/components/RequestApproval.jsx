import React, { useState, useEffect, useCallback } from "react";
import { Loader, AlertTriangle, MapPin, CheckCircle, Clock } from 'lucide-react';
// Assuming your API functions are here
import { 
    getAllPickupRequestsFunc, 
    getAllCrewMembersFunc, 
    updatePickupRequestFunc 
} from "../services/api"; 

// --- Helper Functions ---

/**
 * Parses the location string ("GPS: {...}") into a usable coordinate object.
 * @param {string | undefined} locationString 
 * @returns {{latitude: number, longitude: number} | null}
 */
const parseLocation = (locationString) => {
    if (!locationString || typeof locationString !== 'string') return null;
    
    // Expected prefix to strip
    const prefix = "GPS: ";
    if (locationString.startsWith(prefix)) {
        try {
            // Extract the JSON part and parse it
            const jsonString = locationString.substring(prefix.length).trim();
            const coords = JSON.parse(jsonString);
            
            if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
                return coords;
            }
        } catch (e) {
            console.error("Error parsing location JSON:", e);
        }
    }
    return null;
};

// --- Component ---

const AdminPickupRequests = () => {
    const [requests, setRequests] = useState([]);
    const [crewMembers, setCrewMembers] = useState([]);
    
    // Loading and error states for initial data fetching
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for transient updates (local changes before saving)
    const [statusUpdate, setStatusUpdate] = useState({});
    const [selectedCrew, setSelectedCrew] = useState({});
    
    // State to track loading status of individual update actions
    const [updateLoading, setUpdateLoading] = useState({});

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [requestsResponse, crewResponse] = await Promise.all([
                getAllPickupRequestsFunc(),
                getAllCrewMembersFunc()
            ]);

            // Assuming data is in response.data or response.data.requests/crew
            setRequests(requestsResponse.data.requests || requestsResponse.data || []);
            setCrewMembers(crewResponse.data.crewMembers || crewResponse.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load requests or crew members. Please check the API status.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Local Change Handlers ---
    const handleStatusChange = (id, status) => {
        setStatusUpdate((prev) => ({ ...prev, [id]: status }));
        
        // If status is changed to anything other than APPROVED, clear the crew assignment locally
        if (status !== "APPROVED") {
            setSelectedCrew((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const handleCrewChange = (id, crewId) => {
        setSelectedCrew((prev) => ({ ...prev, [id]: crewId }));
    };

    // --- API Update Handler ---
    const handleUpdate = async (id) => {
        const newStatus = statusUpdate[id];
        const newCrewId = selectedCrew[id];
        const currentReq = requests.find(req => req._id === id);
        
        // Use current values if not locally modified
        const finalStatus = newStatus || currentReq.status;
        const finalCrewId = newCrewId || currentReq.assignedCrew;
        
        // Validation check for approval without assignment
        if (finalStatus === "APPROVED" && !finalCrewId) {
            alert("Error: You must assign a crew member to approve a request."); // Using alert for immediate user feedback on required action
            return;
        }

        setUpdateLoading((prev) => ({ ...prev, [id]: true }));

        const payload = {
            status: finalStatus,
            // Only send assignedCrewId if status is APPROVED, otherwise send null/undefined to clear it
            assignedCrewId: finalStatus === "APPROVED" ? finalCrewId : undefined, 
        };

        try {
            await updatePickupRequestFunc(id, payload);
            
            // Success: clear local states for this request and refresh the main data
            setStatusUpdate((prev) => { const newState = { ...prev }; delete newState[id]; return newState; });
            setSelectedCrew((prev) => { const newState = { ...prev }; delete newState[id]; return newState; });
            
            await fetchData(); // Refresh data to show persistent change

        } catch (err) {
            console.error("Error updating request:", err);
            alert(`Failed to update request ${id}. Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setUpdateLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    // --- Rendering Logic ---

    if (loading && requests.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
                <span className="text-xl text-gray-700">Loading requests and crew members...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 mt-10 bg-red-100 border-l-4 border-red-500 text-red-700">
                <AlertTriangle className="w-6 h-6 inline mr-2" />
                <span className="font-semibold">{error}</span>
            </div>
        );
    }
    
    // Helper to determine text/background for status badges
    const getStatusClasses = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800";
            case "IN_PROGRESS": // Added IN_PROGRESS for visual clarity
                return "bg-indigo-100 text-indigo-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Helper to find crew member name
    const getAssignedCrewName = (crewId) => {
        const crew = crewMembers.find((c) => c._id === crewId);
        return crew ? crew.name : <span className="text-gray-400">Not Found</span>;
    };
    
    return (
        <div className="max-w-full mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Waste Pickup Management</h1>
                <p className="text-gray-500">Review, approve, reject, and assign collection crews to resident requests.</p>
            </header>
            

            <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-200">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0">
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Resident Info</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Scheduled Date</th>
                            <th className="py-3 px-4">Location</th> {/* New Location Column */}
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4">Assigned Crew</th>
                            <th className="py-3 px-4 w-[250px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-10 text-gray-500">
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                    No pending or active pickup requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => {
                                const currentStatus = statusUpdate[req._id] || req.status;
                                const currentCrewId = selectedCrew[req._id] || req.assignedCrew;
                                
                                const isPending = req.status === "PENDING";
                                
                                // Check if an update is needed (status change OR crew assignment change for APPROVED status)
                                const statusChanged = currentStatus !== req.status;
                                const crewChanged = currentCrewId !== req.assignedCrew;
                                const isUpdateRequired = statusChanged || (currentStatus === "APPROVED" && crewChanged);
                                
                                // Disable update if no change, or if approving without selecting a crew
                                const isCrewAssignmentNeeded = currentStatus === "APPROVED" && !currentCrewId;
                                const disableUpdate = !isUpdateRequired || isCrewAssignmentNeeded || updateLoading[req._id];

                                const coords = parseLocation(req.location);

                                return (
                                    <tr key={req._id} className="hover:bg-indigo-50 transition duration-100">
                                        <td className="py-3 px-4 text-xs font-mono text-gray-600">{req.requestId}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="font-semibold text-gray-900">{req.resident?.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[150px]">{req.resident?.email || 'No email'}</div>
                                            <div className="text-xs text-gray-500">{req.resident?.address || 'No address'}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-indigo-700">{req.requestType}</td>
                                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                                            {new Date(req.scheduledDate).toLocaleDateString()}
                                            <div className="text-xs text-gray-500">{new Date(req.scheduledDate).toLocaleTimeString()}</div>
                                            <p className="text-xs text-gray-600 mt-1 max-w-xs">{req.description.split(' | GPS')[0].substring(0, 100)}...</p>
                                        </td>
                                        
                                        {/* Location Column */}
                                        <td className="py-3 px-4 text-sm max-w-[150px]">
                                            {coords ? (
                                                <a 
                                                    href={`https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline"
                                                >
                                                    <MapPin className="w-4 h-4 mr-1"/> View on Map
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Location data missing.</span>
                                            )}
                                        </td>

                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(currentStatus)}`}>
                                                {currentStatus}
                                            </span>
                                        </td>

                                        <td className="py-3 px-4 text-sm">
                                            {currentCrewId ? getAssignedCrewName(currentCrewId) : <span className="text-gray-400">Unassigned</span>}
                                        </td>
                                        
                                        {/* Actions */}
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col gap-2">
                                                
                                                {/* Status Select (Only if PENDING) */}
                                                {isPending && (
                                                    <select
                                                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                                        value={currentStatus}
                                                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                                    >
                                                        <option value="PENDING">PENDING</option>
                                                        <option value="APPROVED">APPROVE</option>
                                                        <option value="REJECTED">REJECT</option>
                                                    </select>
                                                )}
                                                
                                                {/* Crew Assignment Select (Only if APPROVED and PENDING original status) */}
                                                {(currentStatus === "APPROVED" && isPending) && (
                                                    <select
                                                        className="border border-indigo-300 bg-indigo-50 rounded-lg px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                                        value={currentCrewId || ""}
                                                        onChange={(e) => handleCrewChange(req._id, e.target.value)}
                                                    >
                                                        <option value="" disabled>--- Select Crew ---</option>
                                                        {crewMembers.map((crew) => (
                                                            <option key={crew._id} value={crew._id}>
                                                                {crew.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}

                                                {/* Status Display if not PENDING */}
                                                {!isPending && (
                                                    <div className={`p-2 rounded-lg text-center font-bold text-xs ${getStatusClasses(req.status)}`}>
                                                        {req.status === 'COMPLETED' ? (<CheckCircle className="w-4 h-4 inline mr-1" />) : null}
                                                        {req.status}
                                                    </div>
                                                )}

                                                {/* Update Button */}
                                                {isPending && (
                                                    <button
                                                        className={`rounded-lg px-3 py-1 text-sm font-bold transition duration-150 shadow-md ${
                                                            disableUpdate 
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        }`}
                                                        onClick={() => handleUpdate(req._id)}
                                                        disabled={disableUpdate}
                                                    >
                                                        {updateLoading[req._id] ? (
                                                            <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                                                        ) : (
                                                            statusChanged ? 'Confirm Update' : isCrewAssignmentNeeded ? 'Assign Crew' : 'No Change'
                                                        )}
                                                    </button>
                                                )}
                                                
                                                {isCrewAssignmentNeeded && currentStatus === "APPROVED" && isPending && (
                                                    <p className="text-red-500 text-xs font-medium">Assignment required!</p>
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

export default AdminPickupRequests;
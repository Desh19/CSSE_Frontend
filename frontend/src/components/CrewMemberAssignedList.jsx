import React, { useState } from "react";
// Removed: import axios from "axios";

// --- DUMMY DATA ---
// Data representing pickup requests assigned to the current crew member.
const dummyPickups = [
    {
        _id: "crew_req1",
        requestId: "CRW-101",
        requestType: "BULK",
        description: "Old sofa, broken table, and five moving boxes.",
        scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: "APPROVED", // Ready to be started
        resident: { name: "Mark Vance", email: "mark@home.com", address: "123 Maple St, Unit 2A" },
    },
    {
        _id: "crew_req2",
        requestId: "CRW-102",
        requestType: "HAZMAT",
        description: "1 gallon of used motor oil and old garden chemicals.",
        scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        status: "IN_PROGRESS", // Currently being handled
        resident: { name: "Sarah Connor", email: "sc@future.net", address: "555 Main Ave, T-800" },
    },
    {
        _id: "crew_req3",
        requestId: "CRW-103",
        requestType: "BULK",
        description: "Two worn-out tires and a small broken water heater.",
        scheduledDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        status: "COMPLETED",
        resident: { name: "John Doe", email: "john@example.com", address: "800 Quiet Blvd" },
    },
    {
        _id: "crew_req4",
        requestId: "CRW-104",
        requestType: "BULK",
        description: "Large cardboard boxes from a recent move.",
        scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        status: "APPROVED",
        resident: { name: "Jane Smith", email: "jane@company.com", address: "99 River Road" },
    },
];

// Removed: const API_BASE = "http://localhost:5000/api/crew";
// Removed: const token = localStorage.getItem("token");

const CrewPickupRequests = () => {
    // Initializing state with dummy data
    const [pickups, setPickups] = useState(dummyPickups);
    
    // The Crew component only needs to track if an action is loading, not the requests themselves
    const [actionLoading, setActionLoading] = useState({});

    // Removed: loading, error, useEffect, and fetchPickups

    // SIMULATED ACTION HANDLER
    const handleAction = (id, action) => {
        setActionLoading((prev) => ({ ...prev, [id]: true }));

        // Simulate API delay
        setTimeout(() => {
            setPickups(prevPickups => 
                prevPickups.map(req => 
                    req._id === id ? { ...req, status: action } : req
                )
            );
            
            // Clear loading state
            setActionLoading((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }, 500); // 500ms delay to simulate network call
    };

    // Removed: loading/error checks, replaced with direct render since data is local

    const getStatusClasses = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-indigo-100 text-indigo-800"; // Changed PENDING to APPROVED since this is a crew view
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        // Changed to full width (w-full) and removed max-width, centering, shadow, and border from the main container.
        <div className="w-full p-8 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Assigned Pickup Requests</h1>
            </header>


            <div className="overflow-x-auto shadow-xl rounded-xl">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-indigo-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            <th className="py-3 px-4 rounded-tl-xl">Request ID</th>
                            <th className="py-3 px-4">Resident</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Scheduled Date</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pickups.map((req) => (
                            <tr key={req._id} className="hover:bg-indigo-50 transition duration-100">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{req.requestId}</td>
                                <td className="py-3 px-4 text-sm">
                                    <div className="font-semibold">{req.resident?.name}</div>
                                    <div className="text-xs text-gray-500">{req.resident?.email}</div>
                                    <div className="text-xs text-gray-500">{req.resident?.address}</div>
                                </td>
                                <td className="py-3 px-4 text-sm">{req.requestType}</td>
                                <td className="py-3 px-4 text-sm max-w-xs truncate">{req.description}</td>
                                <td className="py-3 px-4 text-sm">
                                    {new Date(req.scheduledDate).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(req.status)}`}>
                                        {req.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex flex-col gap-2">
                                        {/* Action buttons based on status */}
                                        {req.status === "APPROVED" && (
                                            <button
                                                className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm font-medium hover:bg-blue-600 transition disabled:bg-gray-300 disabled:text-gray-500"
                                                onClick={() => handleAction(req._id, "IN_PROGRESS")}
                                                disabled={actionLoading[req._id]}
                                            >
                                                {actionLoading[req._id] ? "Starting..." : "Start Pickup"}
                                            </button>
                                        )}
                                        {req.status === "IN_PROGRESS" && (
                                            <button
                                                className="bg-green-500 text-white rounded-lg px-3 py-1 text-sm font-medium hover:bg-green-600 transition disabled:bg-gray-300 disabled:text-gray-500"
                                                onClick={() => handleAction(req._id, "COMPLETED")}
                                                disabled={actionLoading[req._id]}
                                            >
                                                {actionLoading[req._id] ? "Completing..." : "Complete Pickup"}
                                            </button>
                                        )}
                                        {(req.status === "COMPLETED" || req.status === "REJECTED") && (
                                            <span className="text-gray-400 text-xs py-1">Action Complete</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pickups.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500">
                                    No assigned pickup requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrewPickupRequests;

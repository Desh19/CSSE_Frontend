import React, { useState } from "react";
// Removed: import axios from "axios";

// --- DUMMY DATA ---
const dummyCrewMembers = [
    { _id: "crew101", name: "Alpha Team", email: "alpha@waste.com" },
    { _id: "crew102", name: "Bravo Squad", email: "bravo@waste.com" },
    { _id: "crew103", name: "Charlie Unit", email: "charlie@waste.com" },
];

const dummyRequests = [
    {
        _id: "req1",
        requestId: "REQ-001A",
        requestType: "BULK",
        description: "Old refrigerator, TV set, and mattress removal.",
        scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: "PENDING",
        resident: { name: "Alice Johnson", email: "alice@home.com", address: "45 Oak Lane, Sector C" },
        assignedCrew: null,
    },
    {
        _id: "req2",
        requestId: "REQ-002B",
        requestType: "HAZMAT",
        description: "Used car battery and five gallons of paint cans.",
        scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        status: "APPROVED",
        resident: { name: "Bob Smith", email: "bob@flat.net", address: "789 Pine Rd, Unit 4B" },
        assignedCrew: "crew101", // Assigned to Alpha Team
    },
    {
        _id: "req3",
        requestId: "REQ-003C",
        requestType: "BULK",
        description: "Pile of yard waste and old decking wood.",
        scheduledDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: "COMPLETED",
        resident: { name: "Charlie Brown", email: "cbrown@mailbox.org", address: "321 Comic Strip Ave" },
        assignedCrew: "crew102",
    },
    {
        _id: "req4",
        requestId: "REQ-004D",
        requestType: "HAZMAT",
        description: "Expired medicines and used cooking oils.",
        scheduledDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: "PENDING",
        resident: { name: "Diana Prince", email: "diana@amazon.com", address: "1 Themyscira Blvd" },
        assignedCrew: null,
    },
];

// Removed: const API_BASE = ...;
// Removed: const token = ...;

const AdminPickupRequests = () => {
    // Initializing state with dummy data
    const [requests, setRequests] = useState(dummyRequests);
    const [crewMembers] = useState(dummyCrewMembers); // Static dummy data
    const [selectedCrew, setSelectedCrew] = useState({});
    const [statusUpdate, setStatusUpdate] = useState({});

    // Removed: loading and error states as they are not needed without API calls

    // Removed: fetchData and useEffect

    const handleStatusChange = (id, status) => {
        setStatusUpdate((prev) => ({ ...prev, [id]: status }));
        // If status changes to anything other than APPROVED, clear selected crew for that request
        if (status !== "APPROVED") {
            setSelectedCrew((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const handleCrewChange = (id, crewId) => {
        setSelectedCrew((prev) => ({ ...prev, [id]: crewId }));
    };

    const handleUpdate = (id) => {
        // SIMULATE UPDATE LOCALLY
        const newStatus = statusUpdate[id];
        const newCrewId = selectedCrew[id];

        if (!newStatus) return;

        setRequests(prevRequests =>
            prevRequests.map(req => {
                if (req._id === id) {
                    return {
                        ...req,
                        status: newStatus,
                        // Update assignedCrew only if approved, otherwise clear it
                        assignedCrew: newStatus === "APPROVED" ? (newCrewId || req.assignedCrew) : null,
                    };
                }
                return req;
            })
        );

        // Clear local selection states after simulated update
        setStatusUpdate(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
        setSelectedCrew(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    // Removed: loading/error checks

    return (
        <div className="max-w-full mx-auto p-6 bg-gray-50 min-h-screen">
            <header className="mb-8"> {/* Removed max-w-4xl mx-auto */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pickup Requests Approval</h1>
            </header>
            

            <div className="overflow-x-auto shadow-xl rounded-xl">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="py-3 px-4">Request ID</th>
                            <th className="py-3 px-4">Resident</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Scheduled Date</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4">Assigned Crew</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.map((req) => {
                            // Check for transient status update in the local state
                            const currentStatus = statusUpdate[req._id] || req.status;

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
                                    default:
                                        return "bg-gray-100 text-gray-800";
                                }
                            };

                            const getAssignedCrewName = (crewId) => {
                                const crew = crewMembers.find((c) => c._id === crewId);
                                return crew ? crew.name : <span className="text-gray-400">Unknown Crew</span>;
                            };

                            // Determine if the request is still pending based on the original status
                            const isPending = req.status === "PENDING";
                            
                            // Determine if the update button should be enabled
                            const isUpdateRequired = currentStatus !== req.status || (currentStatus === "APPROVED" && (selectedCrew[req._id] || req.assignedCrew));
                            
                            const isCrewAssignmentNeeded = currentStatus === "APPROVED" && !selectedCrew[req._id] && !req.assignedCrew;
                            
                            const disableUpdate = !isUpdateRequired || isCrewAssignmentNeeded;


                            return (
                                <tr key={req._id} className="hover:bg-gray-50 transition duration-100">
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
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClasses(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {req.assignedCrew
                                            ? getAssignedCrewName(req.assignedCrew)
                                            : <span className="text-gray-400">Not Assigned</span>}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-2">
                                            <select
                                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={currentStatus}
                                                onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                                disabled={!isPending} // Only allow changes if the original status is PENDING
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="APPROVED">APPROVE</option>
                                                <option value="REJECTED">REJECT</option>
                                            </select>
                                            
                                            {(currentStatus === "APPROVED" && isPending) && (
                                                <select
                                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={selectedCrew[req._id] || req.assignedCrew || ""}
                                                    onChange={(e) => handleCrewChange(req._id, e.target.value)}
                                                >
                                                    <option value="">Assign Crew Member</option>
                                                    {crewMembers.map((crew) => (
                                                        <option key={crew._id} value={crew._id}>
                                                            {crew.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            
                                            <button
                                                className={`rounded-lg px-3 py-1 mt-1 text-sm font-semibold transition duration-150 ${
                                                    disableUpdate 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                                onClick={() => handleUpdate(req._id)}
                                                disabled={disableUpdate}
                                            >
                                                {disableUpdate ? 'No Changes' : 'Confirm Action'}
                                            </button>
                                            {isCrewAssignmentNeeded && currentStatus === "APPROVED" && (
                                                <p className="text-red-500 text-xs mt-1">Assign crew to approve.</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-500">
                                    No pickup requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPickupRequests;

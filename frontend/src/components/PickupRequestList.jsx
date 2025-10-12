import React from 'react';

// --- Sample Data based on your API response structure ---
const pickupRequests = [
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3412d0635cc22a7578e7",
        "requestId": "REQ-6CA3A2B6",
        "requestType": "BULK",
        "description": "Old sofa and broken chair",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "createdAt": "2025-10-12T04:52:34.404Z",
        "updatedAt": "2025-10-12T13:09:34.210Z",
        "__v": 0,
        "assignedCrew": {
            "_id": "68eb542d20d720d8473f9b5c",
            "name": "deshCrew",
            "email": "it20654276@my.sliit.lk",
            "role": "CollectionCrewMember"
        }
    },
    {
        "_id": "68eb3a3d34b21abc9e881e06",
        "requestId": "REQ-FC3CAF4C",
        "requestType": "BULK",
        "description": "Old sofa ",
        "scheduledDate": "2025-10-20T10:00:00.000Z",
        "status": "PENDING",
        "resident": {
            "_id": "68eb33bed0635cc22a7578e3",
            "name": "BinodBandara",
            "email": "bino@gmail.com",
            "role": "Resident",
            "address": "123 Main Street"
        },
        "assignedCrew": null,
        "createdAt": "2025-10-12T05:18:53.205Z",
        "updatedAt": "2025-10-12T05:18:53.205Z",
        "__v": 0
    }
];

/**
 * Helper function to format ISO date strings into a readable format.
 * @param {string} isoString 
 * @returns {string} Formatted date string
 */
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Invalid Date';
    }
};

/**
 * Helper component to render the status badge with appropriate styling.
 * @param {string} status - The status string (e.g., 'COMPLETED', 'PENDING')
 * @returns {JSX.Element}
 */
const StatusBadge = ({ status }) => {
    const statusColor = {
        COMPLETED: 'bg-green-100 text-green-800 border-green-300',
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    const classes = statusColor[status] || 'bg-gray-100 text-gray-800 border-gray-300';

    return (
        <span className={`inline-flex items-center justify-center w-full px-3 py-1 text-xs font-bold rounded-full border ${classes}`}>
            {status}
        </span>
    );
};


// --- MAIN COMPONENT: Simplified Two-Column Table ---
const PickupScheduleTable = () => {
    return (
        // The outer div maintains padding and min-height
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="mb-8"> {/* Removed max-w-4xl mx-auto */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pickup Schedule Overview</h1>
            </header>

            {/* Table Container now takes full width */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden"> 
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Header */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-3/4"
                                >
                                    Request Details
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-1/4"
                                >
                                    Status
                                </th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pickupRequests.length > 0 ? (
                                pickupRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition duration-150">
                                        
                                        {/* Column 1: Request Details (Composite Field) */}
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="space-y-1">
                                                {/* Request ID & Type */}
                                                <div className="font-bold text-base text-indigo-700">
                                                    {request.requestId} <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{request.requestType}</span>
                                                </div>
                                                
                                                {/* Description */}
                                                <div className="text-gray-700 font-medium truncate">
                                                    {request.description}
                                                </div>
                                                
                                                {/* Scheduled Date */}
                                                <div className="text-xs text-gray-500 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Scheduled: {formatDateTime(request.scheduledDate)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Column 2: Status */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <StatusBadge status={request.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-10 text-center text-lg text-gray-500">
                                        No pickup requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PickupScheduleTable;

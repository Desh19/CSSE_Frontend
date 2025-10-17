import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getResidentRequestsFunc } from '../services/api';

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

const StatusBadge = ({ status }) => {
    const statusColor = {
        COMPLETED: 'bg-green-100 text-green-800 border-green-300',
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
        APPROVED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        REJECTED: 'bg-red-100 text-red-800 border-red-300',
    };

    const classes = statusColor[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    const displayStatus = status.replace('_', ' ');

    return (
        <span className={`inline-flex items-center justify-center w-full px-3 py-1 text-xs font-bold rounded-full border ${classes}`}>
            {displayStatus}
        </span>
    );
};

const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const PickupScheduleTable = () => {
    const [pickupRequests, setPickupRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResidentRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getResidentRequestsFunc();
            setPickupRequests(response.data);
        } catch (err) {
            console.error("Error fetching resident requests:", err);
            setError("Failed to load your pickup history. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResidentRequests();
    }, [fetchResidentRequests]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="flex items-center text-indigo-600 text-lg font-semibold p-6 rounded-xl bg-white shadow-lg">
                    <LoadingSpinner />
                    Loading your request history...
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
                    My Pickup Request History
                </h1>
                <p className="text-gray-600">
                    Viewing {pickupRequests.length} total requests.
                </p>
            </header>

            <div className="overflow-x-auto shadow-2xl rounded-xl">
                <table className="min-w-full table-auto bg-white divide-y divide-gray-200">
                    {/* Table Header */}
                    <thead>
                        <tr className="bg-indigo-700 text-left text-xs font-bold text-white uppercase tracking-wider">
                            <th className="py-3 px-4 rounded-tl-xl">Request ID</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Scheduled Date</th>
                            <th className="py-3 px-4 rounded-tr-xl text-center">Status</th>
                        </tr>
                    </thead>
                    
                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-100">
                        {pickupRequests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-500 text-lg font-medium">
                                    You have not scheduled any pickup requests yet.
                                </td>
                            </tr>
                        ) : (
                            pickupRequests.map((request) => (
                                <tr key={request._id} className="hover:bg-indigo-50 transition duration-150 ease-in-out">
                                    
                                    {/* Request ID */}
                                    <td className="py-3 px-4 text-sm font-semibold text-indigo-700">
                                        {request.requestId}
                                    </td>
                                    
                                    {/* Request Type */}
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">{request.requestType}</span>
                                    </td>

                                    {/* Description */}
                                    <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate" title={request.description}>
                                        {request.description}
                                    </td>
                                    
                                    {/* Scheduled Date */}
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {formatDateTime(request.scheduledDate)}
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 px-4 text-center">
                                        <StatusBadge status={request.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PickupScheduleTable;

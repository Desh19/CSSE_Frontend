import axios from "axios";

// Set your backend API base URL here (change for production as needed)
// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8090/api";
const API_BASE =  "http://localhost:8090/api";

// Helper to get JWT token
const getToken = () => localStorage.getItem("token");

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;    
});

// --- Auth ---
export const loginFunc = (data) => api.post("/auth/login", data);
export const registerResidentFunc = (data) => api.post("/auth/register", data);
export const registerAdminFunc = (data) => api.post("/auth/register-admin", data);
export const registerCrewFunc = (data) => api.post("/auth/register-crew", data);

// --- Admin ---
export const getAllPickupRequestsFunc = () => api.get("/admin/pickup-requests");
export const updatePickupRequestFunc = (id, data) => api.put(`/admin/pickup-requests/${id}`, data);
export const getAllCrewMembersFunc = () => api.get("/admin/crew-members");
export const getAllUsersFunc = () => api.get("/admin/users");
export const updateUserStatusFunc = (id, data) => api.put(`/admin/users/${id}/status`, data);
export const createRouteFunc = (data) => api.post("/admin/routes", data);
export const getWasteLevelReportFunc = () => api.get("/admin/reports/waste-levels");

// --- Crew ---
export const getAssignedPickupsFunc = () => api.get("/crew/pickup-requests");
export const startPickupFunc = (id) => api.put(`/crew/pickup-requests/${id}/start`);
export const completePickupFunc = (id) => api.put(`/crew/pickup-requests/${id}/complete`);
export const getAllCrewMembers = () => api.get("/admin/crew-members");

// --- Resident ---
export const schedulePickupFunc = (data) => api.post("/resident/requests", data);
// Add more resident endpoints as needed

// --- IoT (if needed) ---
// export const getSensorData = () => api.get("/iot/sensors");

export default api;
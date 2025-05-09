// ZegoCloud configuration
export const ZEGO_APP_ID = import.meta.env.VITE_ZEGO_APP_ID ?? "";
export const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET ?? "";

// API endpoints
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  schoolSignup: `${API_BASE_URL}/api/schools/signup`,
  volunteerSignup: `${API_BASE_URL}/api/volunteers/signup`,
  studentSignup: `${API_BASE_URL}/api/students/signup`,
  createMeeting: `${API_BASE_URL}/api/createmeet`,
  getStudents: `${API_BASE_URL}/api/students`,
  getRequests: `${API_BASE_URL}/api/requests`,
  createRequest: `${API_BASE_URL}/api/requests/create`,
};

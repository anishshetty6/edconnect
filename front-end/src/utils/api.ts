import { API_BASE_URL } from "../config/env";

export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

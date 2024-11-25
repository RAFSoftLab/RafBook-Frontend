// src/api/authApi.ts
import axiosInstance from './axiosConfig';

// Define the shape of the login request and response
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Add other fields if your API returns more data
}

/**
 * Login function to authenticate a user.
 * @param credentials - The user's login credentials.
 * @returns A promise that resolves to the login response.
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
};

// You can add more authentication-related functions here, such as logout, register, etc.

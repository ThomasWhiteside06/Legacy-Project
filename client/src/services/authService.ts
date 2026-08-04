import axios from "axios";

// Base URL for the backend API
const API_URL = "http://localhost:3000/auth";

interface UserData {
  email: string;
  password: string;
  role?: "adopter" | "shelter";
}

interface AuthResponse {
  token: string;
  role?: "adopter" | "shelter";
}

export const register = async (
  userData: UserData
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/register`,
    userData
  );
  return response.data;
};

export const login = async (
  userData: UserData
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/login`,
    userData
  );
  if (response.data.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
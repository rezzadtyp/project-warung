import api from "../api";

export interface AuthResponse {
  id: string;
  publicKey: string;
  token: string;
}

export const loginWithWallet = async (
  publicKey: string
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/me", { publicKey });

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }

    return data;
  } catch (error) {
    // Clear any existing auth data on error
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    throw error;
  }
};

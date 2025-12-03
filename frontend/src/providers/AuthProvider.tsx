import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { loginWithWallet, type AuthResponse } from "@/api/auth/me";

interface AuthContextType {
  user: AuthResponse | null;
  login: (publicKey: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized logout function to prevent infinite loops
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  }, []);

  // Listen for auth:logout events from api interceptor
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout]);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("jwt");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Validate the stored user has required fields
          if (parsedUser.id && parsedUser.publicKey && parsedUser.token) {
            setUser(parsedUser);
          } else {
            // Invalid stored data, clear it
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Failed to parse stored user", error);
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (publicKey: string) => {
    try {
      setIsLoading(true);
      const data = await loginWithWallet(publicKey);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error("Login failed", error);
      // Clear any partial auth state
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!user.token;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const response = await getCurrentUser();
          console.log("Restore session response:", response.data);
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            console.log("Session restore failed:", response.data.message);
            logout();
          }
        } catch (error) {
          console.error(
            "Error restoring session:",
            error.response?.data || error.message
          );
          logout();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    console.log("Login:", { user: userData, token: authToken });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("Logged out");
  };

  const updateUser = (updatedUser) => {
    console.log("Updating user in context:", updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
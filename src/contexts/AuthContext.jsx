import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("isGuest") === "true"
  );

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const response = await getCurrentUser();
          console.log("Restore session response:", response.data);
          if (response.data.success) {
            setUser(response.data.data);
            setIsGuest(false);
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
      } else if (isGuest) {
        // Restore guest session
        setUser({
          id: "guest",
          username: "Guest User",
          role: "guest",
        });
      }
      setLoading(false);
    };
    restoreSession();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsGuest(false);
    localStorage.setItem("token", authToken);
    localStorage.removeItem("isGuest");
    console.log("Login:", { user: userData, token: authToken });
  };

  const loginAsGuest = () => {
    setUser({
      id: "guest",
      username: "Guest User",
      role: "guest",
    });
    setToken(null);
    setIsGuest(true);
    localStorage.removeItem("token");
    localStorage.setItem("isGuest", "true");
    console.log("Logged in as guest");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    console.log("Logged out");
  };

  const updateUser = (updatedUser) => {
    console.log("Updating user in context:", updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        loading,
        isGuest,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

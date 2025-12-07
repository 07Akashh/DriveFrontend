import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import socketService from "../services/socketService";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = Cookies.get("accessToken");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setAccessToken(token);
          setUser(parsedUser);
          // Connect socket with user ID
          if (parsedUser._id || parsedUser.id) {
            socketService.connect(parsedUser._id || parsedUser.id);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData) => {
    const { accessToken, ...rest } = userData;

    // Store in storage
    Cookies.set("accessToken", accessToken, { expires: 7 });
    localStorage.setItem("user", JSON.stringify(rest));

    // Update state
    setAccessToken(accessToken);
    setUser(rest);

    // Connect socket
    if (rest._id || rest.id) {
      socketService.connect(rest._id || rest.id);
    }
  };

  const logout = () => {
    // Clear storage
    Cookies.remove("accessToken");
    localStorage.removeItem("user");

    // Clear state
    setAccessToken(null);
    setUser(null);

    // Disconnect socket
    socketService.disconnect();
  };

  const value = {
    user,
    accessToken,
    isLoggedIn: !!accessToken,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

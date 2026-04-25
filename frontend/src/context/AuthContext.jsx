import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    // save user details to local storage
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // remove user details on logout
    localStorage.removeItem("user");
    setUser(null);
  };

  const authFetch = (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
    };

    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

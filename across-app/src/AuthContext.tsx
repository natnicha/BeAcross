import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Define the initial context value matching the interface
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    setIsAuthenticated(!!token);
    // This next line ensures the page doesn't redirect if the token is present
    // but make sure it's handled gracefully to avoid a loop or unwanted behavior
    if (token && window.location.pathname === '/studentprofile') {
      sessionStorage.setItem('reloadingAfterLogin', 'false'); // This line prevents redirection loop
    }
  }, [window.location.pathname]); // Consider dependencies carefully

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
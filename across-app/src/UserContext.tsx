import React, { createContext, useState, useContext } from 'react';

// Define the type for the context value
interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with an initial undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);



// Custom hook for using this context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Define the type for the provider's props
type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
      sessionStorage.getItem('jwtToken') !== null
    );
  
    return (
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {children}
      </UserContext.Provider>
    );
  };
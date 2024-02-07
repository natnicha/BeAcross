import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopupContextType {
  isLoginPopupOpen: boolean;
  isRegisterPopupOpen: boolean;
  isForgotPasswordPopupOpen: boolean;
  openLoginPopup: () => void;
  openRegisterPopup: () => void;
  openForgotPasswordPopup: () => void;
  closeAllPopups: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
  children: ReactNode;
}

export const usePopups = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopups must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isForgotPasswordPopupOpen, setIsForgotPasswordPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
    setIsRegisterPopupOpen(false);
    setIsForgotPasswordPopupOpen(false);
  };

  const openRegisterPopup = () => {
    setIsRegisterPopupOpen(true);
    setIsLoginPopupOpen(false);
  };

  const openForgotPasswordPopup = () => {
    console.log("Opening Forgot Password Popup");
    setIsLoginPopupOpen(false);
    setIsForgotPasswordPopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsRegisterPopupOpen(false);
    setIsForgotPasswordPopupOpen(false);
  };

  return (
    <PopupContext.Provider value={{
      isLoginPopupOpen,
      isRegisterPopupOpen,
      isForgotPasswordPopupOpen,
      openLoginPopup,
      openRegisterPopup,
      openForgotPasswordPopup,
      closeAllPopups,
    }}>
      {children}
    </PopupContext.Provider>
  );
};
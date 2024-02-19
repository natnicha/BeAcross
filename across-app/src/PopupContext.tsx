import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopupContextType {
  isLoginPopupOpen: boolean;
  isRegisterPopupOpen: boolean;
  isForgotPasswordPopupOpen: boolean;
  openLoginPopup: () => void;
  openRegisterPopup: () => void;
  openForgotPasswordPopup: () => void;
  closeAllPopups: () => void;
  isModuleDetailPopupOpen: boolean;
  openModuleDetailPopup: () => void;
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
  const [isModuleDetailPopupOpen, setIsModuleDetailPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
    setIsRegisterPopupOpen(false);
    setIsForgotPasswordPopupOpen(false);
    document.body.classList.add('no-scroll');
  };

  const openRegisterPopup = () => {
    setIsRegisterPopupOpen(true);
    setIsLoginPopupOpen(false);
    document.body.classList.add('no-scroll');
  };

  const openForgotPasswordPopup = () => {
    console.log("Opening Forgot Password Popup");
    setIsLoginPopupOpen(false);
    setIsForgotPasswordPopupOpen(true);
    document.body.classList.add('no-scroll');
  };

  const openModuleDetailPopup = () => {
    setIsModuleDetailPopupOpen(true);
    document.body.classList.add('no-scroll');
  };

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsRegisterPopupOpen(false);
    setIsForgotPasswordPopupOpen(false);
    setIsModuleDetailPopupOpen(false);
    document.body.classList.remove('no-scroll');
  };

  return (
    <PopupContext.Provider value={{
      isLoginPopupOpen,
      isRegisterPopupOpen,
      isForgotPasswordPopupOpen,
      isModuleDetailPopupOpen,
      openLoginPopup,
      openRegisterPopup,
      openForgotPasswordPopup,
      openModuleDetailPopup,
      closeAllPopups,
    }}>
      {children}
    </PopupContext.Provider>
  );
};
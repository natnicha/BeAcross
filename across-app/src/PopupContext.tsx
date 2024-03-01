import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SuggestionItem } from './services/suggestionServices';

interface PopupContextType {
  isLoginPopupOpen: boolean;
  isRegisterPopupOpen: boolean;
  isForgotPasswordPopupOpen: boolean;
  openLoginPopup: () => void;
  openRegisterPopup: () => void;
  openForgotPasswordPopup: () => void;
  closeAllPopups: () => void;
  isModuleDetailPopupOpen: boolean;
  openModuleDetailPopup: (module_id: string) => void;
  isCompareModuleDetailPopupOpen: boolean;
  openCompareModuleDetailPopup: (module_ids: string[]) => void;
  isSuggestionPopupOpen: boolean;
  openSuggestionPopup: (suggestionItems: SuggestionItem[]) => void;
  isModuleDetailFromSuggestionPopup: boolean;
  openModuleDetailFromSuggestionPopup: () => void;
  isCompareDetailFromSuggestionPopup: boolean;
  openCompareDetailFromSuggestionPopup: () => void;
  closeEverythingThatOpenFromSuggestionPopup: () => void;
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
  const [isCompareModuleDetailPopupOpen, setIsCompareModuleDetailPopupOpen] = useState(false);
  const [isSuggestionPopupOpen, setIsSuggestionPopupOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentModuleIds, setCurrentModuleIds] = useState<string[]>([]);
  const [suggestionItems, setSuggestionItems] = useState<SuggestionItem[]>([]);
  const [isModuleDetailFromSuggestionPopup, setIsModuleDetailFromSuggestionPopup] = useState(false);
  const [isCompareDetailFromSuggestionPopup, setIsCompareDetailFromSuggestionPopup] = useState(false);

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

  const openModuleDetailPopup = (module_id: string) => {
    setCurrentModuleId(module_id); // Store the current module_id
    setIsModuleDetailPopupOpen(true);
    document.body.classList.add('no-scroll');
  };

  const closeAllPopups = () => {
    setIsLoginPopupOpen(false);
    setIsRegisterPopupOpen(false);
    setIsForgotPasswordPopupOpen(false);
    setIsModuleDetailPopupOpen(false);
    setIsCompareModuleDetailPopupOpen(false);
    setIsSuggestionPopupOpen(false);
    setIsModuleDetailFromSuggestionPopup(false);
    setIsCompareDetailFromSuggestionPopup(false);
    document.body.classList.remove('no-scroll');
  };

  const openSuggestionPopup = (items: SuggestionItem[]) => {
    setSuggestionItems(items); // Store the suggestion items
    setIsSuggestionPopupOpen(true);
    document.body.classList.add('no-scroll');
  };

  const openCompareModuleDetailPopup = (module_ids: string[]) => {
    setCurrentModuleIds(module_ids); // Store the current module IDs
    setIsCompareModuleDetailPopupOpen(true);
    document.body.classList.add('no-scroll');
  };

  const openModuleDetailFromSuggestionPopup = () => {
    setIsModuleDetailFromSuggestionPopup(true);
  };

  const openCompareDetailFromSuggestionPopup = () => {
    setIsCompareDetailFromSuggestionPopup(true);
  };

  const closeEverythingThatOpenFromSuggestionPopup = () => {
    setIsModuleDetailFromSuggestionPopup(false);
    setIsCompareDetailFromSuggestionPopup(false);
  };

  return (
    <PopupContext.Provider value={{
      isLoginPopupOpen,
      isRegisterPopupOpen,
      isForgotPasswordPopupOpen,
      isModuleDetailPopupOpen,
      isCompareModuleDetailPopupOpen,
      isSuggestionPopupOpen,
      openLoginPopup,
      openRegisterPopup,
      openForgotPasswordPopup,
      openModuleDetailPopup,
      openCompareModuleDetailPopup,
      openSuggestionPopup,
      closeAllPopups,
      closeEverythingThatOpenFromSuggestionPopup,
      openModuleDetailFromSuggestionPopup,
      isModuleDetailFromSuggestionPopup,
      openCompareDetailFromSuggestionPopup,
      isCompareDetailFromSuggestionPopup,
    }}>
      {children}
    </PopupContext.Provider>
  );
};

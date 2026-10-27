import React, { createContext, useContext, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  // Toasts are suppressed per user requirement: no visual toast banners anywhere
  const removeToast = useCallback(() => {}, []);
  const addToast = useCallback(() => '', []);

  const toast = {
    success: () => '',
    error: () => '',
    warning: () => '',
    info: () => ''
  };

  return (
    <NotificationContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
};

const defaultToast = {
  success: () => '',
  error: () => '',
  warning: () => '',
  info: () => ''
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      toast: defaultToast,
      addToast: () => '',
      removeToast: () => {}
    };
  }
  return context;
};

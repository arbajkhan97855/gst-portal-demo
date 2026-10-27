import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const PORTAL_CREDENTIALS = {
  username: '@samyakcomputerclasses123',
  password: 'samyak@123'
};

const DEFAULT_USER = {
  name: 'Rajesh Sharma',
  businessName: 'Samyak Infotech Solutions Pvt Ltd',
  tradeName: 'Samyak Tech Enterprises',
  gstin: '27AABCS1429B1Z8',
  pan: 'AABCS1429B',
  email: 'accounts@samyakinfotech.com',
  mobile: '+91 98765 43210',
  address: 'Unit 402, Samyak IT Park, Andheri East, Mumbai, Maharashtra - 400069',
  state: 'Maharashtra',
  stateCode: '27',
  district: 'Mumbai Suburban',
  businessType: 'Private Limited Company',
  constitution: 'Company',
  registrationDate: '12-Jul-2017',
  role: 'taxpayer',
  cashBalance: 48520,
  creditBalance: 142850,
  liabilityBalance: 24500
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gst_portal_auth') === 'true' || localStorage.getItem('gst_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gst_taxpayer_profile');
      if (saved) {
        return { ...DEFAULT_USER, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading taxpayer profile from localStorage:', e);
    }
    return DEFAULT_USER;
  });

  // Sync profile to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('gst_taxpayer_profile', JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  // Synchronize across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gst_taxpayer_profile' && e.newValue) {
        try {
          setCurrentUser({ ...DEFAULT_USER, ...JSON.parse(e.newValue) });
        } catch (err) {}
      }
      if (e.key === 'gst_portal_auth') {
        setIsAuthenticated(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (username, password, remember = true) => {
    const valid = 
      (username.trim().toLowerCase() === PORTAL_CREDENTIALS.username.toLowerCase() || username.trim() === 'admin') &&
      password.trim() === PORTAL_CREDENTIALS.password;

    if (valid) {
      setIsAuthenticated(true);
      localStorage.setItem('gst_portal_auth', 'true');
      if (remember) {
        localStorage.setItem('gst_portal_remember', username);
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Use @samyakcomputerclasses123 / samyak@123' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gst_portal_auth');
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedFields, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem('gst_taxpayer_profile', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      logout,
      updateProfile,
      credentials: PORTAL_CREDENTIALS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    return sessionStorage.getItem('isAuth') === 'true';
  });

  const login = (username, password) => {
    const user = (username || '').trim();
    const pass = (password || '').trim();

    if (user === 'admin' && pass === 'Admin2026!') {
      sessionStorage.setItem('isAuth', 'true');
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('isAuth');
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

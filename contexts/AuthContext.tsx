import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });

    return () => unsubscribe();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    if (!auth) {
      console.error("Firebase auth no está configurado");
      return false;
    }

    // We assume the user's email is set to their admin email. For simplicity, we can hardcode
    // the expected admin email here, or require them to type both. For this specific use case 
    // where they just input a password, we'll hardcode the admin email.
    const adminEmail = "benosiliotomas@gmail.com";

    try {
      await signInWithEmailAndPassword(auth, adminEmail, password);
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

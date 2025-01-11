"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  username: string;
  id: string;
  setUsername: (username: string) => void;
  setId: (id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');

  const handleSetUsername = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleSetId = (newId: string) => {
    setId(newId);
  };

  const logout = () => {
    setUsername('');
    setId('');
  };

  return (
    <UserContext.Provider value={{
      username,
      id,
      setUsername: handleSetUsername,
      setId: handleSetId,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}
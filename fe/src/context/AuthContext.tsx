'use client';

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  id: string | null;
  username: string | null;
  setId: (id: string | null) => void;
  setUsername: (username: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  id: null,
  username: null,
  setId: () => {},
  setUsername: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ id, username, setId, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Export AuthContext explicitly
export { AuthContext };

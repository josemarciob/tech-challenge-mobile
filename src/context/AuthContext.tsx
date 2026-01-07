import React, { createContext, useContext, useState } from 'react'
import { api, setAuthToken } from '../services/api'

type User = { id: string; name: string; role: 'professor' | 'aluno' };

type AuthContextType = {
  user?: User;
  token?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    setAuthToken(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

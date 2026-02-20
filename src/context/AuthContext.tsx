import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { api, setAuthToken } from "../services/api";

export type Role = "student" | "professor";

export interface User {
  id: number; 
  name: string;
  email: string;
  role: Role;
  xp: number;
  level: number;           
  coins: number;               
  completedActivities: number; 
  maxStorage: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; 
  updateUser: (data: Partial<User>) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem("@TechChallenge:user"),
          AsyncStorage.getItem("@TechChallenge:token"),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setAuthToken(storedToken);
        }
      } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
      } finally {
        setLoading(false);
      }
    }

    loadStoredData();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password: password.trim() 
      });

      const { token: apiToken, user: apiUser } = data;

      setToken(apiToken);
      setUser(apiUser);
      setAuthToken(apiToken); 

      await Promise.all([
        AsyncStorage.setItem("@TechChallenge:user", JSON.stringify(apiUser)),
        AsyncStorage.setItem("@TechChallenge:token", apiToken),
      ]);
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(undefined); 
    await AsyncStorage.multiRemove([
      "@TechChallenge:user",
      "@TechChallenge:token"
    ]);
  };

  const updateUser = async (newData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...newData };
      
      AsyncStorage.setItem("@TechChallenge:user", JSON.stringify(updatedUser));
      
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
};
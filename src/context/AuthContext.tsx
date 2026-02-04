import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, setAuthToken } from "../services/api";
import { jwtDecode } from "jwt-decode";

export type Role = "aluno" | "professor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  xp: number;
  nivel: number;
  moedas: number;
  conquistas: string[];
  atividades: any[];
}

interface TokenPayload {
  id: number;
  role: string;
  name: string;
  email?: string;
  xp?: number;
  nivel?: number;
  moedas?: number;
  conquistas?: string[];
  atividades: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🔥 começa carregando

  useEffect(() => {
    async function restoreSession() {
      try {
        // AsyncStorage no futuro
      } catch (e) {
        console.warn("Erro ao restaurar sessão:", e);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const token = data.token;
      setToken(token);
      setAuthToken(token);

      const decoded = jwtDecode<TokenPayload>(token);

      setUser({
        id: String(decoded.id),
        name: decoded.name,
        email: decoded.email || "",
        role: decoded.role.toLowerCase() as Role,
        xp: decoded.xp ?? 0,
        nivel: decoded.nivel ?? 1,
        moedas: decoded.moedas ?? 0,
        conquistas: decoded.conquistas ?? [],
        atividades: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve estar dentro de AuthProvider");
  }
  return ctx;
};

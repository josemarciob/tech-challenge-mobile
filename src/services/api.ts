import axios from "axios";
import { Platform } from "react-native";

const LAN_IP = "192.168.0.29";

const candidates: string[] = Platform.OS === "android"
  ? ["http://10.0.2.2:3000", `http://${LAN_IP}:3000`, "http://localhost:3000"]
  : Platform.OS === "ios"
  ? ["http://localhost:3000", `http://${LAN_IP}:3000`]
  : ["http://localhost:3000", `http://${LAN_IP}:3000`];

const api = axios.create({ baseURL: candidates[0] });

async function probeUrl(url: string, timeout = 2000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(`${url}/posts`, { method: "GET", signal: (controller as any).signal });
    clearTimeout(id);
    return res.ok;
  } catch (err) {
    return false;
  }
}

(async () => {
  for (const c of candidates) {
    const ok = await probeUrl(c);
    if (ok) {
      api.defaults.baseURL = c;
      break;
    }
  }
})();

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api };

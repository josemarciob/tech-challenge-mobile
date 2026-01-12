import axios from "axios";
import { Platform } from "react-native";

// Fallback LAN IP (adjust if your PC IP changes)
const LAN_IP = "192.168.0.29";

// Choose baseURL based on runtime environment:
// - Android emulator (default emulator): 10.0.2.2
// - iOS simulator: localhost
// - Physical device: use LAN_IP
let baseURL = `http://${LAN_IP}:3000`;
if (Platform.OS === "android") baseURL = "http://10.0.2.2:3000";
else if (Platform.OS === "ios") baseURL = "http://localhost:3000";

const api = axios.create({ baseURL });

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api };

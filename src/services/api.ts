import axios from "axios";

// CONFIRA SE ESTE É O SEU IPV4 NO MOMENTO (no terminal: ipconfig)
// Se você desligar o PC, esse número pode mudar amanhã.
const LAN_IP = "192.168.0.29"; 

// seu server.ts: Porta 3000
const PORT = "3000"; 

const api = axios.create({
  // URL fixa e direta.
  baseURL: `http://${LAN_IP}:${PORT}`,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api };
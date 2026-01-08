import axios from "axios";

// IP da sua máquina na rede local
const api = axios.create({
  baseURL: "http://192.168.0.29:3000",
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api };

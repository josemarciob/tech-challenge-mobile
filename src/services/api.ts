import axios from "axios";

// ==========================================
// CONFIGURAÇÕES DE REDE
// ==========================================
const LAN_IP = process.env.LAN_IP; 
const PORT =  process.env.PORT; 

const api = axios.create({
  baseURL: `http://${LAN_IP}:${PORT}/api`,
  timeout: 10000, 
});

// ==========================================
// INTERFACES
// ==========================================
export interface ShopItem {
  id: number;
  name: string;
  icon: string;
  category: 'plant' | 'animal' | 'building';
  price: number;
  sellPrice: number; 
  unlockLevel: number;
}

export interface FarmDashboardResponse {
  stats: {
    name: string;            
    level: number;      
    xp: number;
    coins: number;       
    completedActivities: number; 
  };
  farm: any[];      
  warehouse: any[]; 
  config: any;
}

// ==========================================
// SEGURANÇA (JWT)
// ==========================================
export const setAuthToken = (token: string | null | undefined) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ==========================================
// SERVIÇOS DA FAZENDA
// ==========================================
export const FarmService = {
  
  // Dashboard principal da fazenda
  getDashboard: async (): Promise<FarmDashboardResponse> => {
    const response = await api.get('/farm/dashboard');
    return response.data;
  },

  // Itens disponíveis no mercado
  getShopItems: async (): Promise<ShopItem[]> => {
    const response = await api.get('/shop/items');
    return response.data;
  },

  // Comprar item (vai para o armazém)
  buyItem: async (itemId: number, quantity: number) => {
    const response = await api.post('/shop/buy', { itemId, quantity });
    return response.data;
  },

  // Colher planta no chão
  collectPlant: async (farmItemId: number) => {
    const response = await api.post('/farm/collect-plant', { farmItemId });
    return response.data;
  },

  // Colher animal (ex: ovo da galinha)
  collectAnimal: async (farmItemId: number) => {
    const response = await api.post('/farm/collect-animal', { farmItemId });
    return response.data;
  },

  // Colher todos os animais prontos de uma vez (Galinheiro)
  collectAllAnimals: async (farmItemIds: number[]) => {
    const response = await api.post('/farm/collect-all-animals', { farmItemIds });
    return response.data;
  },

  // Plantar 
  plant: async (itemId: number, quantity: number) => {
    const response = await api.post('/farm/plant', { itemId, quantity });
    return response.data;
  },

  // Vender item do armazém 
  sellItem: async (itemId: number, quantity: number) => {
    const response = await api.post('/farm/sell', { itemId, quantity });
    return response.data;
  }
};

export { api };
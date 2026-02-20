// ==========================================
// TIPOS BÁSICOS
// ==========================================

export type ItemCategory = 
  | 'plant' 
  | 'animal' 
  | 'building' 
  | 'consumable' 
  | 'decoration' 
  | 'resource';

export type FarmItemStatus = 'growing' | 'ready' | 'hungry' | 'built';

// ==========================================
// ESTRUTURAS DE CONFIGURAÇÃO E STATS
// ==========================================

export interface FarmConfig {
  animalTime: number;
  plantTime: number;
}

export interface FarmStats {
  nome: string; 
  coins: number;           
  level: number;           
  xp: number;
  maxStorage: number;
  completedActivities: number; 
  now?: number; 
}

// ==========================================
// DASHBOARD
// ==========================================

export interface FarmItem {
  id: number;
  itemId: number;
  name: string;
  category: ItemCategory;
  icon: string;
  status: FarmItemStatus; 
  
  growthTime?: number; 
  growthTimeSeconds?: number;
  
  lastFed?: string | Date | null;
  createdAt: string | Date;
}

export interface WarehouseItem {
  itemId: number;
  name: string;
  category: ItemCategory;
  icon: string;
  quantity: number;
  sellPrice: number;
}

export interface FarmDashboardResponse {
  stats: FarmStats;
  config: FarmConfig;
  farm: FarmItem[];
  warehouse: WarehouseItem[];
}

// ==========================================
// LOJAFARM
// ==========================================

export interface ShopItem {
  id: number;
  name: string;
  description: string | null;
  category: ItemCategory;
  icon: string;
  price: number;
  sellPrice: number;
  produces: string | null;
  unlockLevel: number;
  requiredActivities: number;
  growthTime: number | null;
}
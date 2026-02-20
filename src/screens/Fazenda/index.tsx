import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { FarmService } from '../../services/api';
import { styles, COLORS } from './styles';

// Componentes
import { FazendaHeader } from './components/FazendaHeader';
import { FazendaNav } from './components/FazendaNav';
import { FazendaGrid } from './components/FazendaGrid';
import { FazendaModals } from './components/FazendaModals';

export default function Fazenda() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<'none' | 'shop' | 'warehouse' | 'coop' | 'plant'>('none');
  const [shopCategory, setShopCategory] = useState<'plant' | 'animal' | 'building'>('plant');

  // Carregamento de Dados
  const loadData = useCallback(async () => {
    try {
      const response = await FarmService.getDashboard();
      setData(response);
      const shop = await FarmService.getShopItems();
      setShopItems(shop);
    } catch (e) { 
      console.error("Erro ao carregar fazenda:", e); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const closeModal = () => {
    setActiveModal('none');
    setShopCategory('plant'); 
  };

  const farmPlants = useMemo(() => data?.farm?.filter((f: any) => f.category === 'plant') || [], [data]);
  const activeChickens = useMemo(() => data?.farm?.filter((f: any) => f.icon === 'chicken') || [], [data]);
  const warehouseItems = useMemo(() => data?.warehouse?.filter((i: any) => i.quantity > 0) || [], [data]);
  const hasCoop = useMemo(() => data?.farm?.some((i: any) => i.category === 'building' && i.icon === 'coop'), [data]);

  const displayStats = useMemo(() => {
    const apiStats: any = data?.stats || {};
    return {
      coins: apiStats.coins ?? apiStats.moedas ?? user?.coins ?? 0,
      level: apiStats.level ?? apiStats.nivel ?? user?.level ?? 1,
      xp: apiStats.xp ?? user?.xp ?? 0,
      completedActivities: apiStats.atividadesConcluidas ?? user?.completedActivities ?? 0,
      maxStorage: apiStats.maxStorage ?? user?.maxStorage ?? 30 
    };
  }, [user, data]);

  const xpInfo = useMemo(() => {
    const nextXp = Math.floor(100 * Math.pow(1.65, displayStats.level - 1));
    const progress = Math.min((displayStats.xp / nextXp) * 100, 100);
    return { nextXp, progress };
  }, [displayStats]);

  // --- AÇÕES ---
  const handleCollectPlant = async (item: any) => {
    try {
      const res = await FarmService.collectPlant(item.id);
      if (res.success || res) {
        loadData();
        if (res.leveledUp) Alert.alert("LEVEL UP!", "Parabéns, seu nível aumentou!");
      }
    } catch (e: any) { Alert.alert("Erro", e.response?.data?.error || "Falha na colheita."); }
  };

  const handleCollectEggs = async (readyAnimals: any[]) => {
    try {
      const collectPromises = readyAnimals.map(animal => FarmService.collectAnimal(animal.id));
      await Promise.all(collectPromises);
      loadData(); 
      Alert.alert("Sucesso!", `Você recolheu ${readyAnimals.length} ovo(s)!`);
    } catch (error: any) { 
      Alert.alert("Aviso", error?.response?.data?.error || error?.response?.data?.message || "Falha ao colher ovos."); 
    }
  };

  const handleBuyItem = async (item: any, quantidadeSelecionada: number) => {
    try { 
      await FarmService.buyItem(item.id, quantidadeSelecionada); 
      loadData(); 
      Alert.alert("Sucesso!", `Você comprou ${quantidadeSelecionada}x ${item.name}!`);
    } catch (e: any) { Alert.alert("Erro", e?.response?.data?.error || e.message || "Erro ao comprar."); }
  };

  const handleSell = async (itemId: number) => {
    try {
      const res = await FarmService.sellItem(itemId, 1);
      if (res.success || res) loadData();
    } catch (e: any) { Alert.alert("Erro", e.response?.data?.error || "Falha ao vender item."); }
  };

  const handlePlantAction = async (item: any) => {
    try {
      const res = await FarmService.plant(item.itemId, 1);
      if (res.success || res) { closeModal(); loadData(); }
    } catch (e: any) { Alert.alert("Ops!", e.response?.data?.error || "Verifique o espaço disponível."); }
  };

  const handleReleaseChicken = async () => {
    const chicken = warehouseItems.find((i: any) => i.icon === 'chicken' || i.name.toLowerCase().includes('galinha'));
    if (!chicken) return Alert.alert("Ops!", "Você não tem galinhas no armazém.");
    try {
      const res = await FarmService.plant(chicken.itemId, 1);
      if (res.success || res) loadData(); 
    } catch (e: any) { Alert.alert("Ops!", e.response?.data?.error || "Espaço insuficiente."); }
  };

  const inventoryChickensExist = (items: any[]) => {
    return items.some(i => (i.icon === 'chicken' || i.name.toLowerCase().includes('galinha')) && i.quantity > 0);
  };

  if (loading && !data) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color={COLORS.accent.blue} /></View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        
        <ScrollView 
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        >
          <View style={styles.headerContainer}>
            <FazendaHeader user={user} displayStats={displayStats} xpInfo={xpInfo} />
            <FazendaNav hasCoop={hasCoop} warehouseCount={warehouseItems.length} onOpenModal={setActiveModal} />
          </View>

          <FazendaGrid farmPlants={farmPlants} onCollect={handleCollectPlant} onPlant={() => setActiveModal('plant')} />
        </ScrollView>
      </SafeAreaView>

      <FazendaModals 
        activeModal={activeModal}
        closeModal={closeModal}
        shopCategory={shopCategory}
        setShopCategory={setShopCategory}
        shopItems={shopItems}
        warehouseItems={warehouseItems}
        activeChickens={activeChickens}
        displayStats={displayStats}
        data={data}
        handleCollectEggs={handleCollectEggs}
        handleReleaseChicken={handleReleaseChicken}
        handleBuyItem={handleBuyItem}
        handleSell={handleSell}
        handlePlantAction={handlePlantAction}
        inventoryChickensExist={inventoryChickensExist}
      />
    </View>
  );
}
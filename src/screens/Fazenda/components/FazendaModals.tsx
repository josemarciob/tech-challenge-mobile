import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native';
import { XCircle, Package, Storefront } from 'phosphor-react-native';
import { MotiView } from 'moti';

import { styles, COLORS } from '../styles';
import { getGameAsset } from '../assets';
import { ShopItemCard } from './ShopItem';
import { LiveCoopProductionCard } from './CoopCard';

export function FazendaModals({
  activeModal,
  closeModal,
  shopCategory,
  setShopCategory,
  shopItems,
  warehouseItems,
  activeChickens,
  displayStats,
  data,
  handleCollectEggs,
  handleReleaseChicken,
  handleBuyItem,
  handleSell,
  handlePlantAction,
  inventoryChickensExist
}: any) {
  
  return (
    <>
     {/* MODAL: GALINHEIRO */}
      <Modal visible={activeModal === 'coop'} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <MotiView from={{ translateY: 300 }} animate={{ translateY: 0 }} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={styles.modalTitle}>Galinheiro</Text>
              <TouchableOpacity onPress={closeModal}><XCircle size={28} color={COLORS.text.muted} weight="fill" /></TouchableOpacity>
            </View>

            {/*CAPACIDADE DO GALINHEIRO */}
            {(() => {
              const maxCoopCapacity = 6; 
              const currentChickens = activeChickens.length;
              const coopPercent = Math.min((currentChickens / maxCoopCapacity) * 100, 100);
              const isCoopFull = currentChickens >= maxCoopCapacity;

              return (
                <View style={{ marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.text.muted }}>GALINHAS ALOJADAS</Text>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: isCoopFull ? COLORS.accent.red : COLORS.accent.blue }}>
                      {currentChickens} / {maxCoopCapacity}
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <MotiView 
                      from={{ width: '0%' }} 
                      animate={{ width: `${coopPercent}%` }} 
                      transition={{ type: 'timing', duration: 800 }}
                      style={{ height: '100%', backgroundColor: isCoopFull ? COLORS.accent.red : COLORS.accent.blue }} 
                    />
                  </View>
                </View>
              );
            })()}
            
            <LiveCoopProductionCard activeChickens={activeChickens} onCollectAll={handleCollectEggs} />

            {/* AÇÕES DO GALINHEIRO */}
            {activeChickens.length < 6 ? (
              <View style={{ marginTop: 20 }}>
                {inventoryChickensExist(warehouseItems) ? (
                  <TouchableOpacity style={[styles.shopBtn, { backgroundColor: COLORS.accent.blue, width: '100%', paddingVertical: 14 }]} onPress={handleReleaseChicken} activeOpacity={0.7}>
                    <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 13, textAlign: 'center' }}>+ SOLTAR 1 GALINHA DO ARMAZÉM</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={{ backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => { closeModal(); setTimeout(() => { /* ShopAberto */ }, 100); }} activeOpacity={0.7}>
                    <Text style={{ color: COLORS.text.muted, fontWeight: '800', fontSize: 12 }}>Espaço disponível no galinheiro</Text>
                    <Text style={{ color: COLORS.accent.blue, fontWeight: '900', fontSize: 13, marginTop: 4 }}>COMPRAR GALINHAS NO MERCADO</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              /* MENSAGEM QUANDO ESTIVER LOTADO */
              <View style={{ marginTop: 20, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2', alignItems: 'center' }}>
                <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 13 }}>GALINHEIRO LOTADO MAX 6</Text>
              </View>
            )}

            {/*UPGRADE */}
            <TouchableOpacity 
              style={{ 
                marginTop: 12, 
                backgroundColor: displayStats.coins >= 5000 ? '#FEFCE8' : '#F8FAFC', 
                paddingVertical: 14, 
                borderRadius: 16, 
                borderWidth: 1, 
                borderColor: displayStats.coins >= 5000 ? '#FDE047' : '#E2E8F0', 
                alignItems: 'center' 
              }}
              activeOpacity={0.7}
              onPress={() => {
                if (displayStats.coins < 5000) {
                  Alert.alert("Sem Saldo", "Precisas de 5000 moedas para evoluir o teu galinheiro.");
                } else {
                  Alert.alert(
                    "Evoluir Galinheiro", 
                    "Desejas gastar 5000 moedas para evoluir o teu galinheiro e aumentar a capacidade?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      { 
                        text: "Evoluir", 
                        onPress: () => Alert.alert("Evolução", "Funcionalidade de evolução em desenvolvimento! Em breve irá processar esta compra.") 
                      }
                    ]
                  );
                }
              }}
            >
              <Text style={{ 
                color: displayStats.coins >= 5000 ? '#D97706' : '#94A3B8', 
                fontWeight: '900', 
                fontSize: 13 
              }}>
                EVOLUIR GALINHEIRO (5000 MOEDAS)
              </Text>
            </TouchableOpacity>

          </MotiView>
        </View>
      </Modal>

      {/* MODAL: MERCADO */}
      <Modal visible={activeModal === 'shop'} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <MotiView from={{ translateY: 300 }} animate={{ translateY: 0 }} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={styles.modalTitle}>Mercado Rural</Text>
              <TouchableOpacity onPress={closeModal}><XCircle size={28} color={COLORS.text.muted} weight="fill" /></TouchableOpacity>
            </View>
            
            <View style={styles.tabsContainer}>
              {(['plant', 'animal', 'building'] as const).map((cat: string) => (
                <TouchableOpacity key={cat} style={[styles.tabItem, shopCategory === cat && styles.tabItemActive]} onPress={() => setShopCategory(cat as any)}>
                  <Text style={[styles.tabText, shopCategory === cat && { color: COLORS.text.main, fontWeight: '900' }]}>
                    {cat === 'plant' ? 'Sementes' : cat === 'animal' ? 'Animais' : 'Estruturas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={shopItems.filter((i: any) => i.category === shopCategory)}
              keyExtractor={(item: any) => String(item.id)}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isLockedLevel = displayStats.level < (item.unlockLevel || 1);
                const requiredActivities = item.requiredActivities || 0;
                const isLockedActivity = displayStats.completedActivities < requiredActivities;

                const ownedInFarm = data?.farm?.filter((f: any) => f.itemId === item.id).length || 0;
                const ownedInWarehouse = warehouseItems.find((w: any) => w.itemId === item.id)?.quantity || 0;
                const totalOwned = ownedInFarm + ownedInWarehouse;
                
                const maxAllowed = item.maxQuantity !== null ? Math.max(0, item.maxQuantity - totalOwned) : 99;
                const isMaxCapacity = item.maxQuantity !== null && totalOwned >= item.maxQuantity;

                let missingDependency = false;
                if (item.requiresBuildingId) missingDependency = !data?.farm?.some((f: any) => f.itemId === item.requiresBuildingId);

                const isDisabled = isLockedLevel || isLockedActivity || isMaxCapacity || missingDependency;
                
                let disableReason = "";
                if (isLockedLevel) disableReason = `REQUER NÍVEL ${item.unlockLevel}`;
                else if (isLockedActivity) disableReason = `FAÇA +${requiredActivities - displayStats.completedActivities} ATIV.`;
                else if (missingDependency) disableReason = "REQUER ESTRUTURA";
                else if (isMaxCapacity) disableReason = "LIMITE ATINGIDO";

                return (
                  <ShopItemCard 
                    item={item} isLockedLevel={isLockedLevel} isLockedActivity={isLockedActivity}
                    requiredActivities={requiredActivities} isDisabled={isDisabled} disableReason={disableReason}
                    userCoins={displayStats.coins} maxAllowed={maxAllowed} 
                    onBuy={(quantidadeSelecionada: number) => handleBuyItem(item, quantidadeSelecionada)}
                  />
                );
              }}
            />
          </MotiView>
        </View>
      </Modal>

      {/* MODAL: ARMAZÉM */}
      <Modal visible={activeModal === 'warehouse'} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <MotiView from={{ translateY: 300 }} animate={{ translateY: 0 }} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.modalTitle}>Seu Armazém</Text>
              <TouchableOpacity onPress={closeModal}><XCircle size={28} color={COLORS.text.muted} weight="fill" /></TouchableOpacity>
            </View>

            {/* CAPACIDADE DO ARMAZÉM */}
            {(() => {
              const currentStorage = warehouseItems.reduce((total: number, item: any) => total + (item.quantity || 0), 0);
              
           
              const maxStorage = displayStats.maxStorage || 30; 
              
              const storagePercent = Math.min((currentStorage / maxStorage) * 100, 100);
              const isFull = currentStorage >= maxStorage;

              return (
                <View style={{ marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.text.muted }}>ESPAÇO OCUPADO</Text>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: isFull ? COLORS.accent.red : COLORS.accent.blue }}>
                      {currentStorage} / {maxStorage}
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <MotiView 
                      from={{ width: '0%' }} 
                      animate={{ width: `${storagePercent}%` }} 
                      transition={{ type: 'timing', duration: 800 }}
                      style={{ height: '100%', backgroundColor: isFull ? COLORS.accent.red : COLORS.accent.blue }} 
                    />
                  </View>
                </View>
              );
            })()}

            {warehouseItems.length === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}>
                <Package size={64} color="#CBD5E1" weight="duotone" />
                <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.text.main, fontWeight: '800' }}>Armazém Vazio</Text>
                <Text style={{ marginTop: 8, fontSize: 13, color: COLORS.text.muted, fontWeight: '500', textAlign: 'center' }}>Suas sementes e colheitas{"\n"}aparecerão aqui.</Text>
              </View>
            ) : (
              <FlatList
                data={warehouseItems} keyExtractor={(item: any) => String(item.itemId)} numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.inventoryGridCard}>
                    <Text style={{ fontSize: 10, fontWeight: '800', textAlign: 'right' }}>Qtd: {item.quantity}</Text>
                    <Image source={getGameAsset(item.icon, item.name)} style={{ width: 50, height: 50, alignSelf: 'center', marginVertical: 10 }} resizeMode="contain" />
                    <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 12, marginBottom: 10 }} numberOfLines={1}>{item.name}</Text>
                    <TouchableOpacity style={[styles.shopBtn, { backgroundColor: '#FFFBEB', marginTop: 'auto' }]} onPress={() => handleSell(item.itemId)}>
                      <Text style={{ color: '#D97706', fontSize: 10, fontWeight: '900' }}>VENDER</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </MotiView>
        </View>
      </Modal>
      
      {/* MODAL: PLANTAR */}
      <Modal visible={activeModal === 'plant'} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <MotiView from={{ translateY: 300 }} animate={{ translateY: 0 }} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={styles.modalTitle}>O que deseja plantar?</Text>
              <TouchableOpacity onPress={closeModal}><XCircle size={28} color={COLORS.text.muted} weight="fill" /></TouchableOpacity>
            </View>
            
            {(() => {
              const seeds = warehouseItems.filter((i: any) => i.category === 'plant' && i.quantity > 0);
              
              if (seeds.length === 0) {
                return (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                    <Storefront size={64} color="#CBD5E1" weight="duotone" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.text.main, fontWeight: '800' }}>Sem sementes disponíveis</Text>
                    <Text style={{ marginTop: 8, fontSize: 13, color: COLORS.text.muted, fontWeight: '500', textAlign: 'center', marginBottom: 24 }}>Você precisa de sementes para usar a terra.{"\n"}Dê uma passada no Mercado!</Text>
                    <TouchableOpacity style={[styles.shopBtn, { backgroundColor: COLORS.accent.blue, width: '80%', paddingVertical: 14 }]} onPress={() => { closeModal(); setTimeout(() => { /* ShopAberto */ }, 100); }}>
                      <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 13, textAlign: 'center' }}>IR PARA O MERCADO</Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <FlatList
                  data={seeds} keyExtractor={(item: any) => String(item.itemId)} numColumns={2}
                  columnWrapperStyle={{ justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.inventoryGridCard}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.accent.blue, backgroundColor: '#EFF6FF', alignSelf: 'flex-end', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginBottom: 4 }}>
                        {item.quantity} disp.
                      </Text>
                      <Image source={getGameAsset(item.icon, item.name)} style={{ width: 50, height: 50, alignSelf: 'center', marginBottom: 10 }} resizeMode="contain" />
                      <Text style={{ textAlign: 'center', fontWeight: '800', marginBottom: 10 }} numberOfLines={1}>{item.name}</Text>
                      <TouchableOpacity style={[styles.shopBtn, { backgroundColor: COLORS.accent.blue, marginTop: 'auto' }]} onPress={() => handlePlantAction(item)}>
                        <Text style={{ color: '#FFF', fontWeight: '900', textAlign: 'center' }}>PLANTAR</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              );
            })()}
          </MotiView>
        </View>
      </Modal>
    </>
  );
}
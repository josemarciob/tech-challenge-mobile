import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Timer, Bird } from 'phosphor-react-native';
import { MotiView } from 'moti';

// Usamos os estilos centralizados do novo styles.ts!
import { styles, COLORS } from '../styles'; 
import { getGameAsset } from '../assets';

const formatCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
};

export const LiveCoopProductionCard = memo(({ activeChickens, onCollectAll }: any) => {
  const [now, setNow] = useState<number>(Date.now());
  const maxCapacity = 6; 

  // 🔥 SOLUÇÃO: Lê o tempo correto que o Backend mandou (ou 300s/5min por padrão de segurança)
  const getCycleTime = (chicken: any) => chicken.growthTimeSeconds || 300;

  const readyChickens = activeChickens.filter((c: any) => {
    const ref = c.lastFed ? new Date(c.lastFed).getTime() : new Date(c.createdAt).getTime();
    return Math.floor((now - ref) / 1000) >= getCycleTime(c);
  });

  const readyCount = readyChickens.length;
  const isFullCapacity = readyCount >= activeChickens.length && activeChickens.length > 0;

  useEffect(() => {
    if (activeChickens.length === 0 || isFullCapacity) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeChickens.length, isFullCapacity]);

  let nextTimeLeft = 0;
  if (!isFullCapacity && activeChickens.length > 0) {
      const producing = activeChickens.filter((c: any) => {
         const ref = c.lastFed ? new Date(c.lastFed).getTime() : new Date(c.createdAt).getTime();
         return Math.floor((now - ref) / 1000) < getCycleTime(c);
      });
      
      const nextChicken = producing.sort((a: any, b: any) => {
         const timeA = a.lastFed ? new Date(a.lastFed).getTime() : new Date(a.createdAt).getTime();
         const timeB = b.lastFed ? new Date(b.lastFed).getTime() : new Date(b.createdAt).getTime();
         return timeA - timeB; 
      })[0];

      if (nextChicken) {
          const ref = nextChicken.lastFed ? new Date(nextChicken.lastFed).getTime() : new Date(nextChicken.createdAt).getTime();
          nextTimeLeft = Math.max(0, getCycleTime(nextChicken) - Math.floor((now - ref) / 1000));
      }
  }

  if (activeChickens.length === 0) {
    return (
      <MotiView from={{opacity: 0, translateY: 10}} animate={{opacity: 1, translateY: 0}} style={styles.emptyStateCard}>
         <Bird size={48} color="#CBD5E1" weight="duotone" />
         <Text style={styles.emptyStateText}>Nenhuma galinha produzindo.</Text>
         <Text style={styles.emptyStateSub}>Solte as galinhas do armazém para iniciar.</Text>
      </MotiView>
    );
  }

  return (
    <MotiView from={{opacity: 0, translateY: 10}} animate={{opacity: 1, translateY: 0}} style={styles.productionCard}>
       
       <View style={styles.eggVisualizerRow}>
          {Array.from({ length: maxCapacity }).map((_, i) => {
             const isEggReady = i < readyCount;
             const isSlotActive = i < activeChickens.length;
             return (
                <View key={i} style={styles.eggIconWrapper}>
                   <Image 
                      source={getGameAsset('egg_icon', 'ovo')} 
                      style={[styles.eggIconImg, !isEggReady && styles.eggIconDimmed, !isSlotActive && { opacity: 0.05 }]} 
                      resizeMode="contain" 
                   />
                </View>
             );
          })}
       </View>

       <Text style={styles.productionStatusText}>{readyCount} / {activeChickens.length} Ovos Prontos</Text>

       {isFullCapacity ? (
          <View style={styles.fullBasketAlert}>
             <Text style={styles.fullBasketText}>Produção máxima atingida. Colha para continuar!</Text>
          </View>
       ) : (
          <View style={styles.timerPillLarge}>
             <Timer size={18} color={COLORS.accent.gold} weight="fill" />
             <Text style={styles.timerPillText}>
                 Próximo ovo em: <Text style={styles.timerPillTime}>{formatCountdown(nextTimeLeft)}</Text>
             </Text>
          </View>
       )}

       {readyCount > 0 && (
          <TouchableOpacity style={styles.btnCollectLarge} onPress={() => onCollectAll(readyChickens)} activeOpacity={0.8}>
             <Text style={styles.btnCollectLargeText}>COLHER OVOS ({readyCount})</Text>
          </TouchableOpacity>
       )}
    </MotiView>
  );
});
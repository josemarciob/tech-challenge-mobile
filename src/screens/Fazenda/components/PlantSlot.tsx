import React, { useEffect, useState, memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Shovel, Timer } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { styles, COLORS } from '../styles';
import { getGrowingPlantArt } from '../assets';

const formatShortTime = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return 'Pronto';
  if (totalSeconds > 60) {
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes}m Restante`; 
  }
  return `${totalSeconds}s`; 
};

export const LivePlantSlot = memo(({ item, onCollect, onPlant }: any) => {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (!item) return;

    setNow(Date.now());

    const growthSec = item.growthTimeSeconds || (item.growthTime ? item.growthTime * 60 : 60);
    const refTime = new Date(item.createdAt).getTime();

    if (Math.floor((Date.now() - refTime) / 1000) >= growthSec) {
      return;
    }

    const interval = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (Math.floor((currentTime - refTime) / 1000) >= growthSec) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [item]);

  if (!item) {
    return (
      <View style={styles.gridSlotWrapper}>
        <TouchableOpacity style={[styles.gridSlot, styles.slotEmpty]} onPress={onPlant}>
          <Shovel size={28} color="#CBD5E1" weight="duotone" />
        </TouchableOpacity>
      </View>
    );
  }

  const growthSec = item.growthTimeSeconds || (item.growthTime ? item.growthTime * 60 : 60);
  const timeLeft = Math.max(0, growthSec - Math.floor((now - new Date(item.createdAt).getTime()) / 1000));
  const isReady = timeLeft === 0;

  return (
    <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.gridSlotWrapper}>
      <TouchableOpacity 
        style={[styles.gridSlot, styles.slotOccupied]} 
        onPress={() => isReady && onCollect(item)}
        activeOpacity={0.8}
      >
        <Image source={getGrowingPlantArt(item.icon)} style={styles.plantArtLarge} resizeMode="contain" />
        
        {isReady ? (
          <View style={{ backgroundColor: COLORS.accent.green, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8, marginTop: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '900' }}>COLHER</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#F8FAFC', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Timer size={12} color={COLORS.text.muted} weight="bold" />
            <Text style={{ fontSize: 10, color: COLORS.text.muted, fontWeight: '700' }}>
              {formatShortTime(timeLeft)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </MotiView>
  );
});
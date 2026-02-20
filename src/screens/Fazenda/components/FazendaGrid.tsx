import React from 'react';
import { View, Text } from 'react-native';
import { styles, COLORS } from '../styles';
import { LivePlantSlot } from './PlantSlot';

export function FazendaGrid({ farmPlants, onCollect, onPlant }: any) {
  return (
    <View style={styles.body}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Minhas Terras</Text>
        <Text style={{ fontSize: 12, color: COLORS.text.muted }}>{farmPlants.length}/6 Ocupados</Text>
      </View>
      <View style={styles.gridContainer}>
        {Array.from({ length: 6 }).map((_, i: number) => (
          <LivePlantSlot 
            key={i} 
            item={farmPlants[i]} 
            onCollect={onCollect} 
            onPlant={onPlant} 
          />
        ))}
      </View>
    </View>
  );
}
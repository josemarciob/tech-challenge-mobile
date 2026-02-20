import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { LockKey } from 'phosphor-react-native';
import { styles } from '../styles';
import { getGameAsset } from '../assets';

const QuickBtn = ({ icon, fallbackIcon, label, onPress, badge, locked }: any) => (
  <TouchableOpacity 
    style={styles.navItem} 
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    activeOpacity={0.7}
  >
    <View style={styles.navIconBox}>
      {icon ? (
        <Image source={icon} style={[styles.pixelIconSmall, locked && { opacity: 0.3 }]} resizeMode="contain" />
      ) : fallbackIcon}
      
      {badge > 0 && (
        <View style={styles.navBadge}>
          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '900' }}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

export function FazendaNav({ hasCoop, warehouseCount, onOpenModal }: any) {
  return (
    <View style={styles.quickNav}>
      <QuickBtn 
        icon={getGameAsset('market_ui')} 
        label="Mercado" 
        onPress={() => onOpenModal('shop')} 
      />
      <QuickBtn 
        icon={getGameAsset('warehouse_ui')} 
        label="Armazém" 
        badge={warehouseCount}
        onPress={() => onOpenModal('warehouse')} 
      />
      <QuickBtn 
        icon={hasCoop ? getGameAsset('coop') : null} 
        fallbackIcon={!hasCoop && <LockKey size={24} color="#CBD5E1" weight="duotone" />} 
        label="Galinheiro" 
        onPress={() => hasCoop ? onOpenModal('coop') : Alert.alert("Aviso", "Compre um Galinheiro no Mercado para liberar.")} 
      />
      <QuickBtn icon={getGameAsset('barn')} label="Celeiro" onPress={() => {}} locked />
    </View>
  );
}
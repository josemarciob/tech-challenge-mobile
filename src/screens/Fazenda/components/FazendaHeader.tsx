import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins, Sparkle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { styles } from '../styles';

export function FazendaHeader({ user, displayStats, xpInfo }: any) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'F'}</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>FAZENDEIRO(A)</Text>
            <Text style={styles.userName} numberOfLines={1}>{user?.name?.split(' ')[0] || 'Jogador'}</Text>
          </View>
        </View>
        <View style={styles.coinPill}>
          <Coins size={16} color="#D97706" weight="fill" />
          <Text style={styles.coinText}>{displayStats.coins.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.levelXpRow}>
        <View style={styles.levelBadgeWrapper}>
          <LinearGradient colors={['#FBBF24', '#D97706']} style={styles.levelBox}>
            <Text style={styles.levelBoxLabel}>NÍVEL</Text>
            <Text style={styles.levelBoxNum}>{displayStats.level}</Text>
          </LinearGradient>
          <View style={styles.levelSparkleDeco}><Sparkle size={14} color="#FEF08A" weight="fill" /></View>
        </View>
        <View style={styles.xpSection}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>PROGRESSO DE XP</Text>
            <Text style={styles.xpValue}>{displayStats.xp} / {xpInfo.nextXp}</Text>
          </View>
          <View style={styles.xpBarBg}>
            <MotiView 
              from={{ width: '0%' }} 
              animate={{ width: `${xpInfo.progress}%` }} 
              transition={{ type: 'timing', duration: 1000 }}
              style={styles.xpBarFill} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}
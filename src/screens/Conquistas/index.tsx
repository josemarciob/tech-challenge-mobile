import React, { useMemo } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Trophy, Star, Target, Lightning, 
  BookOpen, Crown, LockSimple, CheckCircle 
} from "phosphor-react-native"; // 🔥 Atualizado para Phosphor

import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";

// ==========================================
// CONFIGURAÇÃO DE CONQUISTAS
// ==========================================
const ACHIEVEMENTS_DATA = [
  { 
    id: '1', title: 'Primeiros Passos', desc: 'Chegue ao Nível 2', icon: Star, color: '#F59E0B', 
    targetValue: 2,
    currentValue: (u: any) => u.level || 1,
    requirement: (u: any) => (u.level || 1) >= 2 
  },
  { 
    id: '2', title: 'Estudioso', desc: 'Conclua 5 atividades', icon: BookOpen, color: '#10B981', 
    targetValue: 5,
    currentValue: (u: any) => u.completedActivities || 0,
    requirement: (u: any) => (u.completedActivities || 0) >= 5 
  },
  { 
    id: '3', title: 'Poupador', desc: 'Tenha 2000 moedas', icon: Target, color: '#F97316', 
    targetValue: 2000,
    currentValue: (u: any) => u.coins || 0,
    requirement: (u: any) => (u.coins || 0) >= 2000 
  },
  { 
    id: '4', title: 'Produtividade', desc: 'Chegue ao Nível 5', icon: Lightning, color: '#3B82F6', 
    targetValue: 5,
    currentValue: (u: any) => u.level || 1,
    requirement: (u: any) => (u.level || 1) >= 5 
  },
  { 
    id: '5', title: 'Veterano', desc: 'Conclua 20 atividades', icon: Trophy, color: '#8B5CF6', 
    targetValue: 20,
    currentValue: (u: any) => u.completedActivities || 0,
    requirement: (u: any) => (u.completedActivities || 0) >= 20 
  },
  { 
    id: '6', title: 'Elite Acadêmica', desc: 'Chegue ao Nível 10', icon: Crown, color: '#EF4444', 
    targetValue: 10,
    currentValue: (u: any) => u.level || 1,
    requirement: (u: any) => (u.level || 1) >= 10 
  },
];

export default function Conquistas() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => {
    const total = ACHIEVEMENTS_DATA.length;
    const unlocked = ACHIEVEMENTS_DATA.filter(a => user && a.requirement(user)).length;
    return {
        unlockedCount: unlocked,
        totalCount: total,
        progressPercent: Math.round((unlocked / total) * 100)
    };
  }, [user]);

  const renderAchievement = ({ item, index }: any) => {
    const isUnlocked = user ? item.requirement(user) : false;
    const current = user ? item.currentValue(user) : 0;
    const itemProgress = Math.min((current / item.targetValue) * 100, 100);
    const Icon = item.icon;

    return (
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 100, type: 'spring' }}
        style={[styles.badgeCard, !isUnlocked && styles.badgeLocked]}
      >
        <View style={styles.cardHeader}>
           {!isUnlocked && <LockSimple size={16} color="#94A3B8" weight="bold" />}
        </View>

        <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? item.color + '15' : '#E2E8F0' }]}>
          <Icon size={36} color={isUnlocked ? item.color : '#94A3B8'} weight={isUnlocked ? "duotone" : "bold"} />
        </View>
        
        <Text style={[styles.badgeTitle, !isUnlocked && { color: '#64748B' }]} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.badgeDesc} numberOfLines={2}>{item.desc}</Text>

        {isUnlocked ? (
           <LinearGradient colors={['#10B981', '#059669']} style={styles.completedBadge} start={{x:0, y:0}} end={{x:1, y:0}}>
              <CheckCircle size={12} color="#FFF" weight="fill" style={{marginBottom: 2}} />
              <Text style={styles.completedText}>CONQUISTADO</Text>
           </LinearGradient>
        ) : (
          <View style={styles.progressSection}>
             <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Progresso</Text>
                <Text style={styles.progressValues}>{current}/{item.targetValue}</Text>
             </View>
             <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { backgroundColor: item.color, width: `${itemProgress}%` }]} />
             </View>
          </View>
        )}
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Troféus</Text>
        <Text style={styles.pageSubtitle}>Sua jornada de evolução</Text>

        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }}>
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Trophy size={100} color="rgba(255,255,255,0.12)" weight="fill" style={styles.heroBgIcon} />
                <View style={styles.heroContent}>
                    <View>
                        <Text style={styles.heroTitle}>Conquistas Totais</Text>
                        <Text style={styles.heroScore}>{stats.unlockedCount} <Text style={styles.heroScoreMuted}>/ {stats.totalCount}</Text></Text>
                    </View>
                    <View style={styles.percentCircle}>
                        <Text style={styles.percentText}>{stats.progressPercent}%</Text>
                    </View>
                </View>
            </LinearGradient>
        </MotiView>
      </View>

      <FlatList
        data={ACHIEVEMENTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievement}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
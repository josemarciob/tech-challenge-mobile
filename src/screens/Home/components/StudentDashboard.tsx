import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Crown, Sparkle, Coins, ArrowRight, Target } from "phosphor-react-native";

import { styles } from "../styles"; 
import { ActionCard } from "./ActionCard";

export const StudentDashboard = ({ user, navigation }: any) => {
  const firstName = user?.name?.split(' ')[0] || 'Aluno';
  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  const currentCoins = user?.coins || 0;

  // Cálculo da barra de progresso de XP
  const nextLevelXp = Math.floor(100 * Math.pow(1.65, currentLevel - 1));
  const progressPercent = Math.min((currentXp / nextLevelXp) * 100, 100);

  return (
    <View>
      {/*CABEÇALHO*/}
      <View style={[styles.headerContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Olá, {firstName}</Text>
          <Text style={styles.headerSubtitle}>Pronto para evoluir hoje?</Text>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate("UserDetail", { id: user?.id })}
          activeOpacity={0.8}
          style={{
            width: 48, 
            height: 48, 
            borderRadius: 24, 
            backgroundColor: '#006eff', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginLeft: 15,
            shadowColor: '#006eff', 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 5,
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '900' }}>
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.heroCard}>
          <Crown size={120} color="rgba(255,255,255,0.03)" weight="fill" style={styles.heroBgIcon} />
          
          <View style={styles.heroTop}>
            <View style={styles.levelBadge}>
              <Sparkle size={12} color="#FDE047" weight="fill" />
              <Text style={styles.levelText}>NÍVEL {currentLevel}</Text>
            </View>
            <View style={styles.coinPill}>
              <Coins size={15} color="#F59E0B" weight="fill" /> 
              <Text style={styles.coinPillText}>{currentCoins.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.xpSection}>
            <View style={styles.xpLabels}>
              <Text style={styles.xpTitle}>PROGRESSO DE XP</Text>
              <Text style={styles.xpValue}>{currentXp} / {nextLevelXp} XP</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient 
                colors={["#34D399", "#10B981"]} 
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]} 
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.heroFooter} onPress={() => navigation.navigate("Fazenda")}>
            <Text style={styles.heroFooterText}>Visitar minha fazenda</Text>
            <ArrowRight size={16} color="#FFF" weight="bold" />
          </TouchableOpacity>
        </LinearGradient>
      </MotiView>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      <View style={styles.gridContainer}>
        <ActionCard 
            title="Atividades" 
            subtitle="Acesse seus quizzes" 
            icon={<Target size={28} color="#FFF" weight="duotone" />} 
            gradient={["#3B82F6", "#2563EB"]} 
            onPress={() => navigation.navigate("PostsList")} 
            fullWidth
        />
      </View>
    </View>
  );
};
import React, { useState, useCallback } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StatusBar, Alert, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; 
import { MotiView } from "moti";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// 🔥 NOVOS ÍCONES GAMIFICADOS
import { 
  EnvelopeSimple, Shield, Hash, SignOut, CaretRight, 
  ArrowLeft, Star, Lightning, Coins, CheckCircle
} from "phosphor-react-native";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api"; 
import { AppStackParamList } from "../../navigation/AppStack";

import { styles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, 'UserDetail'>;

export default function UserDetail({ route, navigation }: Props) {
  const { user: loggedUser, logout, updateUser } = useAuth(); 
  const insets = useSafeAreaInsets();

  const userParam = route.params?.id;
  const targetId = userParam || loggedUser?.id;
  const isMe = String(loggedUser?.id) === String(targetId);

  const [profileData, setProfileData] = useState<any>(loggedUser);
  const [loading, setLoading] = useState(true);

  const fetchLatestData = async () => {
    if (!targetId) return;
    try {
      const res = await api.get(`/users/${targetId}`);
      setProfileData(res.data);
      if (isMe) {
        updateUser({
          ...res.data,
          level: res.data.level ?? res.data.nivel ?? 1,
          coins: res.data.coins ?? res.data.moedas ?? 0,
        });
      }
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLatestData(); }, [targetId]));

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout }
    ]);
  };

  const StatBox = ({ label, value, icon }: any) => (
    <View style={styles.statBox}>
      <View style={styles.statIconBg}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, label, value, onPress, isDestructive = false }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={styles.menuIconContainer}>{icon}</View>
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuLabel, isDestructive && { color: '#FF4757' }]}>{label}</Text>
        {value && <Text style={styles.menuValue} numberOfLines={1}>{value}</Text>}
      </View>
      {onPress && <CaretRight size={18} color="#CCC" weight="bold" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={{ zIndex: 1 }}>
        <LinearGradient
          colors={["#006eff", "#004aad"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.topNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFF" weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{profileData?.name?.charAt(0).toUpperCase() || "U"}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{profileData?.level ?? profileData?.nivel ?? 1}</Text>
              </View>
            </View>
            <Text style={styles.name}>{profileData?.name?.split(' ')[0] || "Usuário"}</Text>
            <View style={styles.roleBadge}>
              <Shield size={12} color="#FFF" weight="fill" style={{ marginRight: 6 }} />
              <Text style={styles.roleText}>{profileData?.role === "professor" ? "Professor" : "Estudante"}</Text>
            </View>
          </View>

          {/* 🔥 CARD FLUTUANTE COM 4 COLUNAS E NOVOS ÍCONES */}
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.statsCard}>
            
            <StatBox label="Nível" value={profileData?.level ?? profileData?.nivel ?? 1} icon={<Star size={20} color="#F59E0B" weight="fill" />} />
            <View style={styles.vertDivider} />
            
            <StatBox label="XP" value={profileData?.xp ?? 0} icon={<Lightning size={20} color="#8B5CF6" weight="fill" />} />
            <View style={styles.vertDivider} />
            
            <StatBox label="Moedas" value={profileData?.coins ?? profileData?.moedas ?? 0} icon={<Coins size={20} color="#10B981" weight="fill" />} />
            <View style={styles.vertDivider} />

            {/* 🔥 NOVO: Quantidade de atividades completas! */}
            <StatBox label="Atividades" value={profileData?.completedActivities ?? 0} icon={<CheckCircle size={20} color="#006eff" weight="fill" />} />
          
          </MotiView>
        </LinearGradient>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#006eff" style={{ marginTop: 80 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Dados Acadêmicos</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={<EnvelopeSimple size={20} color="#006eff" weight="duotone" />} label="E-mail" value={profileData?.email} />
            <View style={styles.divider} />
            <MenuItem icon={<Hash size={20} color="#6C5CE7" weight="duotone" />} label="ID Acadêmico" value={`#${String(profileData?.id || 0).padStart(4, '0')}`} />
          </View>

          {isMe && (
            <>
              <Text style={styles.sectionTitle}>Conta</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon={<SignOut size={20} color="#FF4757" weight="duotone" />} label="Encerrar Sessão" isDestructive onPress={handleLogout} />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
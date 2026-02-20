import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; 
import { 
  EnvelopeSimple, ShieldCheck, IdentificationCard, SignOut, 
  CaretRight, Trophy, User, PencilSimple, Coins, ArrowLeft 
} from "phosphor-react-native";
import { MotiView } from "moti";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api"; 
import { AppStackParamList } from "../../navigation/AppStack";
import { styles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, 'Perfil'>;

export default function Perfil({ route, navigation }: Props) {
  const { user: loggedUser, logout, updateUser } = useAuth(); 
  const insets = useSafeAreaInsets();

  const userIdFromParam = route.params?.userId; 
  const targetId = userIdFromParam || loggedUser?.id;
  const isMe = !userIdFromParam || userIdFromParam === loggedUser?.id;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestData = async () => {
    if (!targetId) return;
    try {
      const res = await api.get(`/users/${targetId}`);
      setProfileData(res.data);
      
      if (isMe) {
        updateUser(res.data); 
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLatestData();
    }, [targetId])
  );

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout }
    ]);
  };

  if (loading || !profileData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#006eff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View>
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
              <Text style={styles.avatarText}>{profileData.name?.charAt(0).toUpperCase()}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{profileData.level}</Text>
              </View>
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <View style={styles.roleBadge}>
              <ShieldCheck size={14} color="#FFF" weight="fill" style={{ marginRight: 6 }} />
              <Text style={styles.roleText}>{profileData.role}</Text>
            </View>
          </View>

          <MotiView 
            from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}
            style={styles.statsCard}
          >
            <StatBox label="Nível" value={profileData.level} icon={<Trophy size={20} color="#F59E0B" weight="duotone" />} />
            <View style={styles.vertDivider} />
            <StatBox label="XP" value={profileData.xp} icon={<User size={20} color="#006eff" weight="duotone" />} />
            <View style={styles.vertDivider} />
            <StatBox label="Moedas" value={profileData.coins} icon={<Coins size={20} color="#10B981" weight="duotone" />} />
          </MotiView>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Dados Acadêmicos</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={<EnvelopeSimple size={22} color="#006eff" />} label="E-mail" value={profileData.email} />
          <View style={styles.divider} />
          <MenuItem icon={<IdentificationCard size={22} color="#6C5CE7" />} label="ID Acadêmico" value={`#${String(profileData.id).padStart(4, '0')}`} />
        </View>

        {isMe && (
          <>
            <Text style={styles.sectionTitle}>Conta</Text>
            <View style={styles.menuGroup}>
              {loggedUser?.role === 'professor' && (
                <>
                  <MenuItem 
                    icon={<PencilSimple size={22} color="#F59E0B" />} 
                    label="Editar Perfil" 
                    onPress={() => navigation.navigate("UserDetail", { id: profileData.id })}
                  />
                  <View style={styles.divider} />
                </>
              )}
              <MenuItem 
                icon={<SignOut size={22} color="#FF4757" />} 
                label="Encerrar Sessão" 
                isDestructive 
                onPress={handleLogout}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const StatBox = ({ label, value, icon }: any) => (
  <View style={styles.statBox}>
    <View style={styles.statIconBg}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuItem = ({ icon, label, value, onPress, isDestructive = false }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.menuIconContainer}>{icon}</View>
    <View style={styles.menuTextContainer}>
      <Text style={[styles.menuLabel, isDestructive && { color: '#FF4757' }]}>{label}</Text>
      {value && <Text style={styles.menuValue} numberOfLines={1}>{value}</Text>}
    </View>
    {onPress && <CaretRight size={18} color="#CCC" weight="bold" />}
  </TouchableOpacity>
);
import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; 
import { 
  Mail, 
  Shield, 
  Hash, 
  LogOut, 
  ChevronRight, 
  Trophy, 
  User as UserIcon,
  Settings,
  Edit3,
  PiggyBank,
  DollarSign,
  ArrowLeft
} from "lucide-react-native";
import { MotiView } from "moti";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api"; 

export default function Perfil({ route, navigation }: any) {
  const { user: userParam } = route.params; 
  const { user: loggedUser, logout } = useAuth(); 
  const insets = useSafeAreaInsets();

  const targetId = userParam?.id || loggedUser?.id;
  const isMe = String(loggedUser?.id) === String(targetId);

  const [profileData, setProfileData] = useState<any>(userParam || loggedUser);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchLatestData();
    }, [targetId])
  );

  const fetchLatestData = async () => {
    if (!targetId) return;
    try {
      const res = await api.get(`/users/${targetId}`);
      setProfileData(res.data);
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair", 
      "Deseja realmente sair do aplicativo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout }
      ]
    );
  };

  const StatBox = ({ label, value, icon }: any) => (
    <View style={styles.statBox}>
      <View style={styles.statIconBg}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, label, value, onPress, isDestructive = false }: any) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuLabel, isDestructive && { color: '#FF4757' }]}>{label}</Text>
        {value && <Text style={styles.menuValue}>{value}</Text>}
      </View>
      {onPress && <ChevronRight size={20} color="#CCC" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* --- HEADER --- */}
      <View>
        <LinearGradient
          colors={["#006eff", "#004aad"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.topNav}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.backButton}
            >
                <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profileData?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
              
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{profileData?.nivel || 1}</Text>
              </View>
            </View>
            
            <Text style={styles.name}>{profileData?.name || "Usuário"}</Text>
            
            <View style={styles.roleBadge}>
              <Shield size={12} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.roleText}>
                {profileData?.role === "professor" ? "Professor Titular" : "Estudante"}
              </Text>
            </View>
          </View>

          <MotiView 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            style={styles.statsCard}
          >
            <StatBox 
              label="Nível" 
              value={profileData?.nivel || 1} 
              icon={<Trophy size={18} color="#FFD700" />} 
            />
            <View style={styles.vertDivider} />
            <StatBox 
              label="XP Total" 
              value={profileData?.xp || 0} 
              icon={<UserIcon size={18} color="#006eff" />} 
            />
            <View style={styles.vertDivider} />
            <StatBox 
              label="Moedas" 
              value={profileData?.moedas || 0} 
              icon={<DollarSign size={18} color="#10B981" />} 
            />
          </MotiView>
        </LinearGradient>
      </View>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Dados da Conta</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            icon={<Mail size={20} color="#006eff" />} 
            label="E-mail" 
            value={profileData?.email} 
          />
          <View style={styles.divider} />
          <MenuItem 
            icon={<Hash size={20} color="#6C5CE7" />} 
            label="ID Acadêmico" 
            value={`#${String(profileData?.id || 0).padStart(4, '0')}`} 
          />
        </View>

        {isMe && (
          <>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <View style={styles.menuGroup}>
              
              {loggedUser?.role === 'professor' && (
                <>
                  <MenuItem 
                    icon={<Edit3 size={20} color="#F59E0B" />} 
                    label="Editar Perfil" 
                    onPress={() => navigation.navigate("UserDetail", { user: profileData })}
                  />
                  <View style={styles.divider} />
                </>
              )}

              <MenuItem 
                icon={<LogOut size={20} color="#FF4757" />} 
                label="Sair da Conta" 
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  
  headerGradient: {
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    marginBottom: 40 
  },
  topNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12
  },

  profileHeader: { alignItems: 'center', marginBottom: 25 },
  avatarContainer: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 12
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
  levelBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#FFD700', width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF'
  },
  levelBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20
  },
  roleText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  statsCard: {
    position: 'absolute', bottom: -45,
    width: '90%', flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderRadius: 20, padding: 15,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
    elevation: 8
  },
  statBox: { flex: 1, alignItems: 'center' },
  statIconBg: { marginBottom: 6, padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  vertDivider: { width: 1, height: '80%', backgroundColor: '#E2E8F0', alignSelf: 'center' },

  content: { padding: 20, paddingTop: 25 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 10, marginLeft: 4, textTransform: 'uppercase' },
  
  menuGroup: {
    backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 20,
    marginBottom: 25,
    shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5, elevation: 2
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16
  },
  menuIconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center', marginRight: 16
  },
  menuTextContainer: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  menuValue: { fontSize: 14, color: '#64748B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', width: '100%' },
});
import React, { useState, useCallback, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  ActivityIndicator
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; 
import { LinearGradient } from "expo-linear-gradient";
import { 
  BookOpen, Users, LogOut, Trophy, Zap, Coins, 
  BarChart, Bell, Settings, PlusCircle, ClipboardList
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [stats, setStats] = useState({ alunos: 0, atividades: 0 });
  
  const [refreshedUser, setRefreshedUser] = useState<any>(user ?? null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        setRefreshedUser(user);
        setLoading(false);
    }
  }, [user]);

  // ATUALIZAÇÃO DE DADOS
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      if (user.role === 'professor') {
        fetchStats();
      } else {
        refreshUserData(); 
      }
    }, [user])
  );

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/stats/dashboard');
      setStats(data);
    } catch (error) {
      console.log("Erro ao carregar dashboard");
    }
  };

  const refreshUserData = async () => {
    if (!user?.id) return; 

    try {
        const res = await api.get(`/users/${user.id}`);
        setRefreshedUser(res.data);
    } catch (error) {
        console.log("Erro ao atualizar dados:", error);
    }
  };

  const displayUser = refreshedUser || user;

  if (!displayUser) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006eff" />
            <Text style={{marginTop: 10, color: '#666'}}>Carregando perfil...</Text>
        </View>
    );
  }

  const firstName = displayUser.name ? displayUser.name.split(' ')[0] : 'Estudante';
  const userRole = displayUser.role || 'student';
  const userLevel = displayUser.nivel || 1;
  const userXp = displayUser.xp || 0;
  const userCoins = displayUser.moedas || 0;

  //COMPONENTES INTERNOS ---

  const StudentDashboard = () => (
    <View>
      <Header title={`Olá, ${firstName} 👋`} subtitle="Pronto para novos desafios?" />

      <MotiView 
        from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 600 }}
      >
        <LinearGradient
          colors={["#0F2027", "#203A43", "#2C5364"]} 
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>NÍVEL {userLevel}</Text>
            </View>
            <Trophy size={20} color="#FFD700" />
          </View>

          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroLabel}>XP TOTAL</Text>
              <Text style={styles.heroValue}>{userXp}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.heroLabel}>SALDO</Text>
              <Text style={styles.heroValue}>
                  {userCoins} <Coins size={18} color="#FFD700" />
              </Text>
            </View>
          </View>
        </LinearGradient>
      </MotiView>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      <View style={styles.gridContainer}>
        <ActionCard title="Atividades" subtitle="Ver pendências" icon={<BookOpen size={24} color="#FFF" />} gradient={["#4facfe", "#00f2fe"]} delay={100} onPress={() => navigation.navigate("PostsList")} />
        <ActionCard title="Loja" subtitle="Gastar moedas" icon={<Zap size={24} color="#FFF" />} gradient={["#f093fb", "#f5576c"]} delay={200} onPress={() => navigation.navigate("Loja")} />
        <ActionCard title="Conquistas" subtitle="Meus prêmios" icon={<Trophy size={24} color="#FFF" />} gradient={["#fa709a", "#fee140"]} delay={300} onPress={() => navigation.navigate("Conquistas")} />
      </View>
    </View>
  );

  const ProfessorDashboard = () => (
    <View>
      <Header title="Painel de Gestão" subtitle="Visão geral da turma" showNotification={true} />

      <View style={styles.statsRow}>
        <AdminStatCard 
          label="Total de Alunos" 
          value={String(stats.alunos)} 
          icon={<Users size={20} color="#006eff" />} 
          color="#006eff"
          delay={0}
        />
        <AdminStatCard 
          label="Atividades Ativas" 
          value={String(stats.atividades)} 
          icon={<BookOpen size={20} color="#00c853" />} 
          color="#00c853"
          delay={100}
        />
      </View>

      <Text style={styles.sectionTitle}>Ferramentas Rápidas</Text>
      <View style={styles.toolsGrid}>
        <ToolButton title="Nova Atividade" icon={<PlusCircle size={28} color="#fff" />} color="#006eff" onPress={() => navigation.navigate("CreatePost")} delay={200} />
        <ToolButton title="Atividades" icon={<ClipboardList size={28} color="#fff" />} color="#6c5ce7" onPress={() => navigation.navigate("PostsList")} delay={300} />
        <ToolButton title="Alunos" icon={<Users size={28} color="#fff" />} color="#2d3436" onPress={() => navigation.navigate("AdminScreen")} delay={400} />
        <ToolButton title="Configurações" icon={<Settings size={28} color="#fff" />} color="#b2bec3" onPress={() => {}} delay={500} />
      </View>

      <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 600, type: 'timing' }} style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <BarChart size={20} color="#555" />
          <Text style={styles.insightTitle}>Relatório Semanal</Text>
        </View>
        <Text style={styles.insightText}>
          O engajamento da turma aumentou <Text style={{color: '#00c853', fontWeight: 'bold'}}>12%</Text> esta semana.
        </Text>
      </MotiView>
    </View>
  );

  const Header = ({ title, subtitle, showNotification = false }: any) => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {showNotification && (
           <TouchableOpacity style={styles.iconButton}>
             <Bell size={22} color="#555" />
             <View style={styles.notificationDot} />
           </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Perfil", { user: displayUser })}>
          <LinearGradient colors={['#006eff', '#00c6ff']} style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
                {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        {userRole === 'professor' ? <ProfessorDashboard /> : <StudentDashboard />}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={18} color="#ff4757" />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- AUXILIARES ---
const AdminStatCard = ({ label, value, icon, color, delay }: any) => (
  <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: 'spring' }} style={[styles.adminStatCard, { borderLeftColor: color }]}>
    <View style={styles.adminStatHeader}>
      <Text style={styles.adminStatValue}>{value}</Text>
      <View style={[styles.iconBoxSmall, { backgroundColor: `${color}20` }]}>{icon}</View>
    </View>
    <Text style={styles.adminStatLabel}>{label}</Text>
  </MotiView>
);

const ToolButton = ({ title, icon, color, onPress, delay }: any) => (
  <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay, type: 'spring' }} style={styles.toolButtonWrapper}>
    <TouchableOpacity style={[styles.toolButton, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      {icon}
      <Text style={styles.toolButtonText}>{title}</Text>
    </TouchableOpacity>
  </MotiView>
);

const ActionCard = ({ title, subtitle, icon, gradient, onPress, delay }: any) => (
  <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay, type: 'spring' }} style={styles.actionCardWrapper}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ flex: 1 }}>
      <LinearGradient colors={gradient} style={styles.actionCard} start={{x:0, y:0}} end={{x:1, y:1}}>
        <View style={styles.actionIconBubble}>{icon}</View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  </MotiView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F4F6F8" },
  scrollContent: { padding: 24 },
  
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  headerAvatar: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  iconButton: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  notificationDot: { position: 'absolute', top: 12, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff4757', borderWidth: 1, borderColor: '#fff' },
  
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  adminStatCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderLeftWidth: 4, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  adminStatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  adminStatValue: { fontSize: 24, fontWeight: 'bold', color: '#2d3436' },
  adminStatLabel: { fontSize: 12, color: '#636e72', fontWeight: '500' },
  iconBoxSmall: { padding: 8, borderRadius: 8 },

  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  toolButtonWrapper: { width: (width - 48 - 12) / 2 },
  toolButton: { padding: 20, borderRadius: 20, height: 110, justifyContent: 'space-between', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  toolButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  insightCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e1e1e1' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3436' },
  insightText: { fontSize: 14, color: '#636e72', lineHeight: 20 },

  heroCard: { borderRadius: 24, padding: 24, marginBottom: 30, elevation: 10 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  levelBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  levelText: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between' },
  heroLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  heroValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  actionCardWrapper: { width: '48%', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  actionCard: { padding: 16, borderRadius: 20, height: 140, justifyContent: 'space-between', elevation: 4 },
  actionIconBubble: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  actionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  actionSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 15 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 15, backgroundColor: '#FFF0F1', borderRadius: 12 },
  logoutText: { color: '#ff4757', fontWeight: '600', marginLeft: 8 },
});
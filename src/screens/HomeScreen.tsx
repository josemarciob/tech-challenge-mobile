import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  User,
  PlusCircle,
  ClipboardList,
  Users,
  LogOut,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { MotiView } from "moti";

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Carregando usuário...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* WELCOME CARD */}
      <MotiView
        from={{
          opacity: 0,
          translateY: 24,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          damping: 14,
          stiffness: 120,
          delay: 100,
        }}
        style={styles.welcomeWrapper}
      >
        <LinearGradient
          colors={["#006eff", "#4f9cff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeRow}>
            {/* AVATAR COM MICRO-ANIMAÇÃO */}
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 150,
                delay: 300,
              }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </MotiView>

            {/* TEXTO */}
            <View style={styles.welcomeText}>
              <Text style={styles.welcome}>Bem-vindo 👋</Text>
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>

              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {user.role === "professor" ? "Professor" : "Aluno"}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </MotiView>

      {/* TÍTULO */}
      <Text style={styles.sectionTitle}>
        {user.role === "professor"
          ? "Painel do Professor"
          : "Painel do Aluno"}
      </Text>

      {/* GRID */}
      <View style={styles.grid}>
        {user.role === "aluno" && (
          <>
            <Card
              title="Atividades"
              subtitle="Consultar pendências"
              icon={<BookOpen size={22} color={COLORS.primary} />}
              onPress={() => navigation.navigate("Atividades")}
            />
            <Card
              title="Perfil"
              subtitle="Editar dados"
              icon={<User size={22} color={COLORS.secondary} />}
              onPress={() => navigation.navigate("Perfil", { user })}
            />
          </>
        )}

        {user.role === "professor" && (
          <>
            <Card
              title="Criar Atividade"
              subtitle="Nova atividade"
              icon={<PlusCircle size={22} color={COLORS.primary} />}
              onPress={() => navigation.navigate("Criar Atividade")}
            />
            <Card
              title="Atividades"
              subtitle="Gerenciar lista"
              icon={<ClipboardList size={22} color={COLORS.secondary} />}
              onPress={() => navigation.navigate("Atividades")}
            />
            <Card
              title="Usuários"
              subtitle="Alunos e professores"
              icon={<Users size={22} color={COLORS.warning} />}
              onPress={() => navigation.navigate("AdminScreen")}
            />
            <Card
              title="Perfil"
              subtitle="Meus dados"
              icon={<User size={22} color={COLORS.accent} />}
              onPress={() => navigation.navigate("Perfil", { user })}
            />
          </>
        )}
      </View>

      {/* SAIR */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { marginBottom: insets.bottom + 16 },
        ]}
        onPress={logout}
      >
        <LogOut size={18} color={COLORS.danger} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* CARD */
function Card({ title, subtitle, icon, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconCircle}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/* CORES */
const COLORS = {
  primary: "#006eff",
  secondary: "#00c853",
  warning: "#ff9800",
  accent: "#9c27b0",
  danger: "#ff4444",
  background: "#f5f7fa",
  text: "#333",
  textSecondary: "#777",
};

/* ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },

  loading: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },

  /* WELCOME */
  welcomeWrapper: {
    marginTop: 12,
    marginBottom: 24,
  },

  welcomeCard: {
    borderRadius: 26,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 4,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.primary,
  },

  welcomeText: {
    flex: 1,
  },

  welcome: {
    fontSize: 14,
    color: "#eaf1ff",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  roleBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  roleBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  /* GRID */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.text,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 16,
    elevation: 4,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  /* LOGOUT */
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 24,
  },

  logoutText: {
    color: COLORS.danger,
    fontWeight: "700",
    fontSize: 16,
  },
});

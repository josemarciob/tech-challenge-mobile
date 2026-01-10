import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo 👋</Text>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>
          {user.role === "estudante" ? "Estudante" : "Professor"}
        </Text>
      </View>

      {/* Painel para Estudante */}
      {user.role === "estudante" && (
        <View style={styles.panel}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Atividades")}
          >
            <Text style={styles.cardTitle}>📚 Ver Atividades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Perfil", { user })}
          >
            <Text style={styles.cardTitle}>👤 Perfil do Estudante</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Painel para Professor */}
      {user.role === "professor" && (
        <View style={styles.panel}>
          <TouchableOpacity
            style={[styles.card, styles.cardBlue]}
            onPress={() => navigation.navigate("Criar Atividade")}
          >
            <Text style={styles.cardTitle}>➕ Criar Nova Atividade</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardGreen]}
            onPress={() => navigation.navigate("Atividades")}
          >
            <Text style={styles.cardTitle}>📋 Lista de Atividades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardOrange]}
            onPress={() => navigation.navigate("AdminScreen")}
          >
            <Text style={styles.cardTitle}>👥 Lista de Usuários</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardPurple]}
            onPress={() => navigation.navigate("Perfil", { user })}
          >
            <Text style={styles.cardTitle}>👤 Perfil do Professor</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botão de sair */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout(); // limpa usuário e token
          navigation.replace("Login"); // redireciona para tela de login
        }}
      >
        <Text style={styles.logoutText}>🚪 Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  welcome: { fontSize: 20, fontWeight: "bold", color: "#006eff" },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 6, color: "#333" },
  role: { fontSize: 16, color: "#777", marginTop: 4 },
  panel: { flex: 1, gap: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardBlue: { backgroundColor: "#e6f0ff" },
  cardGreen: { backgroundColor: "#e6ffe6" },
  cardOrange: { backgroundColor: "#fff3e6" },
  cardPurple: { backgroundColor: "#f3e6ff" },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loading: { fontSize: 18, color: "#777" },
});

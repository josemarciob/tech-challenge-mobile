import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Perfil({ route }: any) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>
  {user.role === "professor" ? "Professor" : "Aluno"}
</Text>


      </View>

      {/* Cartão */}
      <View style={styles.card}>
        <Text style={styles.label}>Informações:</Text>
        <Text style={styles.label}>📧 Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>🆔 ID Aluno</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 20 },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#006eff",
    padding: 20,
    borderRadius: 12,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  role: { fontSize: 16, color: "#e0e0e0", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 12, color: "#006eff" },
  value: { fontSize: 16, marginTop: 4, color: "#333" },
});

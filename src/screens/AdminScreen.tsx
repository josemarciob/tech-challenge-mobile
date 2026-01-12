import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../services/api";

export default function AdminScreen({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;
  const insets = useSafeAreaInsets();

  const fetchUsers = async () => {
    const res = await api.get(`/users?page=${page}&limit=${limit}`);
    setUsers(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Recarrega a lista sempre que a tela volta a ficar em foco (por exemplo, após editar um usuário)
  useFocusEffect(
    React.useCallback(() => {
      fetchUsers();
    }, [page])
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.role === "professor" ? styles.professorCard : styles.alunoCard,
      ]}
      onPress={() => navigation.navigate("UserDetail", { user: item })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>
        {item.role === "professor" ? "👨‍🏫 Professor" : "🎓 Aluno"}
      </Text>
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👥 Lista de Alunos e Professores</Text>
      <TextInput
        style={styles.input}
        placeholder="🔍 Buscar por nome..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado</Text>}
      />
      {/* Paginação */}
      <View style={[styles.pagination, { paddingBottom: insets.bottom }]}>
        <Button title="Anterior" onPress={() => setPage(page - 1)} disabled={page === 1} />
        <Text style={styles.pageInfo}>Página {page}</Text>
        <Button
          title="Próxima"
          onPress={() => setPage(page + 1)}
          disabled={page * limit >= total}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", paddingBottom: 12, paddingLeft: 16, paddingRight: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#006eff",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  professorCard: { backgroundColor: "#e6f0ff" },
  alunoCard: { backgroundColor: "#e6ffe6" },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  role: { fontSize: 14, marginTop: 4, color: "#555" },
  email: { fontSize: 14, marginTop: 4, color: "#777" },
  empty: { textAlign: "center", color: "#999", marginTop: 20 },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },
  pageInfo: { fontSize: 16, fontWeight: "bold", color: "#333" },
});

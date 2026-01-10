import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function PostsList({ navigation }: any) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.log("Erro ao buscar posts:", err);
    }
  };

  // Atualiza sempre que a tela volta a ser focada
  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detalhes Atividade", { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        {user?.role === "professor" && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={async () => {
              try {
                await api.delete(`/posts/${item.id}`, {
                  data: { authorId: user?.id, authorName: user?.name },
                });
                fetchPosts(); // atualiza lista após exclusão
              } catch (err: any) {
                alert(err.response?.data?.error || "Erro ao excluir atividade");
              }
            }}
          >
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.author}>Autor: {item.authorName}</Text>
      <Text style={styles.content}>{item.content}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Detalhes Atividade", { id: item.id })}
        >
          <Text style={styles.actionText}>Visualizar</Text>
        </TouchableOpacity>

        {user?.role === "professor" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate("Edite Atividade", { postId: item.id })}
          >
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Lista de Atividades</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#006eff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  author: { fontSize: 14, color: "#555", marginTop: 8 },
  content: { fontSize: 15, color: "#444", marginTop: 12 },
  actionsRow: { flexDirection: "row", marginTop: 16, gap: 12 },
  actionButton: {
    backgroundColor: "#006eff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: { backgroundColor: "#ffaa00" },
  actionText: { color: "#fff", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

type Comment = {
  id: number;
  author: string;
  content: string;
};

export default function PostDetail({ route }: any) {
  const { id } = route.params;
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);

        const resComments = await api.get(`/posts/${id}/comments`);
        setComments(resComments.data);
      } catch (err) {
        console.error("Erro ao carregar post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Erro", "Digite um comentário");
      return;
    }

    try {
      const res = await api.post(`/posts/${id}/comments`, {
        content: newComment,
        author: user?.name || "Anônimo",
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível adicionar comentário");
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  if (!post) return <Text>Post não encontrado</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum comentário ainda</Text>}
        ListHeaderComponent={
          <View style={styles.postCard}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.author}>✍️ Autor: {post.authorName}</Text>
            <Text style={styles.content}>{post.content}</Text>

            <Text style={styles.commentsTitle}>💬 Comentários</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu comentário..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddComment}>
              <Text style={styles.buttonText}>Enviar comentário</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#006eff",
  },
  author: { fontSize: 14, marginBottom: 12, color: "#777" },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    color: "#333",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
    color: "#006eff",
  },
  commentCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  commentAuthor: { fontWeight: "bold", marginBottom: 4, color: "#006eff" },
  commentContent: { fontSize: 15, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#006eff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  empty: { textAlign: "center", color: "#777", marginTop: 12 },
});

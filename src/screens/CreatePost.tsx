import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function CreatePost({ navigation }: any) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async () => {
    if (!title || !content) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const res = await api.post("/posts", {
        title,
        content,
        authorId: user?.id,
        authorName: user?.name,
      });

      const newPost = res.data; // post criado com id

      Alert.alert("Sucesso", "Post criado com sucesso!");

      // redireciona para o detalhe do post recém-criado
      navigation.replace("Detalhes Atividade", { id: newPost.id });
    } catch (error: any) {
      console.error("Erro ao criar post:", error.message, error);
      Alert.alert("Erro", "Não foi possível criar o post.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        maxLength={50}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        maxLength={500}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
        <Text style={styles.buttonText}>Criar Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f7fa",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#006eff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

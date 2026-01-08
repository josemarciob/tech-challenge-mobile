import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import {api} from "../services/api";

export default function CreatePost({ navigation }: any) {
  const { user } = useAuth(); // pega o usuário logado do contexto
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async () => {
  console.log("Botão clicado");
  if (!title || !content) {
    Alert.alert("Erro", "Preencha todos os campos!");
    return;
  }

  try {
  console.log("Enviando requisição para criar post...");
  await api.post("/posts", {
    title,
    content,
    authorId: user?.id,
    authorName: user?.name,
  });
  console.log("Post criado com sucesso!");
  Alert.alert("Sucesso", "Post criado com sucesso!");
  navigation.navigate("Atividades");
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
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Criar Post" onPress={handleCreatePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
});

import React, { useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { api } from "../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext"; // pega usuário logado

type FormData = { title: string; content: string };

export default function EditPostScreen() {
  const { control, handleSubmit, setValue } = useForm<FormData>();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { postId } = route.params;
  const { user } = useAuth(); // usuário logado (tem id, name, role)

  useEffect(() => {
    // carrega dados do post atual
    api.get(`/posts/${postId}`).then(res => {
      setValue("title", res.data.title);
      setValue("content", res.data.content);
    });
  }, [postId]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/posts/${postId}`, {
        title: data.title,
        content: data.content,
        authorId: user?.id,       
        authorName: user?.name,   
      });
      console.log("authorId enviado:", user?.id);

      navigation.goBack();
    } catch (err: any) {
      console.log("authorId enviadoo:", user?.id);
      console.error("Erro ao editar:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Erro ao editar post");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <Controller
        control={control}
        name="title"
        rules={{ required: "Título é obrigatório" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Título"
            value={value}
            onChangeText={onChange}
            maxLength={20}
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>Descrição</Text>
      <Controller
        control={control}
        name="content"
        rules={{ required: "Descrição é obrigatória" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Descrição"
            value={value}
            onChangeText={onChange}
            maxLength={100}
            style={styles.input}
            multiline
          />
        )}
      />

      <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: "bold", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
});

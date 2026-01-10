import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { api } from "../services/api";

export default function UserDetail({ route, navigation }: any) {
  const { user } = route.params;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleUpdate = async () => {
  try {
    await api.put(`/users/${user.id}`, {
      name,
      email,
      role,
    });
    Alert.alert("Sucesso", "Usuário atualizado!");
    navigation.goBack();
  } catch (err: any) {
    console.error("Erro ao atualizar:", err.response?.data || err.message);
    Alert.alert("Erro", "Não foi possível atualizar usuário.");
  }
};

const handleDelete = async () => {
  try {
    await api.delete(`/users/${user.id}`);
    Alert.alert("Sucesso", "Usuário deletado!");
    navigation.goBack();
  } catch (err: any) {
    console.error("Erro ao deletar:", err.response?.data || err.message);
    Alert.alert("Erro", "Não foi possível deletar usuário.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Usuário</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Deletar Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f7fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#006eff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#006eff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  deleteButton: { backgroundColor: "#ff4444" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

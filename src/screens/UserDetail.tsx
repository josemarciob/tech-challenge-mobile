import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { api } from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function UserDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  
  const { user: currentUser } = useAuth(); 
  const { user: targetUser } = route.params; 
  const [name, setName] = useState(targetUser.name);
  const [email, setEmail] = useState(targetUser.email);

  const handleUpdate = async () => {
    try {
      
      await api.put(`/users/${targetUser.id}`, {
        name,
        email,
        role: targetUser.role, 
      });
      Alert.alert("Sucesso", "Usuário atualizado!");
      navigation.goBack();
    } catch (err: any) {
      console.error("Erro ao atualizar:", err.response?.data || err.message);
      Alert.alert("Erro", "Não foi possível atualizar usuário.");
    }
  };

  const handleDelete = async () => {
    // Validação de segurança
    if (targetUser.id === Number(currentUser?.id)) {
        Alert.alert("Ação Bloqueada", "Você não pode deletar sua própria conta.");
        return;
    }

    try {
    
      await api.delete(`/users/${targetUser.id}`);
      Alert.alert("Sucesso", "Usuário deletado!");
      navigation.goBack();
    } catch (err: any) {
      console.error("Erro ao deletar:", err.response?.data || err.message);
      Alert.alert("Erro", err.response?.data?.error || "Não foi possível deletar usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Usuário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Nome"
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      {/* Só mostra botão de deletar se NÃO for o próprio usuário logado */}
      {targetUser.id !== Number(currentUser?.id) && (
        <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handleDelete}
        >
            <Text style={styles.buttonText}>Deletar Usuário</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f7fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#006eff", textAlign: 'center' },
  label: { fontSize: 14, color: "#666", marginBottom: 4, marginLeft: 4, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16
  },
  button: {
    backgroundColor: "#006eff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4
  },
  deleteButton: { backgroundColor: "#ff4444", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
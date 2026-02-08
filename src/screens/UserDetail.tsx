import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView
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

  const isEditable = currentUser?.role === 'professor';

  const handleUpdate = async () => {
    try {
      await api.put(`/users/${targetUser.id}`, {
        name,
        email,
        role: targetUser.role, 
      });
      Alert.alert("Sucesso", "Dados atualizados!");
      navigation.goBack();
    } catch (err: any) {
      console.error("Erro ao atualizar:", err.response?.data || err.message);
      Alert.alert("Erro", "Não foi possível atualizar.");
    }
  };

  const handleDelete = async () => {
    // Segurança: Não pode se auto-deletar
    if (String(targetUser.id) === String(currentUser?.id)) {
        Alert.alert("Ação Bloqueada", "Você não pode deletar sua própria conta.");
        return;
    }

    try {
      await api.delete(`/users/${targetUser.id}`);
      Alert.alert("Sucesso", "Usuário deletado!");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.error || "Erro ao deletar.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes do Usuário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={[styles.input, !isEditable && styles.disabledInput]} 
        value={name} 
        onChangeText={setName} 
        placeholder="Nome"
        editable={isEditable} 
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={[styles.input, !isEditable && styles.disabledInput]} 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email"
        autoCapitalize="none"
        editable={isEditable} 
      />

      {isEditable && (
        <>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          {/* Botão Deletar (Não aparece se for o próprio professor logado) */}
          {String(targetUser.id) !== String(currentUser?.id) && (
            <TouchableOpacity 
                style={[styles.button, styles.deleteButton]} 
                onPress={handleDelete}
            >
                <Text style={styles.buttonText}>Deletar Usuário</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {!isEditable && (
        <Text style={styles.infoText}>
          Apenas professores podem alterar dados cadastrais.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f5f7fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#006eff", textAlign: 'center' },
  label: { fontSize: 14, color: "#666", marginBottom: 6, fontWeight: "600" },
  
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333"
  },

  disabledInput: {
    backgroundColor: "#f0f2f5",
    color: "#888",
    borderColor: "#eee"
  },

  button: {
    backgroundColor: "#006eff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
    shadowColor: "#006eff", shadowOpacity: 0.2, shadowRadius: 4
  },
  deleteButton: { backgroundColor: "#ff4757", shadowColor: "#ff4757", marginTop: 15 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 13,
    fontStyle: 'italic'
  }
});
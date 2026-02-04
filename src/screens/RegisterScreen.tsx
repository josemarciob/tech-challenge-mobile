import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Alert
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton } from "react-native-paper";
import { api } from "../services/api";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  secretKey?: string;
};

export default function RegisterScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false); 

  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: { role: "student" }, 
  });

  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss(); 

    if (data.password !== data.confirmPassword) {
      Alert.alert("Atenção", "As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        secretKey: data.secretKey
      });

      Alert.alert("Sucesso", "Cadastro realizado! Faça login para continuar.");
      navigation.goBack(); 
    } catch (err: any) {
      console.log("Erro no cadastro:", err);
      
      // Lógica melhorada de erro
      if (err.response) {
        // O backend respondeu com um erro (ex: Email já existe)
        Alert.alert("Erro", err.response.data.error || "Falha ao cadastrar.");
      } else if (err.request) {
        // O backend não respondeu (Timeout / IP errado)
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para acessar o ambiente educacional
          </Text>

          {/* Nome */}
          <Controller
            control={control}
            name="name"
            rules={{ required: "Nome é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Senha */}
          <Controller
            control={control}
            name="password"
            rules={{ required: "Senha é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Confirmar Senha */}
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: "Confirme sua senha" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Perfil */}
          <Text style={styles.sectionTitle}>Perfil de acesso</Text>
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioGroup}>
                  <View style={styles.radioItem}>
                    {/* Valor ajustado para 'student' */}
                    <RadioButton value="student" color="#006eff" />
                    <Text>Estudante</Text>
                  </View>

                  <View style={styles.radioItem}>
                    <RadioButton value="professor" color="#006eff" />
                    <Text>Professor</Text>
                  </View>
                </View>
              </RadioButton.Group>
            )}
          />

          {/* Senha Professor */}
          {role === "professor" && (
            <Controller
              control={control}
              name="secretKey"
              rules={{ required: "Senha secreta obrigatória para professores" }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text style={{color: '#666', marginBottom: 5, fontSize: 12}}>
                    Insira a chave de acesso da escola:
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Chave secreta (ex: 123)"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
          )}

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center", 
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#006eff",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 10
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#006eff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 10
  },
  linkText: {
    color: "#006eff",
    fontWeight: "600",
  },
});
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const { control, handleSubmit, watch } = useForm<FormData>();
  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
      await api.post("/auth/register", data);
      alert("Cadastro realizado com sucesso!");
      navigation.goBack();
    } catch (err) {
      alert("Erro ao cadastrar");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📝 Cadastro</Text>

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

        {/* Confirmar senha */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: "Confirme sua senha" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Role com RadioButton */}
        <Text style={styles.subtitle}>Selecione seu perfil:</Text>
        <Controller
          control={control}
          name="role"
          rules={{ required: "Role é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioGroup}>
                <View style={styles.radioItem}>
                  <RadioButton value="estudante" />
                    <Text>Estudante</Text>
                    <RadioButton value="professor" />
                    <Text>Professor</Text>

                </View>
              </View>
            </RadioButton.Group>
          )}
        />

        {/* Campo secreto só se for professor */}
        {role === "professor" && (
          <Controller
            control={control}
            name="secretKey"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Senha secreta do professor"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#006eff",
  },
  subtitle: { fontSize: 16, marginVertical: 12, fontWeight: "600", color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  radioGroup: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  radioItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  button: {
    backgroundColor: "#006eff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButton: { backgroundColor: "#ffaa00" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

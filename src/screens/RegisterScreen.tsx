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
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: { role: "estudante" },
  });

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
    >
      <ScrollView contentContainerStyle={styles.container}>
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
                    <RadioButton value="estudante" />
                    <Text>Estudante</Text>
                  </View>

                  <View style={styles.radioItem}>
                    <RadioButton value="professor" />
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
              rules={{ required: "Senha secreta obrigatória" }}
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
  justifyContent: "flex-start",
  padding: 20,
  paddingTop: 20, // 👈 controla o quanto sobe
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
  },
  linkText: {
    color: "#006eff",
    fontWeight: "600",
  },
});


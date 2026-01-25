import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen({ navigation }: any) {
  const { control, handleSubmit } = useForm<FormData>();
  const { login, loading } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      // 🚀 NÃO navega manualmente
    } catch {
      Alert.alert("Erro", "Email ou senha inválidos");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#006eff", "#4f9cff"]}
          style={styles.header}
        >
          <Text style={styles.logo}>Ambiente Acadêmico</Text>
          <Text style={styles.subtitle}>Acesse sua conta</Text>
        </LinearGradient>
      </View>

      {/* CARD LOGIN */}
      <View style={styles.card}>
        {/* EMAIL */}
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Mail size={18} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />

        {/* SENHA */}
        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Lock size={18} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />

        {/* BOTÃO LOGIN */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <LogIn size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.divider}>ou</Text>

        {/* CADASTRO */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Register")}
        >
          <UserPlus size={18} color="#006eff" />
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* estilos permanecem os mesmos */


/* CORES */
const COLORS = {
  primary: "#006eff",
  background: "#f5f7fa",
  text: "#333",
  textSecondary: "#777",
};

/* ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerWrapper: {
    overflow: "hidden",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  header: {
    paddingVertical: 48,
    alignItems: "center",
  },

  logo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    fontSize: 15,
    color: "#eaf1ff",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -30,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },

  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 8,
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  divider: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginVertical: 14,
    fontSize: 14,
  },

  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 30,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 16,
  },
});

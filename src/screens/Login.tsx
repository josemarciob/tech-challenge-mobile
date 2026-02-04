import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, LogIn, UserPlus, BookOpen } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { MotiView } from "moti"; 

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
    } catch {
      Alert.alert("Erro", "Email ou senha inválidos");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground 
        source={require('../../assets/TelaInicial.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 110, 255, 0.7)', 'rgba(0, 74, 173, 0.9)']}
          style={styles.overlay}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              
              {/* HEADER */}
              <MotiView 
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800 }}
                style={styles.header}
              >
                <View style={styles.logoCircle}>
                   <BookOpen size={40} color="#FFF" />
                </View>
                <Text style={styles.logoTitle}>Ambiente Acadêmico</Text>
                <Text style={styles.subtitle}>Sua jornada de conhecimento começa aqui</Text>
              </MotiView>

              {/* CARD ANIMADO */}
              <MotiView 
                from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 200 }}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>Login</Text>

                {/* EMAIL */}
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <Mail size={20} color="#006eff" />
                      <TextInput
                        style={styles.input}
                        placeholder="E-mail acadêmico"
                        placeholderTextColor="#999"
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
                      <Lock size={20} color="#006eff" />
                      <TextInput
                        style={styles.input}
                        placeholder="Sua senha"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />

                <TouchableOpacity style={styles.forgotPass}>
                  <Text style={styles.forgotPassText}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                {/* BOTÃO LOGIN */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#006eff", "#004aad"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    {loading ? (
                       <Text style={styles.primaryButtonText}>Acessando...</Text>
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Entrar</Text>
                        <LogIn size={20} color="#fff" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Não tem uma conta?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.linkText}> Cadastre-se</Text>
                  </TouchableOpacity>
                </View>
              </MotiView>

              <Text style={styles.copyright}>© 2026 Ambiente Acadêmico</Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 25 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 50 },
  
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15
  },
  logoTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: 5 },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E1E8EF"
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#333" },
  
  forgotPass: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPassText: { color: "#006eff", fontSize: 13, fontWeight: '500' },

  primaryButton: { height: 55, borderRadius: 15, overflow: 'hidden' },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  primaryButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 25, 
    alignItems: 'center' 
  },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#006eff', fontWeight: 'bold', fontSize: 14 },
  
  copyright: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 30
  }
});
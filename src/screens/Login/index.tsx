import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert, 
  ImageBackground, StatusBar, KeyboardAvoidingView, 
  Platform, ScrollView, ActivityIndicator
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { EnvelopeSimple, Lock, SignIn, BookOpen } from "phosphor-react-native"; 
import { MotiView } from "moti"; 
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../navigation/types";
import { styles } from "./styles"; 


type FormData = {
  email: string;
  password: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { control, handleSubmit } = useForm<FormData>();
  const { login, loading } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Verifique suas credenciais e tente novamente.";
      Alert.alert("Falha no Acesso", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground 
        source={require('../../../assets/TelaInicial.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient colors={['rgba(0, 110, 255, 0.75)', 'rgba(0, 74, 173, 0.95)']} style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              
              {/* Header */}
              <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 800 }} style={styles.header}>
                <View style={styles.logoCircle}>
                   <BookOpen size={44} color="#FFF" weight="duotone" />
                </View>
                <Text style={styles.logoTitle}>Ambiente Acadêmico</Text>
                <Text style={styles.subtitle}>Sua jornada de conhecimento começa aqui</Text>
              </MotiView>

              {/* Card de Login */}
              <MotiView from={{ opacity: 0, scale: 0.9, translateY: 20 }} animate={{ opacity: 1, scale: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 200 }} style={styles.card}>
                <Text style={styles.cardTitle}>Acessar Conta</Text>

                {/* Campo E-mail */}
                <Controller
                  control={control}
                  name="email"
                  rules={{ 
                    required: "E-mail é obrigatório",
                    pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" }
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <View style={[styles.inputContainer, error && styles.inputError]}>
                      <EnvelopeSimple size={22} color={error ? "#ef4444" : "#006eff"} weight="bold" />
                      <TextInput
                        style={styles.input}
                        placeholder="E-mail Cadastrado"
                        placeholderTextColor="#94A3B8"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />

                {/* Campo Senha */}
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Senha é obrigatória" }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <View style={[styles.inputContainer, error && styles.inputError]}>
                      <Lock size={22} color={error ? "#ef4444" : "#006eff"} weight="bold" />
                      <TextInput
                        style={styles.input}
                        placeholder="Sua senha"
                        placeholderTextColor="#94A3B8"
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

                {/* Botão de Ação */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && { opacity: 0.8 }]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                >
                  <LinearGradient colors={["#006eff", "#004aad"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                    {loading ? (
                       <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Entrar</Text>
                        <SignIn size={22} color="#fff" weight="bold" />
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
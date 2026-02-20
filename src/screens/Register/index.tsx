import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Keyboard, ActivityIndicator, Alert, 
  ImageBackground, StatusBar
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { EnvelopeSimple, Lock, User, Key, ArrowLeft } from "phosphor-react-native";
import { MotiView } from "moti";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { api } from "../../services/api";
import { RootStackParamList } from "../../navigation/types";
import { styles } from "./styles";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "professor";
  secretKey?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false); 

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
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
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: data.role,
        secretKey: data.secretKey
      });

      Alert.alert("Sucesso", "Cadastro realizado! Faça login para continuar.");
      navigation.goBack(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Erro ao conectar com o servidor.";
      Alert.alert("Erro no Cadastro", errorMsg);
    } finally {
      setLoading(false);
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
        <LinearGradient colors={['rgba(0, 110, 255, 0.85)', 'rgba(0, 74, 173, 0.95)']} style={styles.overlay}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              
              <MotiView from={{ opacity: 0, scale: 0.95, translateY: 20 }} animate={{ opacity: 1, scale: 1, translateY: 0 }} style={styles.card}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1E293B" weight="bold" />
                </TouchableOpacity>

                <View style={styles.headerTitles}>
                  <Text style={styles.title}>Criar Conta</Text>
                  <Text style={styles.subtitle}>Junte-se ao Ambiente Acadêmico</Text>
                </View>

                {/* Campo Nome */}
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Nome é obrigatório" }}
                  render={({ field: { onChange, value } }) => (
                    <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                      <User size={22} color={errors.name ? "#EF4444" : "#006eff"} weight="duotone" />
                      <TextInput
                        style={styles.input}
                        placeholder="Nome completo"
                        placeholderTextColor="#94A3B8"
                        autoCapitalize="words"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />

                {/* Campo Email */}
                <Controller
                  control={control}
                  name="email"
                  rules={{ 
                    required: "Email é obrigatório",
                    pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                      <EnvelopeSimple size={22} color={errors.email ? "#EF4444" : "#006eff"} weight="duotone" />
                      <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
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
                  rules={{ 
                    required: "Senha é obrigatória",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" } 
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                      <Lock size={22} color={errors.password ? "#EF4444" : "#006eff"} weight="duotone" />
                      <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />

                {/* Campo Confirmar Senha */}
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{ required: "Confirme sua senha" }}
                  render={({ field: { onChange, value } }) => (
                    <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                      <Lock size={22} color={errors.confirmPassword ? "#EF4444" : "#006eff"} weight="duotone" />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmar senha"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />

                <Text style={styles.sectionTitle}>Tipo de Acesso</Text>
                
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <RadioButton.Group onValueChange={onChange} value={value}>
                      <View style={styles.radioGroup}>
                        <TouchableOpacity 
                          style={[styles.radioCard, value === 'student' && styles.radioCardActive]}
                          onPress={() => onChange('student')}
                        >
                          <RadioButton value="student" color="#006eff" /> 
                          <Text style={[styles.radioText, value === 'student' && styles.radioTextActive]}>Estudante</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={[styles.radioCard, value === 'professor' && styles.radioCardActive]}
                          onPress={() => onChange('professor')}
                        >
                          <RadioButton value="professor" color="#006eff" />
                          <Text style={[styles.radioText, value === 'professor' && styles.radioTextActive]}>Professor</Text>
                        </TouchableOpacity>
                      </View>
                    </RadioButton.Group>
                  )}
                />

                {/* Campo Secreto para Professor */}
                {role === "professor" && (
                  <MotiView from={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 75 }}>
                    <Controller
                      control={control}
                      name="secretKey"
                      rules={{ required: "Chave obrigatória" }}
                      render={({ field: { onChange, value } }) => (
                        <View style={[styles.inputContainer, errors.secretKey && styles.inputError]}>
                           <Key size={22} color={errors.secretKey ? "#EF4444" : "#F59E0B"} weight="duotone" />
                           <TextInput
                            style={styles.input}
                            placeholder="Código da Instituição"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                          />
                        </View>
                      )}
                    />
                  </MotiView>
                )}

                <TouchableOpacity 
                  style={[styles.primaryButton, loading && { opacity: 0.8 }]} 
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                >
                   <LinearGradient colors={["#006eff", "#004aad"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                      {loading ? (
                          <ActivityIndicator color="#FFF" />
                      ) : (
                          <Text style={styles.primaryButtonText}>Criar Conta</Text>
                      )}
                    </LinearGradient>
                </TouchableOpacity>

              </MotiView>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
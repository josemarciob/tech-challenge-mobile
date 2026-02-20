import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StatusBar 
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check } from "phosphor-react-native";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AppStackParamList } from "../../navigation/AppStack";
import { styles } from "./styles";

type FormData = { 
  title: string; 
  content: string 
};

type Props = NativeStackScreenProps<AppStackParamList, 'EditPost'>;

export default function EditPostScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { control, handleSubmit, setValue } = useForm<FormData>();
  
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setValue("title", res.data.title);
        setValue("content", res.data.content);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar a atividade.");
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    };
    loadPost();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      await api.put(`/posts/${id}`, {
        title: data.title,
        content: data.content,
        authorId: user?.id, 
      });
      
      Alert.alert("Sucesso", "As alterações foram salvas!");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", "Falha ao atualizar conteúdo.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006eff" />
        <Text style={styles.loaderText}>Buscando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#0F172A" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Mural</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
          
          <Text style={styles.label}>Título</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: "O título é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputTitle}
                placeholder="Título da aula"
                value={value}
                onChangeText={onChange}
                maxLength={80}
                placeholderTextColor="#94A3B8"
              />
            )}
          />

          <Text style={styles.label}>Conteúdo da Aula</Text>
          <Controller
            control={control}
            name="content"
            rules={{ required: "O conteúdo é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputContent}
                placeholder="Escreva o texto aqui..."
                value={value}
                onChangeText={onChange}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#94A3B8"
              />
            )}
          />
        </MotiView>
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.footer}
      >
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)} 
          disabled={saving}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={saving ? ["#CBD5E1", "#94A3B8"] : ["#006eff", "#004aad"]}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.gradientBtn}>
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitText}>Confirmar Alterações</Text>
                  <Check size={22} color="#fff" weight="bold" />
                </>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
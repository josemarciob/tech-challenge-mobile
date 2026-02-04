import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { api } from "../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Save, Check } from "lucide-react-native";
import { MotiView } from "moti";

type FormData = { title: string; content: string };

export default function EditPostScreen() {
  const { control, handleSubmit, setValue } = useForm<FormData>();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { postId } = route.params;
  const { user } = useAuth();
  
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  
    const loadPost = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
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
  }, [postId]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      await api.put(`/posts/${postId}`, {
        title: data.title,
        content: data.content,
        authorId: user?.id,       
        authorName: user?.name,   
      });
      
      Alert.alert("Sucesso", "Atividade atualizada!");
      navigation.goBack();
    } catch (err: any) {
      console.error("Erro ao editar:", err);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#006eff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Customizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Atividade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <MotiView 
          from={{ opacity: 0, translateY: 10 }} 
          animate={{ opacity: 1, translateY: 0 }}
        >
          <Text style={styles.label}>Título</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: "Título é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputTitle}
                placeholder="Título da Atividade"
                value={value}
                onChangeText={onChange}
                maxLength={60}
                placeholderTextColor="#ccc"
              />
            )}
          />

          <Text style={styles.label}>Conteúdo</Text>
          <Controller
            control={control}
            name="content"
            rules={{ required: "Descrição é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputContent}
                placeholder="Descreva a atividade..."
                value={value}
                onChangeText={onChange}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#ccc"
              />
            )}
          />
        </MotiView>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={saving}>
          <LinearGradient
            colors={saving ? ["#ccc", "#ccc"] : ["#006eff", "#00c6ff"]}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitText}>{saving ? "Salvando..." : "Salvar Alterações"}</Text>
            {!saving && <Check size={20} color="#fff" />}
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },

  scroll: { padding: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 8, marginTop: 16 },
  
  
  inputTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#333", 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee", 
    paddingVertical: 10 
  },
  inputContent: { 
    fontSize: 16, 
    color: "#444", 
    minHeight: 200, 
    lineHeight: 24, 
    marginTop: 8 
  },

  
  submitButton: { 
    margin: 24, 
    padding: 18, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    elevation: 4,
    shadowColor: "#006eff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
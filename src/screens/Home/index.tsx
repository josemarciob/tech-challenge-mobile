import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; 
import { SignOut } from "phosphor-react-native";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";

// Componentes da Home
import { StudentDashboard } from "./components/StudentDashboard";
import { ProfessorDashboard } from "./components/ProfessorDashboard";

export default function HomeScreen({ navigation }: any) { 
  const { user, logout, updateUser } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [stats, setStats] = useState({ students: 0, activities: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (!user?.id) return;
        try {
          if (user.role === 'professor') {
            // Rota do Professor
            const { data } = await api.get('/stats/dashboard');
            if (isActive) setStats(data);
          } else {
            // Rota do Aluno
            const { data } = await api.get(`/users/${user.id}`);
            if (isActive) {
              updateUser({
                ...data,
                level: data.level ?? data.nivel ?? 1,
                coins: data.coins ?? data.moedas ?? 0,
              });
            }
          }
        } catch (error) {
          console.error("Home Sync Error:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchData();
      return () => { isActive = false; };
      
    }, [user?.id, user?.role]) 
  );

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006eff" />
        <Text style={styles.loadingText}>Sincronizando ambiente...</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} 
      >
        {user.role === 'professor' ? (
          <ProfessorDashboard stats={stats} navigation={navigation} user={user} />
        ) : (
          <StudentDashboard user={user} navigation={navigation} />
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <SignOut size={20} color="#EF4444" weight="bold" /> 
            <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
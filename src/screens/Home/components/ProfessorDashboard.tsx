import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from "moti";
import { Users, BookOpen, PlusCircle, ClipboardText, ChartLineUp } from "phosphor-react-native";
import { styles } from "../styles";

export const ProfessorDashboard = ({ stats, navigation, user }: any) => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Painel de Gestão</Text>
          <Text style={styles.headerSubtitle}>Bem-vindo, Prof. {user.name.split(' ')[0]}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.adminStatCard}>
          <Text style={styles.adminStatValue}>{stats.students || 0}</Text>
          <Text style={styles.adminStatLabel}>Alunos</Text>
          <Users size={20} color="#3b82f6" weight="duotone" />
        </View>
        <View style={styles.adminStatCard}>
          <Text style={styles.adminStatValue}>{stats.activities || 0}</Text>
          <Text style={styles.adminStatLabel}>Atividades</Text>
          <BookOpen size={20} color="#10b981" weight="duotone" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ferramentas</Text>
      <View style={styles.toolsGrid}>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate("CreatePost")}>
          <PlusCircle size={32} color="#3B82F6" weight="duotone" />
          <Text style={styles.toolButtonText}>Nova Atividade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate("PostsList")}>
          <ClipboardText size={32} color="#8B5CF6" weight="duotone" />
          <Text style={styles.toolButtonText}>Ver Todas</Text>
        </TouchableOpacity>
      </View>

      <MotiView 
        from={{ opacity: 0, translateY: 20 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        style={styles.insightCard}
      >
        <View style={styles.insightHeader}>
          <ChartLineUp size={24} color="#10B981" weight="bold" />
          <Text style={styles.insightTitle}>Insight</Text>
        </View>
        <Text style={styles.insightText}>Sua turma está progredindo rápido!</Text>
      </MotiView>
    </View>
  );
};
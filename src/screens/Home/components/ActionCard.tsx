import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "phosphor-react-native";
import { styles } from "../styles";

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: [string, string, ...string[]]; 
  onPress: () => void;
  fullWidth?: boolean;
}

export const ActionCard = ({ title, subtitle, icon, gradient, onPress, fullWidth = false }: ActionCardProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9} 
      style={fullWidth ? { width: '100%', marginBottom: 14 } : { flex: 1, marginBottom: 14 }}
    >
      <LinearGradient colors={gradient} style={styles.actionCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.actionCardHeader}>
          <View style={styles.actionIconBubble}>{icon}</View>
          <ArrowRight size={20} color="rgba(255,255,255,0.6)" weight="bold" />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
import React, { useState, useCallback, useMemo } from "react";
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar 
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti";
import { 
  MagnifyingGlass, CaretRight, Student, 
  ChalkboardTeacher, Trash, UserMinus 
} from "phosphor-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { api } from "../../services/api";
import { useAuth, User } from "../../context/AuthContext"; 
import { AppStackParamList } from "../../navigation/AppStack";
import { styles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, 'AdminScreen'>;

export default function AdminScreen({ navigation }: Props) {
  const { user: currentUser } = useAuth(); 
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const insets = useSafeAreaInsets();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // O sufixo /api já está na baseURL do api.ts
      const res = await api.get(`/users?page=1&limit=100`);
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { 
    fetchUsers(); 
  }, []));

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  const handleDelete = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
        Alert.alert("Ops!", "Você não pode excluir a sua própria conta.");
        return;
    }

    Alert.alert(
      "Remover Usuário",
      `Deseja realmente excluir ${targetUser.name}? Esta ação é irreversível.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await api.delete(`/users/${targetUser.id}`);
              setUsers(prev => prev.filter(u => u.id !== targetUser.id));
              setTotal(prev => prev - 1);
            } catch (err: any) {
              Alert.alert("Erro", "Falha ao remover usuário.");
            }
          } 
        }
      ]
    );
  };

  const renderUserCard = ({ item, index }: { item: User; index: number }) => {
    const isProf = item.role === "professor";
    const isMe = item.id === currentUser?.id; 

    return (
      <MotiView 
        from={{ opacity: 0, translateX: -20 }} 
        animate={{ opacity: 1, translateX: 0 }} 
        transition={{ delay: index * 50 }}
      >
        <View style={[styles.card, isMe && { borderColor: '#3B82F6', backgroundColor: '#F8FAFC' }]}>
          <TouchableOpacity 
            style={styles.cardClickableArea}
            onPress={() => navigation.navigate("UserDetail", { id: item.id })}
          >
            <View style={[styles.avatar, { backgroundColor: isProf ? '#DBEAFE' : '#DCFCE7' }]}>
              <Text style={[styles.avatarText, { color: isProf ? '#1D4ED8' : '#15803D' }]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name} {isMe && "(Você)"}
              </Text>
              <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
              
              <View style={[styles.badge, { backgroundColor: isProf ? '#3B82F6' : '#10B981' }]}>
                {isProf ? 
                  <ChalkboardTeacher size={12} color="#fff" weight="bold" /> : 
                  <Student size={12} color="#fff" weight="bold" />
                }
                <Text style={styles.badgeText}>{isProf ? "Professor" : "Aluno"}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.cardActions}>
            {!isMe && (
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                <Trash size={20} color="#EF4444" weight="duotone" />
              </TouchableOpacity>
            )}
            <CaretRight size={18} color="#CBD5E1" weight="bold" />
          </View>
        </View>
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Membros</Text>
        <Text style={styles.subtitle}>{total} contas registradas no sistema</Text>
      </View>

      <View style={styles.searchContainer}>
        <MagnifyingGlass size={22} color="#94A3B8" style={styles.searchIcon} weight="bold" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {loading && users.length === 0 ? (
        <ActivityIndicator color="#3B82F6" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderUserCard}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <UserMinus size={64} color="#CBD5E1" weight="duotone" />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
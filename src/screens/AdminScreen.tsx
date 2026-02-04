import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext"; 
import { MotiView } from "moti";
import { Search, ChevronRight, User, GraduationCap, Briefcase, Trash2 } from "lucide-react-native";

export default function AdminScreen({ navigation }: any) {
  const { user } = useAuth(); 
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const limit = 100; 
  const insets = useSafeAreaInsets();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=${limit}`);
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchUsers(); }, [page]));

  // Lógica de exclusão com validação
  const confirmDelete = (targetUser: any) => {
    //VALIDAÇÃO DE SEGURANÇA
    if (targetUser.id === user?.id) {
        Alert.alert("Ação Bloqueada", "Você não pode excluir sua própria conta de administrador.");
        return;
    }

    Alert.alert(
      "Excluir Usuário",
      `Tem certeza que deseja remover ${targetUser.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await api.delete(`/users/${targetUser.id}`);
              setUsers(prev => prev.filter(u => u.id !== targetUser.id));
              Alert.alert("Sucesso", "Usuário removido.");
            } catch (err: any) {
              Alert.alert("Erro", err.response?.data?.error || "Erro ao excluir.");
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item, index }: any) => {
    const isProf = item.role === "professor";
    const isMe = item.id === user?.id; 

    return (
      <MotiView 
        from={{ opacity: 0, translateY: 10 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        transition={{ delay: index * 50, type: 'timing' }}
      >
        <TouchableOpacity 
          style={[styles.card, isMe && { borderColor: '#006eff', borderWidth: 1 }]} 
          onPress={() => navigation.navigate("UserDetail", { user: item })}
          activeOpacity={0.7}
        >
          
          <View style={[styles.avatar, { backgroundColor: isProf ? '#E3F2FD' : '#E8F5E9' }]}>
            <Text style={[styles.avatarText, { color: isProf ? '#1976D2' : '#388E3C' }]}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>
                {item.name} {isMe && "(Você)"}
            </Text>
            <Text style={styles.email}>{item.email}</Text>
            
            <View style={[styles.badge, { backgroundColor: isProf ? '#1976D2' : '#388E3C' }]}>
               {isProf ? <Briefcase size={10} color="#fff" /> : <GraduationCap size={10} color="#fff" />}
               <Text style={styles.badgeText}>{isProf ? "Professor" : "Aluno"}</Text>
            </View>
          </View>

          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            
            <TouchableOpacity 
                onPress={() => confirmDelete(item)}
                style={{ padding: 8 }}
            >
                
                <Trash2 size={20} color={isMe ? "#ccc" : "#FF5252"} />
            </TouchableOpacity>

            <ChevronRight size={20} color="#ccc" />
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestão de Usuários</Text>
        <Text style={styles.subtitle}>{total} usuários cadastrados</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>Nenhum usuário encontrado</Text> : <ActivityIndicator color="#006eff" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8", paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a" },
  subtitle: { fontSize: 14, color: "#666" },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 20, fontWeight: "bold" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  email: { fontSize: 13, color: "#888", marginBottom: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold", textTransform: 'uppercase' },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
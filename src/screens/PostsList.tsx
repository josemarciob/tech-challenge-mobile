import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti";
import { 
  Edit2, 
  Trash2, 
  ChevronRight, 
  FileText, 
  User, 
  CheckCircle, 
  ArrowLeft
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";


export default function PostsList({ navigation }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 
  
  const LIMIT = 5; 

  const fetchPosts = async (pageNumber: number, shouldRefresh = false) => {
    try {
      if (shouldRefresh) setIsLoading(true);
      
      const res = await api.get(`/posts?page=${pageNumber}&limit=${LIMIT}`);
      const newPosts = res.data.data;
      const totalItems = res.data.total;

      if (shouldRefresh) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(posts.length + newPosts.length < totalItems);
      
    } catch (err) { 
      console.log(err); 
    } finally { 
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false); 
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      fetchPosts(1, true);
    }, [])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, false); 
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Excluir Atividade",
      "Tem a certeza que deseja remover esta atividade?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => handleDelete(id) }
      ]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      
      await api.delete(`/posts/${id}`);
      
      
      setPosts(prev => prev.filter(item => item.id !== id));
      Alert.alert("Sucesso", "Atividade removida.");
      
    } catch (err: any) { 
      
      const mensagemDoBackend = err.response?.data?.error;
      const mensagemPadrao = "Não foi possível excluir a atividade.";

      
      Alert.alert("Atenção", mensagemDoBackend || mensagemPadrao); 
    }
  };

  const renderItem = ({ item, index }: any) => (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }} 
      animate={{ opacity: 1, translateY: 0 }} 
      transition={{ delay: index % 10 * 100, type: 'timing' }}
    >
      <TouchableOpacity 
        
        style={[styles.card, item.completed && styles.cardCompleted]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("PostDetail", { id: item.id })}
      >
        <View style={styles.cardHeader}>
          {/* Check Verde se completou, Azul se não */}
          <View style={[styles.iconContainer, item.completed && { backgroundColor: '#ECFDF5' }]}>
             {item.completed ? (
                 <CheckCircle size={20} color="#10B981" />
             ) : (
                 <FileText size={20} color="#006eff" />
             )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={styles.authorBadge}>
              <User size={10} color="#666" />
              <Text style={styles.authorText}>Prof. {item.authorName}</Text>
            </View>
          </View>
          
          {/* BADGE "CONCLUÍDO" */}
          {item.completed ? (
              <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Concluído</Text>
              </View>
          ) : (
              <ChevronRight size={20} color="#DDD" />
          )}
        </View>

        <Text style={styles.preview} numberOfLines={2}>
          {item.content}
        </Text>
        
        <View style={styles.divider} />

        <View style={styles.actionBar}>
           <TouchableOpacity 
             
             style={[styles.btnPrimary, item.completed && { backgroundColor: '#10B981' }]} 
             onPress={() => navigation.navigate("PostDetail", { id: item.id })}
           >
              <Text style={styles.btnPrimaryText}>
                  {item.completed ? "Ver Resultado" : "Visualizar"}
              </Text>
           </TouchableOpacity>

           {user?.role === "professor" && (
             <View style={{ flexDirection: 'row', gap: 10 }}>
               <TouchableOpacity 
                 style={[styles.iconBtn, { backgroundColor: '#FFF3E0' }]} 
                 onPress={() => navigation.navigate("EditPost", { postId: item.id })}
               >
                  <Edit2 size={18} color="#FF9800" />
               </TouchableOpacity>

               <TouchableOpacity 
                 style={[styles.iconBtn, { backgroundColor: '#FFEBEE' }]} 
                 onPress={() => confirmDelete(item.id)}
               >
                  <Trash2 size={18} color="#FF5252" />
               </TouchableOpacity>
             </View>
           )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#006eff" />
        <Text style={styles.loadingText}>Carregando mais atividades...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: '#fff' }}>
        <LinearGradient
          colors={["#006eff", "#00c6ff"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>Mural de Atividades</Text>
              <Text style={styles.headerSubtitle}>
                Acompanhe as últimas atualizações
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2} 
        ListFooterComponent={renderFooter}
        
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh} 
            tintColor="#006eff" 
          />
        }
        
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <FileText size={48} color="#DDD" />
              <Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 50 }}>
              <ActivityIndicator size="large" color="#006eff" />
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#006eff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 12,
    marginRight: 4 
  },

  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 },

  listContent: { padding: 20, paddingTop: 20 },
  
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },

  cardCompleted: {
    borderColor: '#A7F3D0', 
    backgroundColor: '#F0FDF4' 
  },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: { 
    width: 44, height: 44, 
    borderRadius: 14, 
    backgroundColor: '#E3F2FD', 
    justifyContent: 'center', alignItems: 'center', 
    marginRight: 14 
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#1a1a1a", marginBottom: 4 },
  authorBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorText: { fontSize: 12, color: "#666", fontWeight: "500" },
  preview: { fontSize: 14, color: "#666", lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 16 },
  
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btnPrimary: { 
    backgroundColor: '#006eff', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  iconBtn: { 
    width: 36, height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', alignItems: 'center' 
  },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#999', fontSize: 16, marginTop: 10 },

  loadingFooter: {
    paddingVertical: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  loadingText: {
    color: '#006eff',
    fontSize: 12,
    fontWeight: '600'
  },

  // BADGE DE STATUS
  statusBadge: {
      backgroundColor: '#ECFDF5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#34D399'
  },
  statusText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#059669'
  }
});
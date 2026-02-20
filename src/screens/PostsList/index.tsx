import React, { useState, useCallback } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, RefreshControl,
  Alert, ActivityIndicator, StatusBar 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti";
import { 
  PencilSimple, Trash, CaretRight, FileText, 
  User, ArrowLeft 
} from "phosphor-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { AppStackParamList } from "../../navigation/AppStack";
import { styles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, 'PostsList'>;

interface PostItem {
  id: number;
  title: string;
  content: string;
  authorName: string;
  quizAttempts?: { id: number, score: number, postId: number }[]; 
  QuizAttempt?: any[]; 
  attempts?: any[]; 
  finishedBy?: any; 
  finished_by?: any;
}

export default function PostsList({ navigation }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 
  
  const LIMIT = 10; 

  const fetchPosts = async (pageNumber: number, shouldRefresh = false) => {
    try {
      if (shouldRefresh) setIsLoading(true);
      
      const res = await api.get(`/posts?page=${pageNumber}&limit=${LIMIT}`);
      const newPosts = res.data.data || res.data; 
      const totalItems = res.data.total || newPosts.length;

      if (shouldRefresh) {
        setPosts(newPosts);
      } else {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const filteredNew = newPosts.filter((p: PostItem) => !existingIds.has(p.id));
          return [...prev, ...filteredNew];
        });
      }
      setHasMore((pageNumber * LIMIT) < totalItems);
    } catch (err) { 
      Alert.alert("Erro", "Não foi possível carregar o mural."); 
    } finally { 
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false); 
    }
  };

  useFocusEffect(useCallback(() => { fetchPosts(1, true); }, []));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, false); 
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Excluir", "Remover esta atividade permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            await api.delete(`/posts/${id}`);
            setPosts(prev => prev.filter(item => item.id !== id));
          } catch (e) { Alert.alert("Erro", "Falha ao excluir."); }
        }
      }
    ]);
  };

  const renderItem = ({ item, index }: { item: PostItem, index: number }) => {
    
    const isCompleted = (() => {
      const attempts = item.quizAttempts || item.QuizAttempt || item.attempts;
      
      if (Array.isArray(attempts) && attempts.length > 0) {
        return true; 
      }

      const finishedList = item.finishedBy || item.finished_by;
      if (Array.isArray(finishedList)) {
        return finishedList.some(f => (f.userId || f.user_id || f.id || f) === user?.id);
      }
      
      return false; 
    })();

    return (
      <MotiView 
        from={{ opacity: 0, translateY: 20 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        transition={{ delay: index * 50 }}
      >
        <TouchableOpacity 
          style={[styles.card, isCompleted && styles.cardCompleted]}
          onPress={() => navigation.navigate("PostDetail", { id: item.id })}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, isCompleted && { backgroundColor: '#DCFCE7' }]}>
               <FileText size={24} color={isCompleted ? "#10B981" : "#006eff"} weight="duotone" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <View style={styles.authorBadge}>
                <User size={14} color="#64748B" weight="bold" />
                <Text style={styles.authorText}>Prof. {item.authorName}</Text>
              </View>
            </View>
            
            {isCompleted ? (
              <View style={styles.statusBadge}><Text style={styles.statusText}>Feito</Text></View>
            ) : (
              <CaretRight size={20} color="#CBD5E1" weight="bold" />
            )}
          </View>

          <Text style={styles.preview} numberOfLines={2}>{item.content}</Text>
          <View style={styles.divider} />

          <View style={styles.actionBar}>
             <View style={[styles.btnPrimary, isCompleted && { backgroundColor: '#10B981' }]}>
                <Text style={styles.btnPrimaryText}>
                    {isCompleted ? "Revisar Atividade" : "Iniciar Atividade"}
                </Text>
             </View>

             {user?.role === "professor" && (
               <View style={{ flexDirection: 'row', gap: 10 }}>
                 <TouchableOpacity 
                   style={[styles.iconBtn, { backgroundColor: '#FEF3C7' }]} 
                   onPress={() => navigation.navigate("EditPost", { id: item.id })}
                 >
                    <PencilSimple size={18} color="#D97706" weight="bold" />
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]} 
                   onPress={() => handleDelete(item.id)}
                 >
                    <Trash size={18} color="#EF4444" weight="bold" />
                 </TouchableOpacity>
               </View>
             )}
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ backgroundColor: '#fff' }}>
        <LinearGradient
          colors={["#006eff", "#00c6ff"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFF" weight="bold" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Mural</Text>
              <Text style={styles.headerSubtitle}>Atividades e conteúdos</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={isLoadingMore ? (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color="#006eff" />
            <Text style={styles.loadingText}>Buscando mais...</Text>
          </View>
        ) : <View style={{ height: 40 }} />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#006eff" />
        }
        ListEmptyComponent={!isLoading ? (
          <View style={styles.emptyContainer}>
            <FileText size={64} color="#CBD5E1" weight="duotone" />
            <Text style={styles.emptyText}>Nada por aqui ainda.</Text>
          </View>
        ) : <ActivityIndicator size="large" color="#006eff" style={{ marginTop: 60 }} />}
      />
    </View>
  );
}
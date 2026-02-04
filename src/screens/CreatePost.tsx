import React, { useState, useCallback, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  ActivityIndicator, 
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { ArrowLeft, BookOpen, Filter, Tag, ArrowRight, CheckCircle2, Calendar } from "lucide-react-native";
import { MotiView } from "moti";
import { useFocusEffect } from "@react-navigation/native";

export default function CreatePost({ navigation }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // --- ESTADOS ---
  const [activities, setActivities] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // --- FILTROS ---
  const [filterGrade, setFilterGrade] = useState("1ano");
  const [filterPeriod, setFilterPeriod] = useState("1º Bimestre");
  const [filterSubject, setFilterSubject] = useState("Todos");
  
  const [postedTitles, setPostedTitles] = useState<string[]>([]);

  //CARREGA AS ATIVIDADES DO BANCO
  useEffect(() => {
    fetchCurriculum();
  }, [filterGrade, filterPeriod, filterSubject]);

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const res = await api.get('/curriculum', {
        params: { 
            grade: filterGrade, 
            period: filterPeriod, 
            subject: filterSubject 
        }
      });
      setActivities(res.data);
    } catch (error) {
      console.log("Erro ao buscar currículo", error);
    } finally {
      setLoading(false);
    }
  };

  //VERIFICA QUAIS JÁ FORAM POSTADAS
  useFocusEffect(
    useCallback(() => {
      fetchExistingPosts();
    }, [])
  );

  const fetchExistingPosts = async () => {
    try {
      const res = await api.get('/posts?limit=100');
      const titles = res.data.data.map((post: any) => post.title);
      setPostedTitles(titles);
    } catch (error) {
      console.log("Erro ao verificar posts existentes");
    }
  };

  //PUBLICA A ATIVIDADE
  const handlePublish = async (item: any) => {
    Alert.alert(
      "Publicar Atividade",
      `Deseja disponibilizar "${item.title}" para a turma?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: async () => {
            setLoadingId(item.id);
            try {
              
              const res = await api.post("/posts", {
                title: item.title,
                content: item.content,
                authorId: user?.id,
                authorName: user?.name,
                questions: item.questions || [] 
              });

              
              setPostedTitles([...postedTitles, item.title]);
              
              
              navigation.navigate("PostDetail", { id: res.data.id });
            } catch (error) {
              Alert.alert("Erro", "Não foi possível publicar.");
            } finally {
              setLoadingId(null);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: any) => {
    const isPosted = postedTitles.includes(item.title);

    return (
      <MotiView 
        from={{ opacity: 0, translateY: 20 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        transition={{ delay: index * 50, type: 'timing' }}
      >
        <TouchableOpacity 
          style={[styles.card, isPosted && styles.cardDisabled]} 
          activeOpacity={isPosted ? 1 : 0.9}
          onPress={() => !isPosted && handlePublish(item)}
          disabled={isPosted}
        >
          {/* TÓPICO */}
          {item.topic && (
             <View style={styles.topicBadge}>
                <Text style={styles.topicText}>{item.topic}</Text>
             </View>
          )}

          {/* Header do Card */}
          <View style={styles.cardHeader}>
            <View style={[styles.badgeContainer, isPosted && {backgroundColor: '#F1F5F9'}]}>
               <Tag size={12} color={isPosted ? "#94A3B8" : "#006eff"} />
               <Text style={[styles.badgeText, isPosted && {color: "#94A3B8"}]}>{item.subject}</Text>
            </View>
            <Text style={[styles.bnccCode, isPosted && {color: "#94A3B8"}]}>{item.bnccCode}</Text>
          </View>
  
          {/* Título e Preview */}
          <Text style={[styles.cardTitle, isPosted && {color: "#64748B"}]}>{item.title}</Text>
          <Text style={styles.cardPreview} numberOfLines={3}>{item.content}</Text>
  
          {/* Botão de Ação */}
          <View style={styles.cardFooter}>
             <View style={[
                 styles.publishBtn, 
                 isPosted ? styles.postedBtn : styles.activeBtn 
             ]}>
                {loadingId === item.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : isPosted ? (
                  <>
                    <Text style={styles.postedText}>Disponibilizado</Text>
                    <CheckCircle2 size={16} color="#10B981" />
                  </>
                ) : (
                  <>
                    <Text style={styles.publishText}>Publicar Agora</Text>
                    <ArrowRight size={16} color="#fff" />
                  </>
                )}
             </View>
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER FIXO */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>Planejamento</Text>
            <Text style={styles.headerSubtitle}>Banco da BNCC</Text>
        </View>
        <View style={styles.iconHeader}>
            <BookOpen size={24} color="#006eff" />
        </View>
      </View>

      {/* ÁREA DE FILTROS */}
      <View style={styles.filterSection}>
        
        {/* Filtro de Ano */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {["1ano", "2ano", "3ano"].map(grade => (
                <TouchableOpacity 
                    key={grade} 
                    onPress={() => setFilterGrade(grade)}
                    style={[styles.filterChip, filterGrade === grade && styles.filterChipActive]}
                >
                    <Text style={[styles.filterText, filterGrade === grade && styles.filterTextActive]}>
                        {grade.replace("ano", "º Ano")}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Filtro de Bimestre*/}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"].map(period => (
                <TouchableOpacity 
                    key={period} 
                    onPress={() => setFilterPeriod(period)}
                    style={[styles.filterChip, filterPeriod === period && styles.filterChipActivePeriod]}
                >
                    <Calendar size={12} color={filterPeriod === period ? "#fff" : "#64748B"} style={{marginRight:4}} />
                    <Text style={[styles.filterText, filterPeriod === period && styles.filterTextActive]}>
                        {period}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Filtro de Matéria */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Todos", "Matemática", "História", "Física", "Química", "Redação"].map(subj => (
                <TouchableOpacity 
                    key={subj} 
                    onPress={() => setFilterSubject(subj)}
                    style={[styles.filterChip, filterSubject === subj && styles.filterChipActiveSubject]}
                >
                    <Text style={[styles.filterText, filterSubject === subj && styles.filterTextActive]}>
                        {subj}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* LISTA DE CARDS */}
      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="#006eff"/>
            <Text style={{color:'#999', marginTop:10}}>Buscando atividades...</Text>
        </View>
      ) : (
        <FlatList
            data={activities}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Filter size={40} color="#CBD5E1" />
                    <Text style={styles.emptyText}>Nenhuma atividade encontrada para este filtro.</Text>
                </View>
            }
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff', 
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9', zIndex: 10 
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  headerSubtitle: { fontSize: 12, color: "#64748B" },
  iconHeader: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },

  filterSection: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, zIndex: 5 },
  
  filterChip: { flexDirection:'row', alignItems:'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: '#1E293B', borderColor: '#1E293B' }, // Ano 
  filterChipActivePeriod: { backgroundColor: '#006eff', borderColor: '#006eff' }, // Bimestre 
  filterChipActiveSubject: { backgroundColor: '#10B981', borderColor: '#10B981' }, // Matéria 
  filterText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },

  listContent: { padding: 20, paddingBottom: 50 },

  // CARDS
  card: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, 
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2
  },
  cardDisabled: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9', shadowOpacity: 0 },
  
  topicBadge: { alignSelf:'flex-start', backgroundColor:'#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  topicText: { color: '#006eff', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#006eff', textTransform: 'uppercase' },
  bnccCode: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },

  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 8, lineHeight: 24 },
  cardPreview: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 20 },

  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  
  publishBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12 
  },
  activeBtn: { backgroundColor: '#006eff' },
  postedBtn: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' }, 

  publishText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  postedText: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 16 }
});
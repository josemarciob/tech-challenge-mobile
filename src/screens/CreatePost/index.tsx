import React, { useState, useCallback, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, FlatList, 
  ScrollView, ActivityIndicator, Alert, StatusBar 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { 
  ArrowLeft, BookOpen, Funnel, Tag, 
  ArrowRight, CheckCircle, Calendar 
} from "phosphor-react-native";
import { MotiView } from "moti";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { AppStackParamList } from "../../navigation/AppStack";
import { styles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, 'CreatePost'>;

interface CurriculumItem {
  id: number;
  title: string;
  content: string;
  subject: string;
  bnccCode: string;
  topic?: string;
  questions: any[];
}

export default function CreatePost({ navigation }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [activities, setActivities] = useState<CurriculumItem[]>([]); 
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const [filterGrade, setFilterGrade] = useState("1ano");
  const [filterPeriod, setFilterPeriod] = useState("1º Bimestre");
  const [filterSubject, setFilterSubject] = useState("Todos");
  const [postedTitles, setPostedTitles] = useState<string[]>([]);

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const res = await api.get('/curriculum', {
        params: { grade: filterGrade, period: filterPeriod, subject: filterSubject }
      });
      setActivities(res.data);
    } catch (error) {
      console.error("Erro BNCC:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingPosts = async () => {
    try {
      const res = await api.get('/posts?limit=50');
      const titles = res.data.data.map((post: any) => post.title);
      setPostedTitles(titles);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchCurriculum(); }, [filterGrade, filterPeriod, filterSubject]);
  useFocusEffect(useCallback(() => { fetchExistingPosts(); }, []));

  const handlePublish = async (item: CurriculumItem) => {
    Alert.alert(
      "Publicar Atividade",
      `Deseja disponibilizar "${item.title}" para a turma agora?`,
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
                questions: item.questions || [] 
              });

              setPostedTitles(prev => [...prev, item.title]);
              Alert.alert("Sucesso!", "Atividade publicada.");
              navigation.navigate("PostDetail", { id: res.data.id });
            } catch (error) {
              Alert.alert("Erro", "Não foi possível publicar a atividade.");
            } finally {
              setLoadingId(null);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: { item: CurriculumItem; index: number }) => {
    const isPosted = postedTitles.includes(item.title);

    return (
      <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 50 }}>
        <TouchableOpacity 
          style={[styles.card, isPosted && styles.cardDisabled]} 
          onPress={() => !isPosted && handlePublish(item)}
          disabled={isPosted || loadingId === item.id}
        >
          {item.topic && (
             <View style={styles.topicBadge}><Text style={styles.topicText}>{item.topic}</Text></View>
          )}

          <View style={styles.cardHeader}>
            <View style={styles.badgeContainer}>
                <Tag size={14} color={isPosted ? "#94A3B8" : "#006eff"} weight="bold" />
                <Text style={[styles.badgeText, isPosted && {color: "#94A3B8"}]}>{item.subject}</Text>
            </View>
            <Text style={styles.bnccCode}>{item.bnccCode}</Text>
          </View>
  
          <Text style={[styles.cardTitle, isPosted && {color: "#64748B"}]}>{item.title}</Text>
          <Text style={styles.cardPreview} numberOfLines={3}>{item.content}</Text>
  
          <View style={styles.cardFooter}>
             <View style={[styles.publishBtn, isPosted ? styles.postedBtn : styles.activeBtn]}>
                {loadingId === item.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : isPosted ? (
                  <>
                    <Text style={styles.postedText}>Atividade Ativa</Text>
                    <CheckCircle size={18} color="#10B981" weight="fill" />
                  </>
                ) : (
                  <>
                    <Text style={styles.publishText}>Publicar para a Turma</Text>
                    <ArrowRight size={18} color="#fff" weight="bold" />
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
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#0F172A" weight="bold" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.headerTitle}>Planejamento</Text>
            <Text style={styles.headerSubtitle}>Currículo BNCC Oficial</Text>
        </View>
        <View style={styles.iconHeader}><BookOpen size={22} color="#006eff" weight="duotone" /></View>
      </View>

      <View style={styles.filterSection}>
        {/* Anos */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {["1ano", "2ano", "3ano"].map(grade => (
                <TouchableOpacity key={grade} onPress={() => setFilterGrade(grade)}
                    style={[styles.filterChip, filterGrade === grade && styles.filterChipActiveGrade]}>
                    <Text style={[styles.filterText, filterGrade === grade && styles.filterTextActive]}>
                        {grade.replace("ano", "º Ano")}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Bimestres */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"].map(period => (
                <TouchableOpacity key={period} onPress={() => setFilterPeriod(period)}
                    style={[styles.filterChip, filterPeriod === period && styles.filterChipActivePeriod]}>
                    <Calendar size={14} color={filterPeriod === period ? "#fff" : "#64748B"} weight="bold" style={{marginRight:6}} />
                    <Text style={[styles.filterText, filterPeriod === period && styles.filterTextActive]}>{period}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Matérias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Todos", "Matemática", "Português", "Ciências", "História", "Geografia"].map(subj => (
                <TouchableOpacity key={subj} onPress={() => setFilterSubject(subj)}
                    style={[styles.filterChip, filterSubject === subj && styles.filterChipActiveSubject]}>
                    <Text style={[styles.filterText, filterSubject === subj && styles.filterTextActive]}>{subj}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#006eff"/>
            <Text style={styles.loadingText}>Acessando Base de Dados...</Text>
        </View>
      ) : (
        <FlatList data={activities} keyExtractor={item => String(item.id)} renderItem={renderItem}
            contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Funnel size={64} color="#CBD5E1" weight="duotone" />
                    <Text style={styles.emptyText}>Nenhuma atividade encontrada para os filtros selecionados.</Text>
                </View>
            }
        />
      )}
    </View>
  );
}
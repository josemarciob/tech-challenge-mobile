import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  ActivityIndicator, 
  Alert,
  Platform,
  StatusBar
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Clock, Play, X, CheckCircle, AlertCircle, RotateCcw, Share2, BookOpen, Lock, Trophy } from "lucide-react-native";
import { MotiView } from "moti"; 
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../services/api";

export default function PostDetail({ route, navigation }: any) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados do Quiz
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Controle de Progresso
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(2);
  const [bestScore, setBestScore] = useState(0);

  // Recompensa
  const [reward, setReward] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
      setAttempts(response.data.attemptsCount || 0);
      setBestScore(response.data.bestScore || 0);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a atividade");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = async (isCorrect: boolean) => {
    let currentScore = score;
    if (isCorrect) {
        currentScore = score + 1;
        setScore(currentScore);
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < post.questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      await finishActivity(currentScore);
    }
  };

  const finishActivity = async (finalScore: number) => {
    try {
        // Envia tentativa
        const res = await api.post(`/posts/${id}/finish`, {
            score: finalScore
        });
        
        setReward(res.data);
        
        setAttempts(prev => prev + 1);
        if (finalScore > bestScore) setBestScore(finalScore);

        setShowResult(true); 
    } catch (error: any) {
        if (error.response?.status === 403) {
            Alert.alert("Aviso", error.response.data.error);
            if (post) setBestScore(post.questions.length);
        }
        setShowResult(true); 
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setReward(null);
  };

  const handleStartQuiz = () => {
    restartQuiz(); 
    setIsQuizOpen(true);
  };

  //LÓGICA DE BLOQUEIO ---
  const isPerfectScore = post && bestScore === post.questions.length;
  const isAttemptsExhausted = attempts >= maxAttempts;
  const isLocked = isAttemptsExhausted || isPerfectScore;

  if (loading) return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" color="#006eff" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* HEADER */}
      <View style={{ zIndex: 1 }}>
          <LinearGradient
              colors={['rgba(0,110,255,0.08)', 'rgba(255,255,255,0)']}
              style={[styles.heroBackground, { paddingTop: insets.top + 10 }]}
          >
              <View style={styles.navBar}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                      <ArrowLeft color="#1E293B" size={24} />
                  </TouchableOpacity>
                  <View style={styles.actions}>
                      <TouchableOpacity style={styles.iconButton}>
                          <Share2 color="#1E293B" size={20} />
                      </TouchableOpacity>
                  </View>
              </View>
          </LinearGradient>
      </View>

      {/* CONTEÚDO */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <MotiView from={{opacity: 0, translateY: 10}} animate={{opacity: 1, translateY: 0}}>
            <View style={styles.categoryBadge}>
                <BookOpen size={12} color="#006eff" />
                <Text style={styles.categoryText}>AULA TEÓRICA</Text>
            </View>

            <Text style={styles.title}>{post?.title}</Text>
            
            <View style={styles.metaRow}>
                <View style={styles.authorInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarLetter}>{post?.authorName?.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text style={styles.authorName}>Prof. {post?.authorName}</Text>
                        <Text style={styles.postDate}>Material Oficial</Text>
                    </View>
                </View>
                <View style={styles.timeBadge}>
                    <Clock size={12} color="#64748B" />
                    <Text style={styles.timeText}>5 min</Text>
                </View>
            </View>
            
            <View style={styles.divider} />
            <Text style={styles.body}>{post?.content}</Text>
        </MotiView>
      </ScrollView>

      {/* FOOTER */}
      {post?.questions?.length > 0 && (
        <MotiView 
            from={{translateY: 100}} animate={{translateY: 0}} 
            style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}
        >
          {isLocked ? (
              //CONCLUÍDO / BLOQUEADO ---
              <View style={[
                  styles.lockedContainer, 
                  isPerfectScore && { borderColor: '#10B981', backgroundColor: '#ECFDF5' }
              ]}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom: 8}}>
                    <Text style={[styles.lockedTitle, isPerfectScore && { color: '#047857' }]}>
                        {isPerfectScore ? "Atividade Concluída!" : "Tentativas Esgotadas"}
                    </Text>
                    {isPerfectScore ? <Trophy size={20} color="#10B981" /> : <Lock size={20} color="#64748B" />}
                  </View>
                  
                  <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
                      <Text style={[styles.lockedSub, isPerfectScore && { color: '#047857' }]}>
                          Nota Final: {bestScore}/{post.questions.length}
                      </Text>
                      {!isPerfectScore && (
                          <View style={styles.lockBadge}>
                              <Text style={styles.lockText}>{attempts}/{maxAttempts} tentativas</Text>
                          </View>
                      )}
                  </View>
              </View>
          ) : (
              //LIBERADO ---
              <TouchableOpacity style={styles.btnStart} onPress={handleStartQuiz} activeOpacity={0.9}>
                <LinearGradient
                    colors={['#006eff', '#005bb5']}
                    style={styles.gradientBtn}
                    start={{x:0, y:0}} end={{x:1, y:0}}
                >
                    <Play fill="#fff" color="#fff" size={20} />
                    <Text style={styles.btnStartText}>
                        Iniciar Quiz ({attempts}/{maxAttempts})
                    </Text>
                </LinearGradient>
              </TouchableOpacity>
          )}
        </MotiView>
      )}

      {/* MODAL DO QUIZ / RESULTADO */}
      <Modal visible={isQuizOpen} animationType="slide" onRequestClose={() => setIsQuizOpen(false)}>
        <View style={[styles.quizContainer, { paddingTop: insets.top + 20 }]}>
            
            <View style={styles.quizHeader}>
                <TouchableOpacity onPress={() => setIsQuizOpen(false)} style={styles.closeBtn}>
                    <X color="#64748B" size={24} />
                </TouchableOpacity>
                
                {/* Esconde barra de progresso se for tela de resultado */}
                {!showResult && (
                    <>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / post?.questions.length) * 100}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{currentQuestionIndex + 1}/{post?.questions.length}</Text>
                    </>
                )}
            </View>

            {!showResult ? (
                <View style={styles.questionBox}>
                    <MotiView key={currentQuestionIndex} from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
                        <Text style={styles.questionText}>{post?.questions[currentQuestionIndex].text}</Text>
                        <View style={{ gap: 12 }}>
                            {post?.questions[currentQuestionIndex].options.map((opt: any) => (
                                <TouchableOpacity key={opt.id} style={styles.optionBtn} onPress={() => handleAnswer(opt.isCorrect)} activeOpacity={0.7}>
                                    <View style={styles.radioOuter}><View style={styles.radioInner} /></View>
                                    <Text style={styles.optionText}>{opt.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </MotiView>
                </View>
            ) : (
                <View style={styles.resultBox}>
                    <CheckCircle size={80} color={reward?.xpEarned > 0 ? "#10B981" : "#F59E0B"} style={{marginBottom:10}} />
                    
                    <Text style={styles.resultTitle}>
                        {score / post.questions.length === 1 
                            ? "Perfeito! 🌟" 
                            : score / post.questions.length >= 0.7 
                                ? "Mandou bem!" 
                                : "Continue Tentando!"}
                    </Text>
                    <Text style={styles.resultSub}>
                        Você acertou <Text style={{fontWeight:'bold', color:'#0F172A'}}>{score}</Text> de {post.questions.length} questões
                    </Text>
                    
                    {/* ÁREA DE RECOMPENSA */}
                    {reward && (
                        reward.xpEarned > 0 ? (
                            // SE MELHOROU E GANHOU
                            <MotiView 
                                from={{ opacity: 0, scale: 0.8, translateY: 20 }}
                                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                transition={{ delay: 300 }}
                                style={styles.rewardBox}
                            >
                                <Text style={styles.rewardLabel}>RECOMPENSA RECEBIDA</Text>
                                <View style={styles.rewardRow}>
                                    <Text style={styles.rewardValue}>+{reward.xpEarned} XP</Text>
                                    <View style={styles.dividerVertical} />
                                    <Text style={styles.rewardValue}>+{reward.coinsEarned} Moedas</Text>
                                </View>
                                
                                {reward.leveledUp && (
                                    <MotiView 
                                        from={{ scale: 0.8 }} animate={{ scale: 1.1 }} 
                                        transition={{ loop: true, type: 'timing', duration: 1000 }}
                                        style={styles.levelUpBadge}
                                    >
                                        <Text style={styles.levelUpText}>SUBIU DE NÍVEL! 🚀</Text>
                                    </MotiView>
                                )}
                            </MotiView>
                        ) : (
                            
                            <View style={[styles.rewardBox, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                                <Text style={[styles.rewardLabel, { color: '#94A3B8' }]}>SEM PONTOS EXTRAS</Text>
                                <Text style={{ textAlign:'center', color: '#64748B', fontSize: 13, marginTop: 5, fontWeight: '500' }}>
                                    Você não superou sua pontuação anterior.
                                </Text>
                            </View>
                        )
                    )}

                    <TouchableOpacity style={styles.btnResultPrimary} onPress={() => setIsQuizOpen(false)}>
                        <Text style={styles.btnStartText}>Concluir Atividade</Text>
                    </TouchableOpacity>
                    
                    {/* Se não estiver bloqueado, pode tentar de novo */}
                    {!isLocked && (
                        <TouchableOpacity onPress={restartQuiz} style={styles.retryBtn}>
                            <RotateCcw size={16} color="#006eff" />
                            <Text style={styles.retryText}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroBackground: { paddingBottom: 20 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  actions: { flexDirection: 'row', gap: 10 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 160 },
  
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, backgroundColor: '#EFF6FF', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  categoryText: { color: '#006eff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', lineHeight: 34, marginBottom: 20, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  authorName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  postDate: { fontSize: 12, color: '#64748B' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 24 },
  body: { fontSize: 18, lineHeight: 30, color: '#334155', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'Roboto' },
  
  footer: { padding: 20, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderColor: '#F1F5F9' },
  btnStart: { borderRadius: 16, overflow: 'hidden', shadowColor: "#006eff", shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  gradientBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, gap: 10 },
  btnStartText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  
  lockedContainer: { alignItems: 'center', backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  lockedTitle: { fontWeight: 'bold', fontSize: 16, color: '#1E293B' },
  lockedSub: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  lockText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },

  quizContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  quizHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 30, gap: 15 },
  closeBtn: { padding: 4 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#006eff', borderRadius: 3 },
  progressText: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  
  questionBox: { padding: 24, flex: 1 },
  questionText: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#1E293B', lineHeight: 32 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' }, 
  optionText: { fontSize: 16, color: '#334155', fontWeight: '500', flex: 1 },
  
  resultBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff' },
  resultTitle: { fontSize: 28, fontWeight: '800', marginTop: 20, marginBottom: 8, color: '#1E293B' },
  resultSub: { fontSize: 16, color: '#64748B', marginBottom: 30 },
  
  rewardBox: { backgroundColor: '#ECFDF5', padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 40, width: '100%', borderWidth: 1, borderColor: '#10B981' },
  rewardLabel: { fontSize: 11, fontWeight: '900', color: '#059669', letterSpacing: 1.5, marginBottom: 10 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  rewardValue: { fontSize: 22, fontWeight: '800', color: '#047857' },
  dividerVertical: { width: 1, height: 20, backgroundColor: '#6EE7B7' },
  
  levelUpBadge: { marginTop: 15, backgroundColor: '#FFFBEB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#FCD34D' },
  levelUpText: { fontSize: 14, fontWeight: '900', color: '#D97706' },

  btnResultPrimary: { width: '100%', backgroundColor: '#0F172A', padding: 18, borderRadius: 16, alignItems: 'center' },
  retryBtn: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10 },
  retryText: { color: '#64748B', fontWeight: '600' }
});
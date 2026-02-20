import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  ArrowLeft, Clock, Play, X, CheckCircle, 
  ArrowsCounterClockwise, ShareNetwork, BookOpen, 
  Lock, Trophy, Smiley, Star 
} from "phosphor-react-native"; 
import { MotiView } from "moti"; 
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AppStackParamList } from "../../navigation/AppStack";
import { styles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, 'PostDetail'>;

export default function PostDetail({ route, navigation }: Props) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(2);
  const [bestScore, setBestScore] = useState(0);
  const [reward, setReward] = useState<any>(null);

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
      setAttempts(response.data.attemptsCount || 0);
      setBestScore(response.data.bestScore || 0);
    } catch (error) {
      Alert.alert("Erro", "Atividade não encontrada.");
      navigation.goBack();
    } finally { setLoading(false); }
  }

  const handleAnswer = async (isCorrect: boolean) => {
    const currentScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(currentScore);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < (post?.questions?.length || 0)) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      await finishActivity(currentScore);
    }
  };

  const finishActivity = async (finalScore: number) => {
    try {
        const res = await api.post(`/posts/${id}/finish`, { score: finalScore });
        const data = res.data;
        
        setReward(data);
        setAttempts(prev => prev + 1);
        if (finalScore > bestScore) setBestScore(finalScore);

        if (user && data.xpEarned > 0) {
          updateUser({
            xp: user.xp + data.xpEarned,
            coins: user.coins + data.coinsEarned,
            level: data.leveledUp ? user.level + 1 : user.level
          });
        }
        setShowResult(true); 
    } catch (error: any) {
        if (error.response?.status === 403) {
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

  const isPerfectScore = post && bestScore === post.questions?.length;
  const isAttemptsExhausted = attempts >= maxAttempts;
  const isLocked = isAttemptsExhausted || isPerfectScore;

  if (loading) return (
    <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006eff" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={{ zIndex: 1 }}>
          <LinearGradient colors={['rgba(0,110,255,0.06)', 'rgba(255,255,255,0)']} style={[styles.heroBackground, { paddingTop: insets.top + 10 }]}>
              <View style={styles.navBar}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                      <ArrowLeft color="#0F172A" size={24} weight="bold" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                      <ShareNetwork color="#0F172A" size={22} weight="bold" />
                  </TouchableOpacity>
              </View>
          </LinearGradient>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MotiView from={{opacity: 0, translateY: 15}} animate={{opacity: 1, translateY: 0}}>
            <View style={styles.categoryBadge}>
                <BookOpen size={14} color="#006eff" weight="fill" />
                <Text style={styles.categoryText}>AULA TEÓRICA</Text>
            </View>

            <Text style={styles.title}>{post?.title}</Text>
            
            <View style={styles.metaRow}>
                <View style={styles.authorInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarLetter}>{post?.authorName?.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View>
                        <Text style={styles.authorName}>Prof. {post?.authorName}</Text>
                        <Text style={styles.postDate}>Módulo Acadêmico</Text>
                    </View>
                </View>
                <View style={styles.timeBadge}>
                    <Clock size={14} color="#64748B" weight="bold" />
                    <Text style={styles.timeText}>5 min</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.body}>{post?.content}</Text>
        </MotiView>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {isLocked ? (
            <MotiView from={{scale: 0.9}} animate={{scale: 1}} style={[styles.lockedContainer, isPerfectScore && { borderColor: '#10B981', backgroundColor: '#F0FDF4' }]}>
                <View style={styles.lockedHeader}>
                  <Text style={[styles.lockedTitle, isPerfectScore && { color: '#15803D' }]}>
                      {isPerfectScore ? "Excelente Desempenho!" : "Limite de Tentativas"}
                  </Text>
                  {isPerfectScore ? <Trophy size={22} color="#10B981" weight="fill" /> : <Lock size={22} color="#64748B" weight="fill" />}
                </View>
                <View style={styles.lockedFooterRow}>
                    <Text style={styles.lockedSub}>Melhor Nota: {bestScore}/{post?.questions?.length}</Text>
                    {!isPerfectScore && (
                      <View style={styles.lockBadge}><Text style={styles.lockText}>{attempts}/{maxAttempts} tentativas</Text></View>
                    )}
                </View>
            </MotiView>
        ) : (
            <TouchableOpacity style={styles.btnStart} onPress={() => { restartQuiz(); setIsQuizOpen(true); }} activeOpacity={0.9}>
              <LinearGradient colors={['#006eff', '#004aad']} style={styles.gradientBtn} start={{x:0, y:0}} end={{x:1, y:0}}>
                  <Play color="#fff" size={24} weight="fill" />
                  <View>
                      <Text style={styles.btnStartText}>Iniciar Desafio</Text>
                      <Text style={styles.btnSubText}>Ganha XP e Moedas ao acertar</Text>
                  </View>
              </LinearGradient>
            </TouchableOpacity>
        )}
      </View>

      <Modal visible={isQuizOpen} animationType="slide">
        <View style={[styles.quizContainer, { paddingTop: insets.top + 20 }]}>
            <View style={styles.quizHeader}>
                <TouchableOpacity onPress={() => setIsQuizOpen(false)} style={styles.iconButton}>
                    <X color="#64748B" size={24} weight="bold" />
                </TouchableOpacity>
                {!showResult && (
                  <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / post?.questions?.length) * 100}%` }]} />
                  </View>
                )}
                {!showResult && <Text style={styles.progressText}>{currentQuestionIndex + 1}/{post?.questions?.length}</Text>}
            </View>

            {!showResult ? (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.questionBox}>
                    <MotiView key={currentQuestionIndex} from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }}>
                        <Text style={styles.questionText}>{post?.questions?.[currentQuestionIndex]?.text}</Text>
                        {post?.questions?.[currentQuestionIndex]?.options?.map((opt: any) => (
                            <TouchableOpacity key={opt.id} style={styles.optionBtn} onPress={() => handleAnswer(opt.isCorrect)}>
                                <View style={styles.radioOuter} />
                                <Text style={styles.optionText}>{opt.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </MotiView>
                </ScrollView>
            ) : (
                <View style={styles.resultBox}>
                    <MotiView from={{scale: 0.5}} animate={{scale: 1}} transition={{type:'spring'}}>
                      {score === post?.questions?.length ? <Star size={80} color="#F59E0B" weight="fill" /> : <Smiley size={80} color="#10B981" weight="fill" />}
                    </MotiView>
                    <Text style={styles.resultTitle}>{score === post?.questions?.length ? "Perfeito! 🌟" : "Mandou bem!"}</Text>
                    <Text style={styles.resultSub}>Você acertou {score} de {post?.questions?.length} questões</Text>
                    
                    {reward && reward.xpEarned > 0 ? (
                        <View style={styles.rewardBox}>
                            <Text style={styles.rewardLabel}>RECOMPENSA ACADÊMICA</Text>
                            <View style={styles.rewardRow}>
                                <Text style={styles.rewardValue}>+{reward.xpEarned} XP</Text>
                                <Text style={styles.rewardValue}>+{reward.coinsEarned} Moedas</Text>
                            </View>
                            {reward.leveledUp && (
                              <MotiView from={{ scale: 0.8 }} animate={{ scale: 1.1 }} transition={{ loop: true, type: 'timing', duration: 1000 }} style={styles.levelUpBadge}>
                                <Text style={styles.levelUpText}>NOVO NÍVEL ALCANÇADO! 🚀</Text>
                              </MotiView>
                            )}
                        </View>
                    ) : (
                        <View style={[styles.rewardBox, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                            <Text style={[styles.rewardLabel, { color: '#94A3B8' }]}>SEM PONTOS EXTRAS</Text>
                            <Text style={{ textAlign:'center', color: '#64748B', fontWeight:'600' }}>Tente superar sua pontuação anterior!</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.btnResultPrimary} onPress={() => setIsQuizOpen(false)}>
                        <Text style={styles.btnStartText}>Finalizar</Text>
                    </TouchableOpacity>
                    
                    {!isLocked && (
                        <TouchableOpacity onPress={restartQuiz} style={styles.retryBtn}>
                            <ArrowsCounterClockwise size={20} color="#006eff" weight="bold" />
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